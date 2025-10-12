import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; // Sesuaikan path layout Anda
import PrimaryButton from "@/Components/PrimaryButton";

// Fungsi utilitas untuk memformat rupiah
const formatRupiah = (number) => {
    if (typeof number !== "number") return "0";
    return number
        .toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        })
        .replace("IDR", "")
        .trim();
};

const ChildCard = ({ student }) => {
    // Tentukan warna berdasarkan sisa limit
    const getLimitColor = (remaining) => {
        if (remaining > 10000) return "text-green-600";
        if (remaining > 0) return "text-yellow-600";
        return "text-red-600";
    };

    // Tentukan warna saldo
    const getBalanceColor = (balance) => {
        if (balance > 50000) return "text-green-700";
        if (balance > 10000) return "text-gray-700";
        return "text-red-700";
    };

    return (
        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6 mb-8 border-t-4 border-indigo-600">
            <div className="flex justify-between items-start mb-4 border-b pb-3">
                <h2 className="text-2xl font-extrabold text-gray-900">
                    {student.name}
                </h2>
                <Link
                    href={route("guardian.topup.form", {
                        student_id: student.id,
                    })}
                >
                    <PrimaryButton className="bg-green-500 hover:bg-green-600">
                        + Top-Up Saldo
                    </PrimaryButton>
                </Link>
            </div>

            {/* Ringkasan Saldo dan Limit */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                <div className="p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-gray-500 font-medium">
                        SALDO E-CARD
                    </p>
                    <p
                        className={`text-3xl font-bold ${getBalanceColor(
                            student.wallet?.current_balance || 0
                        )}`}
                    >
                        Rp {formatRupiah(student.wallet?.current_balance || 0)}
                    </p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-gray-500 font-medium">
                        LIMIT HARIAN
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                        Rp {formatRupiah(student.daily_limit || 0)}
                    </p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-gray-500 font-medium">
                        SISA LIMIT HARI INI
                    </p>
                    <p
                        className={`text-3xl font-bold ${getLimitColor(
                            student.remaining_daily_limit
                        )}`}
                    >
                        Rp {formatRupiah(student.remaining_daily_limit)}
                    </p>
                </div>
            </div>

            {/* Riwayat Jajan Terakhir */}
            <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
                5 Riwayat Jajan Terakhir
            </h3>

            {student.orders && student.orders.length > 0 ? (
                <div className="space-y-3">
                    {student.orders.map((order) => (
                        <div
                            key={order.id}
                            className="p-3 border rounded-lg hover:bg-gray-50"
                        >
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-indigo-600 font-semibold">
                                    {order.invoice_number}
                                </span>
                                <span className="text-gray-500">
                                    {order.created_at}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline mt-1">
                                <p className="text-lg font-bold text-gray-900">
                                    Total: Rp {formatRupiah(order.total_amount)}
                                </p>
                                <span className="text-xs text-gray-600">
                                    Unit: {order.unit?.name || "N/A"}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {order.items
                                    .map(
                                        (item) =>
                                            `${item.product.name} (${item.quantity}x)`
                                    )
                                    .join(", ")}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">
                    Belum ada riwayat transaksi yang tercatat.
                </p>
            )}
        </div>
    );
};

export default function Dashboard({ auth, guardian, children }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard Wali Murid
                </h2>
            }
        >
            <Head title="Dashboard Wali Murid" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-indigo-700 text-white p-6 sm:rounded-lg mb-8">
                        <h1 className="text-3xl font-extrabold">
                            Selamat Datang, {guardian.name}
                        </h1>
                        <p className="mt-1">
                            Anda terhubung dengan {children.length} santri.
                            Pantau dan kelola keuangan E-Card mereka di sini.
                        </p>
                    </div>

                    {children.length > 0 ? (
                        children.map((student) => (
                            <ChildCard key={student.id} student={student} />
                        ))
                    ) : (
                        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                            <p className="text-lg text-red-500">
                                Anda belum terhubung dengan santri manapun.
                                Silakan hubungi administrator.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
