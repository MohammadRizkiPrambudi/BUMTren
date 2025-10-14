<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $filters        = $request->all(['search', 'category', 'status']);
        $searchQuery    = $filters['search'] ?? null;
        $statusFilter   = $filters['status'] ?? null;
        $categoryFilter = $filters['category'] ?? null;
        $products       = Product::with('category')
            ->when($searchQuery, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                });
            })

            ->when($statusFilter !== '' && $statusFilter !== null, function ($query) use ($statusFilter) {
                if ($statusFilter === '1') {
                    $query->where('is_active', true);
                } elseif ($statusFilter === '0') {
                    $query->where('is_active', false);
                }
            })

            ->when($categoryFilter, function ($query, $categoryId) {
                if (is_numeric($categoryId)) {
                    $query->whereHas('category', function ($q) use ($categoryId) {
                        $q->where('category_id', $categoryId);
                    });
                }
            })
            ->latest()->paginate(10)->withQueryString();

        $categories = Category::pluck('name', 'id');

        return Inertia::render('Admin/Products/Index', [
            'products'   => $products,
            'categories' => $categories,
            'filters'    => $filters,
        ]);
    }

    public function create()
    {
        $categories = Category::pluck('name', 'id');

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id'    => 'required|exists:categories,id',
            'name'           => 'required|string|max:255',
            'sku'            => 'nullable|string|max:50|unique:products,sku',
            'purchase_price' => 'required|integer|min:0',
            'selling_price'  => 'required|integer|min:0|gte:purchase_price', // Harga Jual >= Harga Beli
        ]);

        // Cek nama produk unik dalam kategori yang sama
        if (Product::where('category_id', $validated['category_id'])->where('name', $validated['name'])->exists()) {
            return redirect()->back()->withErrors(['name' => 'Nama produk ini sudah ada dalam kategori yang sama.']);
        }

        Product::create($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk baru berhasil ditambahkan.');
    }

    public function edit(Product $product)
    {
        $categories = Category::pluck('name', 'id');

        return Inertia::render('Admin/Products/Edit', [
            'product'    => $product,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id'    => 'required|exists:categories,id',
            'name'           => 'required|string|max:255',
            'sku'            => ['nullable', 'string', 'max:50', Rule::unique('products', 'sku')->ignore($product->id)],
            'purchase_price' => 'required|integer|min:0',
            'selling_price'  => 'required|integer|min:0|gte:purchase_price',
            'is_active'      => 'required|boolean',
        ]);

        // Cek nama produk unik dalam kategori yang sama saat update
        if (Product::where('category_id', $validated['category_id'])
            ->where('name', $validated['name'])
            ->where('id', '!=', $product->id)
            ->exists()) {
            return redirect()->back()->withErrors(['name' => 'Nama produk ini sudah ada dalam kategori yang sama.']);
        }

        $product->update($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Data produk berhasil diperbarui.');
    }

    public function destroy(Product $product)
    {
        if ($product->unitStocks()->exists()) {
            return redirect()->back()->with('error', 'Produk tidak dapat dihapus karena masih tercatat di stok unit.');
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil dihapus.');
    }
}
