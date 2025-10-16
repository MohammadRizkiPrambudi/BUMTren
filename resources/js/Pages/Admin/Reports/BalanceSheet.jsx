import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FormatDateIndonesia } from "@/Pages/Utils/FormatDate";

export default function BalanceSheet({
    auth,
    date,
    assets,
    liabilities,
    equities,
}) {
    const sum = (list) =>
        list.reduce((acc, i) => acc + Number(i.balance || 0), 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Laporan Neraca
                </h2>
            }
        >
            <Head title="Laporan Neraca" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/90 backdrop-blur-md shadow-lg sm:rounded-2xl p-8 border border-gray-100">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                Per Tanggal: {FormatDateIndonesia(date)}
                            </h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-indigo-600 font-bold text-lg mb-2">
                                    Aset
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <tbody>
                                            {assets.map((a) => (
                                                <tr key={a.id}>
                                                    <td className="py-1">
                                                        {a.name}
                                                    </td>
                                                    <td className="text-right font-medium">
                                                        Rp{" "}
                                                        {a.balance.toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="border-t font-bold">
                                                <td>Total Aset</td>
                                                <td className="text-right">
                                                    Rp{" "}
                                                    {sum(assets).toLocaleString(
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
                                    Kewajiban & Ekuitas
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <tbody>
                                            {liabilities.map((a) => (
                                                <tr key={a.id}>
                                                    <td className="py-1">
                                                        {a.name}
                                                    </td>
                                                    <td className="text-right font-medium">
                                                        Rp{" "}
                                                        {a.balance.toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {equities.map((a) => (
                                                <tr key={a.id}>
                                                    <td className="py-1">
                                                        {a.name}
                                                    </td>
                                                    <td className="text-right font-medium">
                                                        Rp{" "}
                                                        {a.balance.toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="border-t font-bold">
                                                <td>
                                                    Total Kewajiban & Ekuitas
                                                </td>
                                                <td className="text-right">
                                                    Rp{" "}
                                                    {(
                                                        sum(liabilities) +
                                                        sum(equities)
                                                    ).toLocaleString("id-ID")}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
