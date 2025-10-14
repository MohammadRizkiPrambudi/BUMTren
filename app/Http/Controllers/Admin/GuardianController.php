<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guardian;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class GuardianController extends Controller
{

    public function index(Request $request)
    {
        $filters     = $request->all(['search']);
        $searchQuery = $filters['search'] ?? null;
        $guardians   = Guardian::with('user', 'students')
            ->when($searchQuery, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($subQuery) use ($search) {
                        $subQuery->where('name', 'like', '%' . $search . '%');
                    });
                    $q->orWhereHas('students', function ($subQuery) use ($search) {
                        $subQuery->where('name', 'like', '%' . $search . '%');
                    });
                });
            })
            ->paginate(10)
            ->withQueryString();
        $students = Student::orderBy('name')->get(['id', 'name', 'nisn']);
        return Inertia::render('Admin/Guardians/Index', [
            'guardians' => $guardians,
            'students'  => $students,
            'filters'   => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'phone'         => 'nullable|string|max:15',
            'email'         => 'required|string|email|max:255|unique:users',
            'password'      => 'required|string|min:8|confirmed',
            'students_id'   => 'nullable|array',
            'address'       => 'required',
            'students_id.*' => 'exists:students,id',
        ]);

        DB::beginTransaction();
        try {

            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $user->assignRole('guardian');

            $guardian = Guardian::create([
                'user_id' => $user->id,
                'address' => $request->address,
                'phone'   => $request->phone,
            ]);

            if ($request->students_id) {
                $guardian->students()->sync($request->students_id);
            }

            DB::commit();
            return redirect()->route('admin.guardians.index')
                ->with('success', 'Wali dan akun login berhasil ditambahkan dengan role Guardian.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menambahkan Wali: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Guardian $guardian)
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'phone'         => 'nullable|string|max:15',
            'email'         => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($guardian->user->id)],
            'password'      => 'nullable|string|min:8|confirmed',
            'students_id'   => 'nullable|array',
            'students_id.*' => 'exists:students,id',
        ]);

        DB::beginTransaction();
        try {
            // 1. Perbarui Akun User
            $guardian->user->update([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => $request->password ? Hash::make($request->password) : $guardian->user->password,
            ]);

            // 2. Perbarui data Guardian
            $guardian->update([
                'name'  => $request->name,
                'phone' => $request->phone,
            ]);

            // 3. Sinkronkan relasi ke Santri
            $guardian->students()->sync($request->students_id ?: []);

            DB::commit();
            return redirect()->route('admin.guardians.index')
                ->with('success', 'Data Wali berhasil diperbarui.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal memperbarui Wali: ' . $e->getMessage());
        }
    }

    public function destroy(Guardian $guardian)
    {
        DB::beginTransaction();
        try {

            $guardian->user->delete();

            DB::commit();
            return redirect()->route('admin.guardians.index')
                ->with('success', 'Wali berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menghapus Wali.');
        }
    }
}
