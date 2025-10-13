<?php
namespace App\Http\Controllers\Guardian;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GuardianController extends Controller
{
    public function index()
    {
        $user = Auth::user()->load('guardian');

        if (! $user->guardian) {
            return redirect()->route('dashboard')->with('error', 'Akun Anda tidak terikat sebagai wali murid.');
        }

        $guardian = $user->guardian;
        $children = $guardian->students()
            ->with(['wallet', 'orders' => function ($query) {
                $query->latest()
                    ->limit(5)
                    ->with('items.product', 'unit');
            }])
            ->get();

        $childrenData = $children->map(function ($student) {
            $totalUsedToday = $student->orders()
                ->whereDate('created_at', today())
                ->whereIn('payment_method', ['e_card', 'mixed'])
                ->sum('paid_e_card');

            $student->total_jajan_hari_ini  = (float) $totalUsedToday;
            $student->remaining_daily_limit = $student->daily_limit - $student->total_jajan_hari_ini;

            return $student;
        });

        return Inertia::render('Guardian/Dashboard', [
            'guardian' => $guardian,
            'children' => $childrenData,
        ]);
    }

    public function processTopup(Request $request)
    {
        $request->validate([
            'student_id'     => ['required', 'exists:students,id'],
            'amount'         => ['required', 'integer', 'min:10000', 'max:5000000'],
            'payment_method' => ['required', 'string', 'in:midtrans,gopay,bca_va'],
        ]);

        $student = Student::where('id', $request->student_id)->with('wallet', 'guardians')->firstOrFail();

        $guardian = Auth::user()->guardian;

        if (! $guardian || ! $guardian->students->contains($student->id)) {
            return response()->json(['message' => 'Akses ditolak.'], Response::HTTP_FORBIDDEN);
        }

        DB::beginTransaction();
        try {
            $wallet = $student->wallet;
            if (! $wallet) {
                $wallet = EcardWallet::create(['student_id' => $student->id]);
            }
            $wallet->current_balance += $request->amount;
            $wallet->save();

            WalletTransaction::create([
                'wallet_id'    => $wallet->id,
                'user_id'      => Auth::id(),
                'amount'       => $request->amount,
                'type'         => 'topup',
                'notes'        => 'Top-Up Saldo E-Card via ' . strtoupper(str_replace('_', ' ', $request->payment_method)),
                'reference_id' => 'SIMULASI_TOPUP_' . time() . rand(100, 999),
            ]);

            DB::commit();

            return redirect()->route('guardian.dashboard')->with('success',
                "Top-Up sebesar Rp" . number_format($request->amount, 0, ',', '.') .
                " ke E-Card " . $student->name . " berhasil diproses. Saldo baru: Rp" . number_format($wallet->current_balance, 0, ',', '.')
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal memproses Top-Up. Silakan coba lagi.');
        }
    }

    // public function processTopup(Request $request)
    // {
    //     $request->validate([
    //         'student_id'     => 'required|exists:students,id',
    //         'amount'         => 'required|numeric|min:10000',
    //         'payment_method' => 'required|string',
    //     ]);

    //     $wallet = ECardWallet::where('student_id', $request->student_id)->firstOrFail();

    //     // 1️⃣ Buat transaksi lokal pending
    //     $transaction = WalletTransaction::create([
    //         'wallet_id' => $wallet->id,
    //         'amount'    => $request->amount,
    //         'type'      => 'topup',
    //         'status'    => 'pending',
    //         'order_id'  => 'TOPUP-' . time() . '-' . $wallet->id,
    //     ]);

    //     // 2️⃣ Generate signature Tripay
    //     $merchantCode = config('tripay.merchant_code');
    //     $apiKey       = config('tripay.api_key');
    //     $privateKey   = config('tripay.private_key');
    //     $signature    = hash_hmac('sha256', $merchantCode . $transaction->order_id . $request->amount, $privateKey);

    //     // 3️⃣ Payload ke Tripay
    //     $payload = [
    //         'method'         => $request->payment_method, // contoh: QRIS, BCA, MANDIRI, ALFAMART
    //         'merchant_ref'   => $transaction->order_id,
    //         'amount'         => $request->amount,
    //         'customer_name'  => auth()->user()->name,
    //         'customer_email' => auth()->user()->email,
    //         'order_items'    => [
    //             [
    //                 'sku'      => 'TOPUP-' . $wallet->id,
    //                 'name'     => 'Top-Up E-Card Santri',
    //                 'price'    => $request->amount,
    //                 'quantity' => 1,
    //             ],
    //         ],
    //         'callback_url'   => config('tripay.callback_url'),
    //         'expired_time'   => time() + (24 * 60 * 60),
    //         'signature'      => $signature,
    //     ];

    //     // 4️⃣ Request ke Tripay
    //     $response = Http::withToken($apiKey)
    //         ->post(config('tripay.sandbox_base_url') . '/transaction/create', $payload);

    //     $result = $response->json();

    //     if (isset($result['success']) && $result['success']) {
    //         $transaction->update([
    //             'reference'   => $result['data']['reference'],
    //             'payment_url' => $result['data']['checkout_url'],
    //         ]);

    //         return response()->json([
    //             'checkout_url' => $result['data']['checkout_url'],
    //             'method'       => $result['data']['payment_name'],
    //         ]);
    //     }

    //     return response()->json(['error' => 'Gagal membuat transaksi.'], 500);
    // }
}