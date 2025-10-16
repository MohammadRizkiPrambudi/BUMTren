import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import FormatRupiah from "@/Pages/Utils/FormatRupiah";

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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/90 backdrop-blur-md shadow-lg sm:rounded-2xl p-8 border border-gray-100">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                Daftar Transaksi Keuangan
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Referensi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Deskripsi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Debit
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kredit
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jumlah (Rp)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.data.length > 0 ? (
                                        entries.data.map((entry) => (
                                            <tr
                                                key={entry.id}
                                                className="bg-white divide-y divide-gray-200"
                                            >
                                                <td className="px-6 py-4">
                                                    {new Date(
                                                        entry.transaction_date
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {
                                                        entry.transaction_reference
                                                    }
                                                </td>
                                                <td className="px-6 py-4">
                                                    {entry.description || "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {entry.debit_account.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {entry.credit_account.name}
                                                </td>
                                                <td className="px-6 py-4 text-right font-semibold text-indigo-700">
                                                    {FormatRupiah(
                                                        Number(entry.amount)
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-4 text-center text-gray-500 italic"
                                            >
                                                Belum ada data transaksi
                                                keuangan yang tercatat
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination simple */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
