<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index(Request $request)
    {
        $filters      = $request->all(['search', 'status']);
        $searchQuery  = $filters['search'] ?? null;
        $statusFilter = $filters['status'] ?? null;

        $units = Unit::latest()->when($searchQuery, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('location', 'like', '%' . $search . '%');
            });
        })
            ->when($statusFilter !== '' && $statusFilter !== null, function ($query) use ($statusFilter) {
                if ($statusFilter === '1') {
                    $query->where('is_active', true);
                } elseif ($statusFilter === '0') {
                    $query->where('is_active', false);
                }
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Units/Index', [
            'units'   => $units,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Units/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255|unique:units,name', // Nama Unit harus unik
            'location' => 'required|string|max:255',
        ]);

        Unit::create($validated + ['is_active' => true]);

        return redirect()->route('admin.units.index')
            ->with('success', 'Unit usaha baru berhasil ditambahkan.');
    }

    // --- EDIT (Tampilkan Form Edit) ---
    public function edit(Unit $unit)
    {
        return Inertia::render('Admin/Units/Edit', [
            'unit' => $unit,
        ]);
    }

    public function update(Request $request, Unit $unit)
    {
        $validated = $request->validate([
            'name'      => ['required', 'string', 'max:255', Rule::unique('units', 'name')->ignore($unit->id)],
            'location'  => 'required|string|max:255',

            'is_active' => 'required|boolean',
        ]);

        $unit->update($validated);

        return redirect()->route('admin.units.index')
            ->with('success', 'Data unit usaha berhasil diperbarui.');
    }

    public function destroy(Unit $unit)
    {

        if ($unit->stocks()->exists() || $unit->orders()->exists()) {
            return redirect()->back()->with('error', 'Unit tidak dapat dihapus karena masih memiliki data stok atau riwayat transaksi.');
        }

        $unit->delete();

        return redirect()->route('admin.units.index')
            ->with('success', 'Unit usaha berhasil dihapus.');
    }
}
