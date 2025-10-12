import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function UnitIndex({ auth, units, success, error }) {
    const handleDelete = (unit) => {
        Swal.fire({
            title: `Hapus ${unit.name}?`,
            text: "Unit yang sudah memiliki stok/transaksi tidak bisa dihapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.units.destroy", unit.id), {
                    // Penanganan notifikasi langsung dari Inertia, karena success/error dikirim dari controller
                    onSuccess: () =>
                        Swal.fire(
                            "Berhasil!",
                            "Unit berhasil dihapus.",
                            "success"
                        ),
                    onError: (errors) => {
                        // Jika ada error dari controller (misal: masih ada stok/order), tampilkan
                        Swal.fire(
                            "Gagal!",
                            errors.error || "Terjadi kesalahan saat menghapus.",
                            "error"
                        );
                    },
                });
            }
        });
    };

    // Notifikasi Flash
    if (success) {
        Swal.fire("Berhasil!", success, "success");
    }
    if (error) {
        Swal.fire("Gagal!", error, "error");
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Unit Usaha
                </h2>
            }
        >
            <Head title="Manajemen Unit" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold text-gray-700">
                                Daftar Unit Operasional
                            </h3>
                            <Link
                                href={route("admin.units.create")}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded transition duration-150"
                            >
                                + Tambah Unit
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Unit
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Lokasi
                                        </th>
                                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Manajer
                                        </th> */}
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {units.data.map((unit) => (
                                        <tr key={unit.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold">
                                                {unit.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {unit.location}
                                            </td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                                {unit.manager_name || "-"}
                                            </td> */}
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        unit.is_active
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {unit.is_active
                                                        ? "Aktif"
                                                        : "Non-aktif"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <Link
                                                    href={route(
                                                        "admin.units.edit",
                                                        unit.id
                                                    )}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(unit)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Tambahkan Pagination di sini */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
