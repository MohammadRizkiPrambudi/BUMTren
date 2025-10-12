<?php
namespace App\Http\Controllers\Guardian;

use App\Http\Controllers\Controller;

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
    public function topupForm()
    {
        // Di sini nanti kita akan menampilkan form Top-Up
    }
}