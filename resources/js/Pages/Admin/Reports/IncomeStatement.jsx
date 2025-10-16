import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

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
            <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    Periode: {start_date} s/d {end_date}
                </h3>

                <div>
                    <h4 className="text-indigo-600 font-bold text-lg mb-2">
                        Pendapatan
                    </h4>
                    <table className="w-full text-sm mb-6">
                        <tbody>
                            {revenues.map((r, i) => (
                                <tr key={i}>
                                    <td>{r.name}</td>
                                    <td className="text-right font-medium">
                                        Rp {r.amount.toLocaleString("id-ID")}
                                    </td>
                                </tr>
                            ))}
                            <tr className="border-t font-bold">
                                <td>Total Pendapatan</td>
                                <td className="text-right">
                                    Rp {totalRevenue.toLocaleString("id-ID")}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h4 className="text-indigo-600 font-bold text-lg mb-2">
                        Beban
                    </h4>
                    <table className="w-full text-sm">
                        <tbody>
                            {expenses.map((r, i) => (
                                <tr key={i}>
                                    <td>{r.name}</td>
                                    <td className="text-right font-medium">
                                        Rp {r.amount.toLocaleString("id-ID")}
                                    </td>
                                </tr>
                            ))}
                            <tr className="border-t font-bold">
                                <td>Total Beban</td>
                                <td className="text-right">
                                    Rp {totalExpense.toLocaleString("id-ID")}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div
                    className={`mt-6 text-lg font-bold text-right ${
                        netProfit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {netProfit >= 0 ? "Laba Bersih" : "Rugi Bersih"}: Rp{" "}
                    {Math.abs(netProfit).toLocaleString("id-ID")}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
