<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index()
    {
        // Ambil data ringkasan untuk Dashboard Eksekutif
        $totalSales    = Order::sum('total_amount');
        $totalStudents = Student::count();
        $recentOrders  = Order::latest()->take(5)->get(); // Contoh

        return Inertia::render('Admin/DashboardAdmin', [
            'stats'        => [
                'total_sales'    => number_format($totalSales),
                'total_students' => $totalStudents,
                'current_date'   => now()->format('d F Y'),
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}