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

    public function index(Request $request)
    {
        $filters     = $request->all(['search', 'unit']);
        $searchQuery = $filters['search'] ?? null;
        $unitFilter  = $filters['unit'] ?? null;
        $unitStocks  = UnitStock::with(['unit', 'product'])
            ->when($searchQuery, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('product', function ($subQuery) use ($search) {
                        $subQuery->where('name', 'like', '%' . $search . '%');
                    });
                });
            })
            ->when($unitFilter, function ($query, $unitId) {
                if (is_numeric($unitId)) {
                    $query->whereHas('unit', function ($q) use ($unitId) {
                        $q->where('unit_id', $unitId);
                    });
                }
            })
            ->latest()
            ->paginate(10)->withQueryString();

        $units = Unit::pluck('name', 'id');

        return Inertia::render('Admin/Stocks/Index', [
            'unitStocks' => $unitStocks,
            'units'      => $units,
            'filters'    => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit_id'             => 'required|exists:units,id',
            'product_id'          => 'required|exists:products,id',
            'quantity'            => 'required|integer|min:0', // Menggunakan 'quantity'
            'low_stock_threshold' => 'required|integer|min:0', // Kolom baru Anda
        ]);

        if (UnitStock::where('unit_id', $validated['unit_id'])
            ->where('product_id', $validated['product_id'])
            ->exists()) {
            return redirect()->back()->withErrors(['product_id' => 'Produk ini sudah terdaftar di stok unit yang dipilih. Gunakan tombol edit untuk memperbarui kuantitas.']);
        }

        UnitStock::create($validated + ['user_id' => auth()->id()]);

        return redirect()->route('admin.stocks.index')
            ->with('success', 'Stok awal produk berhasil ditambahkan ke unit.');
    }

    public function update(Request $request, UnitStock $stock)
    {

        $validated = $request->validate([
            'quantity'            => 'sometimes|required|integer|min:0',
            'low_stock_threshold' => 'sometimes|required|integer|min:0',
        ]);

        $stock->update($validated + ['user_id' => auth()->id()]);

        return redirect()->route('admin.stocks.index')
            ->with('success', 'Kuantitas stok berhasil diperbarui.');
    }

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
