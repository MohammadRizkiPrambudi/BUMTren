<?php
namespace App\Http\Controllers\Admin\Reports;

use App\Http\Controllers\Controller;
use App\Models\FinancialAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncomeStatementController extends Controller
{
    public function index(Request $request)
    {
        $start = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $end   = $request->input('end_date', now()->endOfMonth()->format('Y-m-d'));

        $accounts = FinancialAccount::with(['debits', 'credits'])->get();

        $revenues = $accounts->where('type', 'revenue')->map(function ($acc) use ($start, $end) {
            $credit = $acc->credits()->whereBetween('transaction_date', [$start, $end])->sum('amount');
            $debit  = $acc->debits()->whereBetween('transaction_date', [$start, $end])->sum('amount');
            return [
                'name'   => $acc->name,
                'amount' => $credit - $debit,
            ];
        });

        $expenses = $accounts->where('type', 'expense')->map(function ($acc) use ($start, $end) {
            $credit = $acc->credits()->whereBetween('transaction_date', [$start, $end])->sum('amount');
            $debit  = $acc->debits()->whereBetween('transaction_date', [$start, $end])->sum('amount');
            return [
                'name'   => $acc->name,
                'amount' => $debit - $credit,
            ];
        });

        $totalRevenue = $revenues->sum('amount');
        $totalExpense = $expenses->sum('amount');
        $netProfit    = $totalRevenue - $totalExpense;

        return Inertia::render('Admin/Reports/IncomeStatement', [
            'start_date'   => $start,
            'end_date'     => $end,
            'revenues'     => $revenues->values(),
            'expenses'     => $expenses->values(),
            'totalRevenue' => $totalRevenue,
            'totalExpense' => $totalExpense,
            'netProfit'    => $netProfit,
        ]);
    }
}
