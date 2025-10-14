import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import {
    FaEdit,
    FaPlusCircle,
    FaSearch,
    FaSyncAlt,
    FaTrash,
} from "react-icons/fa";
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";

const UnitForm = ({ initialData, units, onClose, isEditing }) => {
    const { data, setData, post, put, errors, processing, reset } = useForm({
        name: initialData.name || "",
        location: initialData.location || "",
        is_active: initialData.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        const endpoint = isEditing
            ? route("admin.units.update", initialData.id)
            : route("admin.units.store");

        // Menggunakan POST/PUT sesuai mode
        const method = isEditing ? put : post;

        method(endpoint, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <form onSubmit={submit} className="p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
                {isEditing
                    ? `Edit Unit Usaha: ${initialData.name}`
                    : "Tambah Unit Usaha"}
            </h2>

            {/* Nama Usaha */}
            <div className="mb-4">
                <InputLabel htmlFor="name" value="Nama Usaha" />
                <TextInput
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="mt-1 block w-full"
                    isFocused
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            {/* Lokasi */}
            <div>
                <InputLabel htmlFor="location" value="Lokasi" />
                <TextInput
                    id="location"
                    type="text"
                    value={data.location}
                    onChange={(e) => setData("location", e.target.value)}
                    className="mt-1 block w-full"
                />
                <InputError message={errors.location} className="mt-2" />
            </div>

            {isEditing && (
                <div className="mt-4">
                    <InputLabel value="Status Usaha" />
                    <select
                        value={data.is_active ? 1 : 0}
                        onChange={(e) =>
                            setData("is_active", e.target.value == 1)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value={1}>Aktif</option>
                        <option value={0}>Non-aktif</option>
                    </select>
                    <InputError message={errors.is_active} className="mt-2" />
                </div>
            )}

            <div className="flex justify-end mt-8 gap-3">
                <SecondaryButton onClick={onClose} className="mr-3">
                    Batal
                </SecondaryButton>
                <PrimaryButton disabled={processing}>
                    {isEditing ? "Simpan Perubahan" : "Tambahkan Unit Usaha"}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default function UnitIndex({
    auth,
    units,
    success,
    error,
    filters = {},
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);

    const openModal = (unit = null) => {
        setEditingUnit(unit);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingUnit(null);
        setIsModalOpen(false);
    };

    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");

    // Filter
    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route("admin.students.index"),
            { search, status },
            { preserveState: true, replace: true }
        );
    };

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
                router.delete(route("admin.units.destroy", unit.id));
            }
        });
    };

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
                    <div className="bg-white/90 backdrop-blur-md shadow-lg sm:rounded-2xl p-8 border border-gray-100">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                Daftar Unit Operasional
                            </h3>
                            <PrimaryButton
                                className="flex items-center gap-2 text-sm px-5 py-2.5"
                                onClick={() => openModal(null)}
                            >
                                <FaPlusCircle /> Tambah Unit Usaha
                            </PrimaryButton>
                        </div>

                        <form
                            onSubmit={handleFilter}
                            className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200"
                        >
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Cari Nama Usaha
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
                                            <td className="px-6 py-4 space-x-2 text-center">
                                                <SecondaryButton
                                                    onClick={() =>
                                                        openModal(unit)
                                                    }
                                                >
                                                    <FaEdit className="mr-1" />
                                                    {""}
                                                    Edit
                                                </SecondaryButton>
                                                <DangerButton
                                                    onClick={() =>
                                                        handleDelete(unit)
                                                    }
                                                >
                                                    <FaTrash className="mr-1" />{" "}
                                                    Hapus
                                                </DangerButton>
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
            <Modal show={isModalOpen} onClose={closeModal}>
                <UnitForm
                    initialData={editingUnit || { units: [] }}
                    units={units}
                    onClose={closeModal}
                    isEditing={!!editingUnit}
                />
            </Modal>
        </AuthenticatedLayout>
    );
}
