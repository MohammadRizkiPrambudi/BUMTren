import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import PrimaryButton from "@/Components/PrimaryButton";
import {
    FaEdit,
    FaPlusCircle,
    FaSearch,
    FaSyncAlt,
    FaTrash,
} from "react-icons/fa";
import DangerButton from "@/Components/DangerButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Pagination from "@/Components/Pagination";

export default function UserIndex({ auth, users, roles, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [roleFilter, setRoleFilter] = useState(filters.role || "");

    // Filter
    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route("admin.users.index"),
            { search, role: roleFilter },
            { preserveState: true, replace: true }
        );
    };

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
                    <div className="bg-white/90 backdrop-blur-md shadow-lg sm:rounded-2xl p-8 border border-gray-100">
                        {/* Header dan Tombol Tambah */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                Daftar Akun Pengguna
                            </h3>
                            <Link href={route("admin.users.create")}>
                                <PrimaryButton className="flex items-center gap-2 text-sm px-5 py-2.5">
                                    <FaPlusCircle /> Tambah Pengguna
                                </PrimaryButton>
                            </Link>
                        </div>

                        {/* FILTER SECTION */}
                        <form
                            onSubmit={handleFilter}
                            className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200"
                        >
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Cari Nama
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Cari pengguna..."
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 text-sm"
                                    />
                                    <FaSearch className="absolute top-3 left-3 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Hak Akses
                                </label>
                                <select
                                    value={roleFilter}
                                    onChange={(e) =>
                                        setRoleFilter(e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                >
                                    <option value="">Semua</option>
                                    {Object.entries(roles).map(([id, name]) => (
                                        <option key={id} value={id}>
                                            {name.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex space-x-3 pt-6">
                                <PrimaryButton
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm shadow-sm"
                                >
                                    <FaSearch /> Terapkan
                                </PrimaryButton>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setRoleFilter("");
                                        router.get(route("admin.users.index"));
                                    }}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <FaSyncAlt /> Reset
                                </button>
                            </div>
                        </form>

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
                                    {users.data.length > 0 ? (
                                        users.data.map((user) => (
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
                                                                    : user
                                                                          .roles[0]
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
                                                <td className="px-6 py-4 flex space-x-2">
                                                    <Link
                                                        href={route(
                                                            "admin.users.edit",
                                                            user.id
                                                        )}
                                                    >
                                                        <SecondaryButton>
                                                            <FaEdit className="mr-1" />{" "}
                                                            Edit
                                                        </SecondaryButton>
                                                    </Link>
                                                    {/* Admin tidak boleh menghapus dirinya sendiri */}
                                                    {auth.user.id !==
                                                        user.id && (
                                                        <DangerButton
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            <FaTrash className="mr-1" />{" "}
                                                            Hapus
                                                        </DangerButton>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-4 text-center text-gray-500 italic"
                                            >
                                                {filters.search || filters.role
                                                    ? `Tidak ada pengguna ditemukan dengan kriteria pencarian tersebut`
                                                    : "Belum ada data pengguna yang tercatat."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            links={users.links}
                            from={users.from}
                            to={users.to}
                            total={users.total}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
