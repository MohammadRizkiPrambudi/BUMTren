<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Total dan statistik umum
        $totalSales    = Order::sum('total_amount');
        $totalStudents = Student::count();
        $recentOrders  = Order::latest()->take(5)->get();

        // 🔹 Penjualan per bulan (12 bulan terakhir)
        $salesByMonth = Order::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('SUM(total_amount) as total_sales')
        )
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn($row) => [
                'month'       => date('M', mktime(0, 0, 0, $row->month, 1)),
                'total_sales' => (float) $row->total_sales,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats'        => [
                'total_sales'    => number_format($totalSales),
                'total_students' => $totalStudents,
                'current_date'   => now()->format('d F Y'),
            ],
            'recentOrders' => $recentOrders,
            'salesByMonth' => $salesByMonth,
        ]);
    }
}
