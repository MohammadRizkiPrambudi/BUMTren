<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GeneralLedger;
use Inertia\Inertia;

class GeneralLedgerController extends Controller
{
    public function index()
    {
        $entries = GeneralLedger::with(['debitAccount', 'creditAccount'])
            ->orderByDesc('transaction_date')
            ->paginate(20);

        return Inertia::render('Admin/GeneralLedgers/Index', [
            'entries' => $entries,
        ]);
    }
}
