<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ECardWallet;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $filters      = $request->all(['search', 'status']);
        $searchQuery  = $filters['search'] ?? null;
        $statusFilter = $filters['status'] ?? null;

        // Mulai query Eloquent
        $students = Student::with('wallet')
            ->when($searchQuery, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('class', 'like', '%' . $search . '%');
                });
            })
            ->when($statusFilter !== '' && $statusFilter !== null, function ($query) use ($statusFilter) {
                if ($statusFilter === '1') {
                    $query->where('is_active', true);
                } elseif ($statusFilter === '0') {
                    $query->where('is_active', false);
                }
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'filters'  => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Students/Create');
    }

    public function store(Request $request)
    {
        // 1. Validasi Input
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'nisn'            => 'nullable|string|unique:students,nisn',
            'class'           => 'required|string|max:100',
            'card_uid'        => 'required|string|max:50|unique:students,card_uid', // Wajib Unique
            'daily_limit'     => 'nullable|numeric|min:0',
            'initial_balance' => 'required|numeric|min:0', // Saldo awal
        ]);

        // 2. Transaksi Database (Pastikan Keduanya Tersimpan atau Gagal Bersama)
        DB::transaction(function () use ($validated) {
            // A. Buat Entri Santri
            $student = Student::create([
                'name'        => $validated['name'],
                'nisn'        => $validated['nisn'],
                'class'       => $validated['class'],
                'card_uid'    => $validated['card_uid'],
                'daily_limit' => $validated['daily_limit'] ?? 0,
                'is_active'   => true,
            ]);

            // B. Buat Entri Dompet (Wallet)
            ECardWallet::create([
                'student_id'      => $student->id,
                'current_balance' => $validated['initial_balance'],
                'status'          => 'active',
            ]);
        });

        return redirect()->route('admin.students.index')
            ->with('success', 'Santri baru berhasil didaftarkan dan E-Kartu diaktifkan.');
    }

    public function edit(Student $student)
    {
        // Muat relasi wallet untuk ditampilkan di form
        $student->load('wallet');

        return Inertia::render('Admin/Students/Edit', [
            'student' => $student,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'nisn'        => ['nullable', 'string', Rule::unique('students', 'nisn')->ignore($student->id)],
            'class'       => 'required|string|max:100',
            'card_uid'    => ['required', 'string', 'max:50', Rule::unique('students', 'card_uid')->ignore($student->id)],
            'daily_limit' => 'nullable|numeric|min:0',
            'is_active'   => 'required|boolean',
            // Saldo tidak di-update di sini, tapi melalui Top Up/Transaksi terpisah
        ]);

        $student->update($validated);

        return redirect()->route('admin.students.index')
            ->with('success', 'Data Santri berhasil diperbarui.');
    }

    public function destroy(Student $student)
    {
        // Jika Anda menggunakan onDelete('cascade') di migrasi, menghapus student akan menghapus wallet-nya
        // Tapi sebaiknya dicek jika ada transaksi yang masih terkait.
        if ($student->orders()->exists()) {
            return redirect()->back()->with('error', 'Santri tidak dapat dihapus karena memiliki riwayat transaksi.');
        }

        // Blokir kartu, jangan hapus data santri (Soft Delete disarankan)
        // Jika harus dihapus:
        $student->delete();

        return redirect()->route('admin.students.index')
            ->with('success', 'Santri berhasil dihapus.');
    }

}
