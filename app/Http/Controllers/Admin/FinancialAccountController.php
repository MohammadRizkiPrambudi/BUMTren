<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FinancialAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialAccountController extends Controller
{
    public function index()
    {
        $accounts = FinancialAccount::with('parent')->orderBy('code')->paginate(10);
        return Inertia::render('Admin/FinancialAccounts/Index', [
            'accounts' => $accounts,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/FinancialAccounts/Create', [
            'types'   => ['asset', 'liability', 'equity', 'revenue', 'expense'],
            'parents' => FinancialAccount::select('id', 'name', 'code')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code'      => 'required|unique:financial_accounts,code',
            'name'      => 'required|unique:financial_accounts,name',
            'type'      => 'required',
            'parent_id' => 'nullable|exists:financial_accounts,id',
        ]);

        FinancialAccount::create($validated);

        return redirect()->route('admin.financial-accounts.index')
            ->with('success', 'Akun keuangan berhasil ditambahkan.');
    }

    public function edit(FinancialAccount $financialAccount)
    {
        return Inertia::render('Admin/FinancialAccounts/Edit', [
            'account' => $financialAccount,
            'types'   => ['asset', 'liability', 'equity', 'revenue', 'expense'],
            'parents' => FinancialAccount::where('id', '!=', $financialAccount->id)
                ->select('id', 'name', 'code')->get(),
        ]);
    }

    public function update(Request $request, FinancialAccount $financialAccount)
    {
        $validated = $request->validate([
            'code'      => 'required|unique:financial_accounts,code,' . $financialAccount->id,
            'name'      => 'required|unique:financial_accounts,name,' . $financialAccount->id,
            'type'      => 'required',
            'parent_id' => 'nullable|exists:financial_accounts,id',
        ]);

        $financialAccount->update($validated);

        return redirect()->route('admin.financial-accounts.index')
            ->with('success', 'Akun keuangan berhasil diperbarui.');
    }

    public function destroy(FinancialAccount $financialAccount)
    {
        $financialAccount->delete();
        return redirect()->back()->with('success', 'Akun berhasil dihapus.');
    }
}
