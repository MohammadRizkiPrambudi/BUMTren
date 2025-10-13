import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    })
        .format(value)
        .replace("Rp", "")
        .trim();

const StatCard = ({ label, value, icon }) => (
    <div className="bg-white shadow-md rounded-xl p-5 border-t-4 border-indigo-600 flex items-center justify-between">
        <div>
            <p className="text-gray-500 text-sm">{label}</p>
            <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
        </div>
        {icon && <div className="text-indigo-500 text-3xl">{icon}</div>}
    </div>
);

export default function AdminDashboard({
    auth,
    stats,
    recentOrders,
    salesByMonth,
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard Admin
                </h2>
            }
        >
            <Head title="Dashboard Admin" />

            <div className="py-10 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* 🔹 HEADER */}
                    <div className="bg-indigo-700 text-white rounded-lg shadow-md p-6">
                        <h1 className="text-3xl font-bold">
                            Selamat Datang, {auth.user.name}
                        </h1>
                        <p className="mt-1 text-indigo-100">
                            Ringkasan kegiatan keuangan hari ini —{" "}
                            {stats.current_date}
                        </p>
                    </div>

                    {/* 🔹 STATS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard
                            label="Total Penjualan"
                            value={`Rp ${stats.total_sales}`}
                        />
                        <StatCard
                            label="Jumlah Santri"
                            value={stats.total_students}
                        />
                        <StatCard label="Tanggal" value={stats.current_date} />
                    </div>

                    {/* 🔹 SALES CHART */}
                    <div className="bg-white shadow rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">
                            Grafik Penjualan Bulanan ({new Date().getFullYear()}
                            )
                        </h3>

                        {salesByMonth && salesByMonth.length > 0 ? (
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={salesByMonth}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value) =>
                                                `Rp ${formatRupiah(value)}`
                                            }
                                            labelFormatter={(label) =>
                                                `Bulan: ${label}`
                                            }
                                        />
                                        <Bar
                                            dataKey="total_sales"
                                            fill="#4F46E5"
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">
                                Belum ada data penjualan tahun ini.
                            </p>
                        )}
                    </div>

                    {/* 🔹 RECENT ORDERS */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b">
                            <h3 className="text-lg font-bold text-gray-800">
                                Transaksi Terbaru
                            </h3>
                            <a
                                href=""
                                className="text-indigo-600 text-sm hover:underline"
                            >
                                Lihat Semua
                            </a>
                        </div>

                        {recentOrders && recentOrders.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="p-3 hover:bg-gray-50 transition"
                                    >
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-indigo-600 text-sm">
                                                #
                                                {order.invoice_number ||
                                                    order.id}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {order.created_at}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-gray-800 font-bold text-lg">
                                                Rp{" "}
                                                {formatRupiah(
                                                    order.total_amount
                                                )}
                                            </p>
                                            <span className="text-sm text-gray-600">
                                                {order.unit?.name ||
                                                    "Unit Tidak Diketahui"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic p-6 text-center">
                                Belum ada transaksi terbaru.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
