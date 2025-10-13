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

    /**
     * Tampilkan formulir top-up/pembayaran (Langkah selanjutnya setelah ini).
     */
    // public function topupForm(Request $request)
    // {

    //     $student = Student::where('id', $request->student_id)
    //         ->with('wallet')
    //         ->firstOrFail();

    //     $guardian = Auth::user()->guardian;

    //     if (! $guardian || ! $guardian->students->contains($student->id)) {
    //         return redirect()->route('guardian.dashboard')->with('error', 'Akses ditolak atau siswa tidak ditemukan di bawah pengawasan Anda.');
    //     }

    //     $balance = optional($student->wallet)->current_balance ?? 0;

    //     return Inertia::render('Guardian/TopupForm', [
    //         'student' => [
    //             'id'      => $student->id,
    //             'name'    => $student->name,
    //             'class'   => $student->class,
    //             'balance' => (float) $balance,
    //         ],
    //     ]);

    // }

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
}