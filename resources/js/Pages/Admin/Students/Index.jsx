import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import PrimaryButton from "@/Components/PrimaryButton";
import {
    FaSearch,
    FaSyncAlt,
    FaPlusCircle,
    FaEdit,
    FaTrashAlt,
} from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import FormatRupiah from "@/Pages/Utils/FormatRupiah";

export default function StudentIndex({
    auth,
    students,
    filters = {},
    success,
    error,
}) {
    const [search, setSearch] = useState(filters.search || "");
    const [classFilter, setClassFilter] = useState(filters.class || "");
    const [status, setStatus] = useState(filters.status || "");

    // 🔍 Filter
    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route("admin.students.index"),
            { search, class: classFilter, status },
            { preserveState: true, replace: true }
        );
    };

    // 🗑️ Delete
    const handleDelete = (student) => {
        Swal.fire({
            title: `Hapus ${student.name}?`,
            text: "Data santri yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.students.destroy", student.id));
            }
        });
    };

    if (success) Swal.fire("Berhasil!", success, "success");
    if (error) Swal.fire("Gagal!", error, "error");

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-2 text-gray-800">
                    <h2 className="font-semibold text-xl leading-tight">
                        Manajemen Santri & E-Kartu
                    </h2>
                </div>
            }
        >
            <Head title="Manajemen Santri" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/90 backdrop-blur-md shadow-lg sm:rounded-2xl p-8 border border-gray-100">
                        {/* HEADER */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                Daftar Santri
                            </h3>
                            <Link href={route("admin.students.create")}>
                                <PrimaryButton className="flex items-center gap-2 text-sm px-5 py-2.5">
                                    <FaPlusCircle /> Tambah Santri
                                </PrimaryButton>
                            </Link>
                        </div>

                        {/* FILTER SECTION */}
                        <form
                            onSubmit={handleFilter}
                            className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200"
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
                                        placeholder="Cari santri..."
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 text-sm"
                                    />
                                    <FaSearch className="absolute top-3 left-3 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Kelas
                                </label>
                                <input
                                    type="text"
                                    value={classFilter}
                                    onChange={(e) =>
                                        setClassFilter(e.target.value)
                                    }
                                    placeholder="Contoh: XII IPA"
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                >
                                    <option value="">Semua</option>
                                    <option value="1">Aktif</option>
                                    <option value="0">Non-Aktif</option>
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
                                        setClassFilter("");
                                        setStatus("");
                                        router.get(
                                            route("admin.students.index")
                                        );
                                    }}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <FaSyncAlt /> Reset
                                </button>
                            </div>
                        </form>

                        {/* TABLE */}
                        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-indigo-50/80">
                                    <tr>
                                        {[
                                            "Nama",
                                            "Kelas",
                                            "E-Kartu UID",
                                            "Saldo (Rp)",
                                            "Batas Harian",
                                            "Status",
                                            "Aksi",
                                        ].map((head) => (
                                            <th
                                                key={head}
                                                className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                                            >
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {students.data.length > 0 ? (
                                        students.data.map((student) => (
                                            <tr
                                                key={student.id}
                                                className="hover:bg-indigo-50/40 transition duration-150"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                                                    {student.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    {student.class}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500">
                                                    {student.card_uid}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-indigo-600">
                                                    {student.wallet
                                                        ? FormatRupiah(
                                                              Number(
                                                                  student.wallet
                                                                      .current_balance
                                                              )
                                                          )
                                                        : "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                                                    {FormatRupiah(
                                                        Number(
                                                            student.daily_limit
                                                        )
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span
                                                        className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-full ${
                                                            student.is_active
                                                                ? "bg-green-100 text-green-700 border border-green-200"
                                                                : "bg-red-100 text-red-700 border border-red-200"
                                                        }`}
                                                    >
                                                        {student.is_active
                                                            ? "Aktif"
                                                            : "Non-aktif"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex justify-center gap-3">
                                                    <Link
                                                        href={route(
                                                            "admin.students.edit",
                                                            student.id
                                                        )}
                                                    >
                                                        <SecondaryButton>
                                                            Edit
                                                        </SecondaryButton>
                                                    </Link>
                                                    <DangerButton
                                                        onClick={() =>
                                                            handleDelete(
                                                                student
                                                            )
                                                        }
                                                        className="flex items-center gap-1 transition"
                                                    >
                                                        Hapus
                                                    </DangerButton>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center py-6 text-gray-400 italic"
                                            >
                                                Tidak ada data ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
