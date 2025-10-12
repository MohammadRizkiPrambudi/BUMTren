import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import PrimaryButton from "@/Components/PrimaryButton";

export default function UserIndex({ auth, users, success, error }) {
    // Fungsi Delete
    const handleDelete = (user) => {
        Swal.fire({
            title: `Hapus Akun ${user.name}?`,
            text: "Akun yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.users.destroy", user.id));
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
                    Manajemen Pengguna Staf
                </h2>
            }
        >
            <Head title="Manajemen Pengguna" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {/* Header dan Tombol Tambah */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold text-gray-700">
                                Daftar Akun Pengguna
                            </h3>
                            <Link href={route("admin.users.create")}>
                                <PrimaryButton>+ Tambah Pengguna</PrimaryButton>
                            </Link>
                        </div>

                        {/* Tabel Daftar Pengguna */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Peran (Role)
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Unit Bertugas
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold">
                                                {user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {/* Asumsi: Setiap user hanya punya satu role utama */}
                                                {user.roles.length > 0 ? (
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            user.roles[0]
                                                                .name ===
                                                            "admin"
                                                                ? "bg-indigo-100 text-indigo-800"
                                                                : user.roles[0]
                                                                      .name ===
                                                                  "manager"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "bg-green-100 text-green-800"
                                                        }`}
                                                    >
                                                        {user.roles[0].name.toUpperCase()}
                                                    </span>
                                                ) : (
                                                    <span className="text-red-500">
                                                        N/A
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                                {user.unit
                                                    ? user.unit.name
                                                    : "Global/Admin"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <Link
                                                    href={route(
                                                        "admin.users.edit",
                                                        user.id
                                                    )}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    Edit
                                                </Link>
                                                {/* Admin tidak boleh menghapus dirinya sendiri */}
                                                {auth.user.id !== user.id && (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(user)
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Hapus
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ... Implementasi Pagination ... */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
