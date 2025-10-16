import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import FormatRupiah from "@/Pages/Utils/FormatRupiah";
import { FormatDateIndonesia } from "@/Pages/Utils/FormatDate";

export default function IncomeStatement({
    auth,
    start_date,
    end_date,
    revenues,
    expenses,
    totalRevenue,
    totalExpense,
    netProfit,
}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Laporan Laba Rugi
                </h2>
            }
        >
            <Head title="Laporan Laba Rugi" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/90 backdrop-blur-md shadow-lg sm:rounded-2xl p-8 border border-gray-100">
                        <div className="flex flex-col items-center gap-1 mb-8">
                            <h1 className="text-2xl font-extrabold text-center text-gray-900">
                                Laporan Laba Rugi
                            </h1>
                            <h3 className="text-md font-medium text-center text-gray-600">
                                Periode: {FormatDateIndonesia(start_date)} s/d{" "}
                                {FormatDateIndonesia(end_date)}
                            </h3>
                        </div>

                        <div>
                            <h4 className="text-indigo-600 font-bold text-lg mb-2">
                                Pendapatan
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm mb-6">
                                    <tbody>
                                        {revenues.map((r, i) => (
                                            <tr key={i}>
                                                <td>{r.name}</td>
                                                <td className="text-right font-medium">
                                                    Rp{" "}
                                                    {r.amount.toLocaleString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="border-t font-bold">
                                            <td>Total Pendapatan</td>
                                            <td className="text-right">
                                                Rp{" "}
                                                {totalRevenue.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-indigo-600 font-bold text-lg mb-2">
                                Beban
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <tbody>
                                        {expenses.map((r, i) => (
                                            <tr key={i}>
                                                <td>{r.name}</td>
                                                <td className="text-right font-medium">
                                                    Rp{" "}
                                                    {r.amount.toLocaleString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="border-t font-bold">
                                            <td>Total Beban</td>
                                            <td className="text-right">
                                                Rp{" "}
                                                {totalExpense.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div
                            className={`mt-6 text-lg font-bold text-right ${
                                netProfit >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            {netProfit >= 0 ? "Laba Bersih" : "Rugi Bersih"}:{" "}
                            {FormatRupiah(Math.abs(netProfit))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
