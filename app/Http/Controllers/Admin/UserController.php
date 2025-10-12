<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

// Import Model Role Spatie

class UserController extends Controller
{
    // --- READ (Index) ---
    public function index()
    {
        $users = User::with('roles:id,name', 'unit:id,name') // Load roles dan unit
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    // --- CREATE (Tampilkan Form) ---
    public function create()
    {
        $roles = Role::pluck('name', 'id'); // Ambil semua peran
                                            // $units = Unit::where('is_active', true)->pluck('name', 'id'); // Ambil unit aktif
        $units = Unit::pluck('name', 'id'); // Ambil unit aktif

        return Inertia::render('Admin/Users/Create', [
            'roles' => $roles,
            'units' => $units,
        ]);
    }

    // --- STORE (Simpan Data Baru) ---
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role_id'  => 'required|exists:roles,id',
            'unit_id'  => 'nullable|exists:units,id',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => bcrypt($validated['password']),
            'unit_id'  => $validated['unit_id'],
        ]);

        // Berikan Role
        $roleName = Role::findById($validated['role_id'])->name;
        $user->assignRole($roleName);

        return redirect()->route('admin.users.index')
            ->with('success', "Akun {$user->name} berhasil dibuat dengan peran {$roleName}.");
    }

    // --- UPDATE --- (Logika serupa dengan store, tapi menggunakan $user->update dan $user->syncRoles)
    public function edit(User $user)
    {
        $roles = Role::pluck('name', 'id');
        $units = Unit::pluck('name', 'id');

        return Inertia::render('Admin/Users/Edit', [
            'user'        => $user->load('unit:id,name', 'roles:id,name'),
            'roles'       => $roles,
            'units'       => $units,
            'currentRole' => $user->roles->first() ? $user->roles->first()->id : null,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
            'role_id'  => 'required|exists:roles,id',
            'unit_id'  => 'nullable|exists:units,id',
        ]);

        $user->update([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'unit_id'  => $validated['unit_id'],
            'password' => $validated['password'] ? bcrypt($validated['password']) : $user->password,
        ]);

        // Sync Role
        $roleName = Role::findById($validated['role_id'])->name;
        $user->syncRoles($roleName);

        return redirect()->route('admin.users.index')
            ->with('success', "Akun {$user->name} berhasil diperbarui.");
    }

    public function destroy(User $user)
    {
        // Pencegahan: Jangan biarkan user menghapus dirinya sendiri
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'Akun pengguna berhasil dihapus.');
    }
}