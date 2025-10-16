<?php
namespace App\Http\Controllers\Admin\Reports;

use App\Http\Controllers\Controller;
use App\Models\FinancialAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BalanceSheetController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->input('date', now()->format('Y-m-d'));

        // Ambil saldo akhir per akun
        $accounts = FinancialAccount::with(['debits', 'credits'])->get()->map(function ($account) use ($date) {
            $debit  = $account->debits()->whereDate('transaction_date', '<=', $date)->sum('amount');
            $credit = $account->credits()->whereDate('transaction_date', '<=', $date)->sum('amount');

            $balance = in_array($account->type, ['asset', 'expense'])
                ? $debit - $credit
                : $credit - $debit;

            return [
                'id'      => $account->id,
                'name'    => $account->name,
                'type'    => $account->type,
                'balance' => $balance,
            ];
        });

        return Inertia::render('Admin/Reports/BalanceSheet', [
            'date'        => $date,
            'assets'      => $accounts->where('type', 'asset')->values(),
            'liabilities' => $accounts->where('type', 'liability')->values(),
            'equities'    => $accounts->where('type', 'equity')->values(),
        ]);
    }
}
