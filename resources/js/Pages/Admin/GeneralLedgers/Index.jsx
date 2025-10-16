import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ auth, entries }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Buku Besar Umum
                </h2>
            }
        >
            <Head title="General Ledger" />

            <div className="max-w-7xl mx-auto mt-8 bg-white shadow rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-6">
                    Daftar Transaksi Keuangan
                </h3>

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 text-sm">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="px-4 py-2 text-left">Tanggal</th>
                                <th className="px-4 py-2 text-left">
                                    Referensi
                                </th>
                                <th className="px-4 py-2 text-left">
                                    Deskripsi
                                </th>
                                <th className="px-4 py-2 text-left">Debit</th>
                                <th className="px-4 py-2 text-left">Kredit</th>
                                <th className="px-4 py-2 text-right">
                                    Jumlah (Rp)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.data.map((entry) => (
                                <tr
                                    key={entry.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2">
                                        {new Date(
                                            entry.transaction_date
                                        ).toLocaleDateString("id-ID")}
                                    </td>
                                    <td className="px-4 py-2">
                                        {entry.transaction_reference}
                                    </td>
                                    <td className="px-4 py-2">
                                        {entry.description || "-"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {entry.debit_account.name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {entry.credit_account.name}
                                    </td>
                                    <td className="px-4 py-2 text-right font-semibold text-indigo-700">
                                        {Number(entry.amount).toLocaleString(
                                            "id-ID"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination simple */}
            </div>
        </AuthenticatedLayout>
    );
}
