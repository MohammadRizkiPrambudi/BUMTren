<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index()
    {
        $units = Unit::latest()->paginate(10);

        return Inertia::render('Admin/Units/Index', [
            'units' => $units,
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
