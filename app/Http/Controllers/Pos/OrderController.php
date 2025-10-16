<?php

// app/Http/Controllers/Pos/OrderController.php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Models\FinancialAccount;
use App\Models\GeneralLedger;
use App\Models\Order;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Student;
use App\Models\SyncLog;
use App\Models\UnitStock;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

// Tambahkan ini jika model sudah ada

// Import untuk kode status

class OrderController extends Controller
{

    public function index()
    {
        $cashierUnitId = auth()->user()->unit_id;

        if (! $cashierUnitId) {
            return redirect()->route('dashboard')->with('error', 'Akun Anda tidak terikat ke unit manapun.');
        }

        return Inertia::render('Pos/Index', [
            'cashierUnit' => auth()->user()->unit, // Kirim data unit kasir
        ]);
    }

    public function searchSantri(Request $request)
    {
        $request->validate(['card_uid' => 'required|string']);
        $santri = Student::where('card_uid', $request->card_uid)
            ->with('wallet')
            ->first(['id', 'name', 'daily_limit']);

        if (! $santri) {
            return response()->json(['message' => 'Kartu tidak terdaftar.'], 404);
        }
        $balance = $santri->wallet ? $santri->wallet->current_balance : 0;

        $totalJajanHariIni = Order::where('student_id', $santri->id)
            ->whereDate('created_at', today())
            ->whereIn('payment_method', ['e_card', 'mixed'])
            ->sum('paid_e_card');

        return response()->json([
            'id'                   => $santri->id,
            'name'                 => $santri->name,
            'current_balance'      => $balance,
            'daily_limit'          => $santri->daily_limit ?? 0,
            'total_jajan_hari_ini' => $totalJajanHariIni,
        ]);
    }

