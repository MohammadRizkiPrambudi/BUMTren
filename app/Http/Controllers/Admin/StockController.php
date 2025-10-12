<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Unit;
use App\Models\UnitStock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    // --- Index: Melihat Daftar Stok ---
    public function index()
    {
        $unitStocks = UnitStock::with(['unit', 'product'])
            ->latest()
            ->paginate(15);

        $units = Unit::pluck('name', 'id');

        return Inertia::render('Admin/Stocks/Index', [
            'unitStocks' => $unitStocks,
            'units'      => $units,
        ]);
    }

    // --- Store: Menambahkan Stok Awal (Mengaitkan Produk ke Unit) ---
    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit_id'             => 'required|exists:units,id',
            'product_id'          => 'required|exists:products,id',
            'quantity'            => 'required|integer|min:0', // Menggunakan 'quantity'
            'low_stock_threshold' => 'required|integer|min:0', // Kolom baru Anda
        ]);

        // Cek duplikasi (sesuai kunci unik di migrasi)
        if (UnitStock::where('unit_id', $validated['unit_id'])
            ->where('product_id', $validated['product_id'])
            ->exists()) {
            return redirect()->back()->withErrors(['product_id' => 'Produk ini sudah terdaftar di stok unit yang dipilih. Gunakan tombol edit untuk memperbarui kuantitas.']);
        }

        // Asumsi: Anda menambahkan 'user_id' di migrasi untuk audit. Jika tidak, hapus `+ ['user_id' => auth()->id()]`
        UnitStock::create($validated + ['user_id' => auth()->id()]);

        return redirect()->route('admin.stocks.index')
            ->with('success', 'Stok awal produk berhasil ditambahkan ke unit.');
    }

                                                               // --- Update: Memperbarui Kuantitas Stok yang Sudah Ada ---
    public function update(Request $request, UnitStock $stock) // Mengganti $unitStock menjadi $stock
    {
        // Update cepat kuantitas dan/atau threshold dari modal/aksi cepat
        $validated = $request->validate([
            'quantity'            => 'sometimes|required|integer|min:0', // Hanya jika ada input quantity
            'low_stock_threshold' => 'sometimes|required|integer|min:0', // Hanya jika ada input threshold
        ]);

        // Tambahkan user_id untuk audit
        $stock->update($validated + ['user_id' => auth()->id()]);

        return redirect()->route('admin.stocks.index')
            ->with('success', 'Kuantitas stok berhasil diperbarui.');
    }

    // Metode untuk mengambil daftar produk (tetap sama)
    public function getProducts(Request $request)
    {
        $query    = $request->get('query');
        $products = Product::where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', '%' . $query . '%')
                    ->orWhere('sku', 'like', '%' . $query . '%');
            })
            ->limit(10)
            ->get(['id', 'name', 'sku']);

        return response()->json($products);
    }
}