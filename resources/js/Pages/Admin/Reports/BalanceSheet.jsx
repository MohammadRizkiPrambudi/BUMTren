import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

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
            <div className="p-8 max-w-6xl mx-auto bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    Per Tanggal: {date}
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-indigo-600 font-bold text-lg mb-2">
                            Aset
                        </h4>
                        <table className="w-full text-sm">
                            <tbody>
                                {assets.map((a) => (
                                    <tr key={a.id}>
                                        <td className="py-1">{a.name}</td>
                                        <td className="text-right font-medium">
                                            Rp{" "}
                                            {a.balance.toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="border-t font-bold">
                                    <td>Total Aset</td>
                                    <td className="text-right">
                                        Rp {sum(assets).toLocaleString("id-ID")}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h4 className="text-indigo-600 font-bold text-lg mb-2">
                            Kewajiban & Ekuitas
                        </h4>
                        <table className="w-full text-sm">
                            <tbody>
                                {liabilities.map((a) => (
                                    <tr key={a.id}>
                                        <td className="py-1">{a.name}</td>
                                        <td className="text-right font-medium">
                                            Rp{" "}
                                            {a.balance.toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                ))}
                                {equities.map((a) => (
                                    <tr key={a.id}>
                                        <td className="py-1">{a.name}</td>
                                        <td className="text-right font-medium">
                                            Rp{" "}
                                            {a.balance.toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="border-t font-bold">
                                    <td>Total Kewajiban & Ekuitas</td>
                                    <td className="text-right">
                                        Rp{" "}
                                        {(
                                            sum(liabilities) + sum(equities)
                                        ).toLocaleString("id-ID")}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