    public function getUnitProducts()
    {
        $cashierUnitId = auth()->user()->unit_id;

        $products = UnitStock::where('unit_id', $cashierUnitId)
            ->where('quantity', '>', 0)
            ->with('product:id,name,selling_price,purchase_price,sku')
            ->get()
            ->map(function ($stock) {
                return [
                    'id'             => $stock->product->id,
                    'unit_stock_id'  => $stock->id,
                    'name'           => $stock->product->name,
                    'sku'            => $stock->product->sku,
                    'selling_price'  => (float) $stock->product->selling_price,
                    'purchase_price' => (float) $stock->product->purchase_price,
                    'current_stock'  => $stock->quantity,
                ];
            });

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id'                  => 'nullable|exists:students,id',
            'payment_method'              => 'required|in:e_card,cash,mixed',
            'total_amount'                => 'required|numeric|min:1',
            'paid_e_card'                 => 'required_if:payment_method,e_card,mixed|numeric|min:0',
            'paid_cash'                   => 'required_if:payment_method,cash,mixed|numeric|min:0',
            'cart_items'                  => 'required|array|min:1',
            'cart_items.*.product_id'     => 'required|exists:products,id',
            'cart_items.*.quantity'       => 'required|integer|min:1',
            'cart_items.*.selling_price'  => 'required|numeric',
            'cart_items.*.purchase_price' => 'required|numeric',
            'cart_items.*.sub_total'      => 'required|numeric',
        ]);

        $cashierUnitId = auth()->user()->unit_id;
        $paidTotal     = $validated['paid_e_card'] + $validated['paid_cash'];

        if ($paidTotal < $validated['total_amount']) {
            return response()->json(['message' => 'Total pembayaran kurang dari total belanja.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        DB::beginTransaction();
        try {

            $santri = $validated['student_id'] ? Student::with('wallet')->find($validated['student_id']) : null;

            if ($validated['paid_e_card'] > 0) {
                if (! $santri) {
                    throw new \Exception('Pembayaran E-Card memerlukan data Santri.');
                }
                $currentBalance = $santri->wallet ? $santri->wallet->current_balance : 0;
                if ($currentBalance < $validated['paid_e_card']) {
                    throw new \Exception('Saldo E-Card Santri tidak mencukupi (Rp' . number_format($currentBalance, 0) . ').');
                }

                $dailyLimit = $santri->daily_limit ?? 0;
                if ($dailyLimit > 0) {
                    $totalSpentToday = Order::where('student_id', $santri->id)
                        ->whereDate('transaction_date', today())
                        ->sum('paid_e_card');

                    $potentialNewTotal = $totalSpentToday + $validated['paid_e_card'];

                    if ($potentialNewTotal > $dailyLimit) {
                        $remainingLimit = max(0, $dailyLimit - $totalSpentToday);
                        throw new \Exception("Batas belanja harian E-Card terlampaui. Sisa limit hari ini: Rp" . number_format($remainingLimit, 0));
                    }
                }
            }

            foreach ($validated['cart_items'] as $item) {
                $stock = UnitStock::where('unit_id', $cashierUnitId)
                    ->where('product_id', $item['product_id'])
                    ->lockForUpdate()
                    ->first();

                if (! $stock || $stock->quantity < $item['quantity']) {
                    $product = Product::find($item['product_id']);
                    throw new \Exception("Stok produk {$product->name} di unit ini tidak cukup. Sisa stok: " . ($stock ? $stock->quantity : 0));
                }

            }

            $invoiceNumber = $this->generateInvoiceNumber($cashierUnitId);

            $order = Order::create([
                'invoice_number'   => $invoiceNumber,
                'unit_id'          => $cashierUnitId,
                'cashier_id'       => auth()->id(),
                'student_id'       => $validated['student_id'],
                'total_amount'     => $validated['total_amount'],
                'payment_method'   => $validated['payment_method'],
                'paid_e_card'      => $validated['paid_e_card'],
                'paid_cash'        => $validated['paid_cash'],
                'status'           => 'completed',
                'transaction_date' => now(),
                'change_amount'    => $paidTotal - $validated['total_amount'], // Simpan kembalian
            ]);

            foreach ($validated['cart_items'] as $item) {
                $order->items()->create([
                    'product_id'     => $item['product_id'],
                    'quantity'       => $item['quantity'],
                    'price_per_item' => $item['selling_price'],
                    'purchase_price' => $item['purchase_price'],
                    'sub_total'      => $item['sub_total'],
                ]);

                UnitStock::where('unit_id', $cashierUnitId)
                    ->where('product_id', $item['product_id'])
                    ->decrement('quantity', $item['quantity']);

                StockMovement::create([
                    'product_id'   => $item['product_id'],
                    'user_id'      => auth()->id(),
                    'type'         => 'out',
                    'quantity'     => $item['quantity'],
                    'from_unit_id' => $cashierUnitId,
                    'to_unit_id'   => null,
                    'notes'        => 'Penjualan POS: ' . $order->invoice_number,
                ]);
            }

            if ($validated['paid_e_card'] > 0 && $santri && $santri->wallet) {
                $santri->wallet->decrement('current_balance', $validated['paid_e_card']);
                $newBalance = $santri->wallet->current_balance;

                WalletTransaction::create([
                    'wallet_id'    => $santri->wallet->id,
                    'user_id'      => auth()->id(),
                    'type'         => 'transfer_out',
                    'amount'       => $validated['paid_e_card'],
                    'reference_id' => $order->invoice_number,
                    'notes'        => 'Pembayaran pesanan: ' . $order->invoice_number . ' (POS)',
                ]);
            }

            SyncLog::create([
                'unit_id'   => $cashierUnitId,
                'data_type' => 'order',
                'data_id'   => $order->id,
                'sync_time' => now(),
                'status'    => 'success',
                'details'   => 'Order ' . $order->invoice_number . ' berhasil disimpan.',
            ]);

            GeneralLedger::create([
                'transaction_reference' => $order->invoice_number,
                'debit_account_id'      => FinancialAccount::where('name', 'Harga Pokok Penjualan')->first()->id,
                'credit_account_id'     => FinancialAccount::where('name', 'Kas Kantin')->first()->id,
                'amount'                => $order->total_amount,
                'description'           => 'Transaksi penjualan oleh ' . $santri->name,
                'order_id'              => $order->id,
                'transaction_date'      => now(),
            ]);

            DB::commit();
            return redirect()->back()->with([
                'success'     => 'Transaksi berhasil diproses.',
                'order_id'    => $order->invoice_number,
                'new_balance' => $newBalance,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'errors'  => ['message' => $e->getMessage()],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    private function generateInvoiceNumber($unitId)
    {
        $unitCode = 'U' . $unitId;
        $dateCode = now()->format('ymd');

        $lastOrder = Order::whereDate('created_at', today())
            ->where('unit_id', $unitId)
            ->latest()
            ->first();

        $newNumber     = $lastOrder ? (int) substr($lastOrder->invoice_number, -4) + 1 : 1;
        $runningNumber = str_pad($newNumber, 4, '0', STR_PAD_LEFT);

        return "{$unitCode}-{$dateCode}-{$runningNumber}";
    }

    public function syncOrders(Request $request)
    {
        $request->validate([
            'unit_id'             => 'required|exists:units,id',
            'orders'              => 'required|array',
            'orders.*.cart_items' => 'required|array',

        ]);

        $unitId      = $request->unit_id;
        $syncResults = [];

        foreach ($request->orders as $offlineOrder) {

            DB::beginTransaction();
            try {

                $existingOrder = Order::where('invoice_number', $offlineOrder['invoice_number'])
                    ->where('unit_id', $unitId)
                    ->first();

                if ($existingOrder) {

                    $syncResults[] = [
                        'invoice_number' => $offlineOrder['invoice_number'],
                        'status'         => 'success',
                        'message'        => 'Data sudah ada di server (Duplikat terdeteksi).',
                    ];
                    DB::commit();
                    continue;
                }

                $newOrder = Order::create([
                    'unit_id'        => $unitId,
                    'student_id'     => $offlineOrder['student_id'] ?? null,
                    'user_id'        => $offlineOrder['user_id'], // User ID kasir yang tercatat di offline
                    'invoice_number' => $offlineOrder['invoice_number'],
                    'payment_method' => $offlineOrder['payment_method'],
                    'total_amount'   => $offlineOrder['total_amount'],
                    'paid_cash'      => $offlineOrder['paid_cash'],
                    'paid_e_card'    => $offlineOrder['paid_e_card'],
                    'change_amount'  => $offlineOrder['change_amount'],

                    'created_at'     => $offlineOrder['created_at'] ?? now(),
                    'updated_at'     => now(),
                ]);

                $newBalance = 0;

                foreach ($offlineOrder['cart_items'] as $item) {

                    $newOrder->items()->create($item);

                    $unitStock = UnitStock::where('unit_id', $unitId)
                        ->where('product_id', $item['product_id'])
                        ->first();
                    if ($unitStock) {
                        $unitStock->decrement('current_stock', $item['quantity']);
                    }

                    StockMovement::create([
                        'product_id'   => $item['product_id'],
                        'user_id'      => $offlineOrder['user_id'],
                        'type'         => 'out',
                        'quantity'     => $item['quantity'],
                        'from_unit_id' => $unitId,
                        'to_unit_id'   => null,
                        'notes'        => 'Sinkronisasi Penjualan POS Offline: ' . $newOrder->invoice_number,
                        'created_at'   => $offlineOrder['created_at'] ?? now(),
                    ]);
                }

                if ($newOrder->paid_e_card > 0 && $newOrder->student_id) {
                    $wallet = $newOrder->student->wallet;
                    $wallet->decrement('current_balance', $newOrder->paid_e_card);
                    $newBalance = $wallet->current_balance;

                    WalletTransaction::create([
                        'wallet_id'       => $wallet->id,
                        'user_id'         => $offlineOrder['user_id'],
                        'type'            => 'debit',
                        'amount'          => $newOrder->paid_e_card,
                        'current_balance' => $newBalance,
                        'reference_id'    => $newOrder->invoice_number,
                        'notes'           => 'Pembayaran pesanan (Sinkronisasi): ' . $newOrder->invoice_number,
                        'created_at'      => $offlineOrder['created_at'] ?? now(),
                    ]);
                }
                SyncLog::create([
                    'unit_id'   => $unitId,
                    'data_type' => 'order',
                    'data_id'   => $newOrder->id,
                    'sync_time' => now(),
                    'status'    => 'success',
                    'details'   => 'Order ' . $newOrder->invoice_number . ' berhasil disinkronkan.',
                ]);

                DB::commit();

                $syncResults[] = [
                    'invoice_number' => $offlineOrder['invoice_number'],
                    'status'         => 'success',
                    'message'        => 'Berhasil disinkronkan.',
                ];

            } catch (\Exception $e) {
                DB::rollBack();
                $syncResults[] = [
                    'invoice_number' => $offlineOrder['invoice_number'],
                    'status'         => 'failed',
                    'message'        => 'Gagal diproses: ' . $e->getMessage(),
                ];

                try {
                    SyncLog::create([
                        'unit_id'   => $unitId,
                        'data_type' => 'order',
                        'data_id'   => null,
                        'sync_time' => now(),
                        'status'    => 'failed',
                        'details'   => 'Gagal sinkron Order ' . ($offlineOrder['invoice_number'] ?? 'Unknown') . ': ' . $e->getMessage(),
                    ]);
                } catch (\Exception $logE) {
                    // Abaikan jika pencatatan log gagal
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Proses sinkronisasi selesai.',
            'results' => $syncResults,
        ]);
    }
}
