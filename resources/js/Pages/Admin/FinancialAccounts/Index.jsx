import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaPlusCircle } from "react-icons/fa";
import PrimaryButton from "@/Components/PrimaryButton";
import Pagination from "@/Components/Pagination";

export default function Index({ auth, accounts }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Daftar Akun Keuangan
                </h2>
            }
        >
            <Head title="Akun Keuangan" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/90 backdrop-blur-md shadow-lg sm:rounded-2xl p-8 border border-gray-100">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                Financial Accounts
                            </h3>
                            <Link
                                href={route("admin.financial-accounts.create")}
                            >
                                <PrimaryButton className="flex items-center gap-2 text-sm px-5 py-2.5">
                                    <FaPlusCircle /> Tambah Akun
                                </PrimaryButton>
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kode
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Akun
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipe
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Parent
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accounts.data.length > 0 ? (
                                        accounts.data.map((acc) => (
                                            <tr
                                                key={acc.id}
                                                className="bg-white divide-y divide-gray-200"
                                            >
                                                <td className="px-6 py-4">
                                                    {acc.code}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {acc.name}
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    {acc.type}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {acc.parent
                                                        ? acc.parent.name
                                                        : "-"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-4 text-center text-gray-500 italic"
                                            >
                                                Belum ada data accounts yang
                                                tercatat
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            links={accounts.links}
                            from={accounts.from}
                            to={accounts.to}
                            total={accounts.total}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
