import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2"; // Asumsi Anda menggunakan SweetAlert2 untuk konfirmasi
import PrimaryButton from "@/Components/PrimaryButton";

export default function StudentIndex({ auth, students, success, error }) {
    // Fungsi untuk menghapus santri (DELETE request)
    const handleDelete = (student) => {
        Swal.fire({
            title: `Hapus ${student.name}?`,
            text: "Anda tidak akan bisa mengembalikan data ini!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.students.destroy", student.id));
            }
        });
    };

    // Tampilkan notifikasi flash
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
                    Manajemen Santri & E-Kartu
                </h2>
            }
        >
            <Head title="Manajemen Santri" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {/* Header dan Tombol Tambah */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold text-gray-700">
                                Daftar Santri
                            </h3>
                            <Link href={route("admin.students.create")}>
                                <PrimaryButton>Tambah Santri</PrimaryButton>
                            </Link>
                        </div>

                        {/* Tabel Daftar Santri */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kelas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            E-Kartu UID
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Saldo (Rp)
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Batas Harian
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.data.map((student) => (
                                        <tr key={student.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {student.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {student.class}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                                                {student.card_uid}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-blue-600">
                                                {student.wallet
                                                    ? student.wallet.current_balance.toLocaleString(
                                                          "id-ID"
                                                      )
                                                    : "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                Rp{" "}
                                                {student.daily_limit.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        student.is_active
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {student.is_active
                                                        ? "Aktif"
                                                        : "Non-aktif"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <Link
                                                    href={route(
                                                        "admin.students.edit",
                                                        student.id
                                                    )}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(student)
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

                        {/* Pagination Breeze/Inertia */}
                        <div className="mt-6">
                            {/* Di sini Anda bisa membuat komponen Pagination sederhana yang menggunakan Link Inertia */}
                            {/* <Pagination links={students.links} /> */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
