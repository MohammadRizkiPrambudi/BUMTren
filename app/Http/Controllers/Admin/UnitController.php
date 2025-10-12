<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;
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

    // --- CREATE (Tampilkan Form) ---
    public function create()
    {
        return Inertia::render('Admin/Units/Create');
    }

    // --- STORE (Simpan Data Baru) ---
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255|unique:units,name', // Nama Unit harus unik
            'location' => 'required|string|max:255',
            // 'manager_name' => 'nullable|string|max:255',
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

    // --- UPDATE (Perbarui Data) ---
    public function update(Request $request, Unit $unit)
    {
        $validated = $request->validate([
            'name'      => ['required', 'string', 'max:255', Rule::unique('units', 'name')->ignore($unit->id)],
            'location'  => 'required|string|max:255',
                                               // 'manager_name' => 'nullable|string|max:255',
            'is_active' => 'required|boolean', // Untuk mengaktifkan/menonaktifkan unit
        ]);

        $unit->update($validated);

        return redirect()->route('admin.units.index')
            ->with('success', 'Data unit usaha berhasil diperbarui.');
    }

    // --- DELETE (Hapus Data) ---
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