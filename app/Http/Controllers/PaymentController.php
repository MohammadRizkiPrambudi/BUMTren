<?php
namespace App\Http\Controllers;

use App\Models\WalletTransaction;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function tripayCallback(Request $request)
    {
        $json = $request->getContent();
        $data = json_decode($json, true);

        $privateKey = config('tripay.private_key');
        $signature  = hash_hmac('sha256', $data['merchant_ref'] . $data['reference'] . $data['status'], $privateKey);

        if ($signature !== $data['signature']) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $transaction = WalletTransaction::where('order_id', $data['merchant_ref'])->first();

        if (! $transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        if ($data['status'] === 'PAID') {
            $transaction->update(['status' => 'success']);
            $transaction->wallet->increment('current_balance', $transaction->amount);
        } elseif (in_array($data['status'], ['EXPIRED', 'FAILED'])) {
            $transaction->update(['status' => 'failed']);
        }

        return response()->json(['success' => true]);
    }
}