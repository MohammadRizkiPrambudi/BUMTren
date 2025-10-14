import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Swal from "sweetalert2";
import { Button } from "@headlessui/react";
import {
    FaEdit,
    FaPlusCircle,
    FaSearch,
    FaSyncAlt,
    FaTrash,
} from "react-icons/fa";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";

const CategoryForm = ({ initialData, categories, onClose, isEditing }) => {
    const { data, setData, post, put, errors, processing, reset } = useForm({
        name: initialData.name || "",
        description: initialData.description || "",
        is_active: initialData.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        const endpoint = isEditing
            ? route("admin.categories.update", initialData.id)
            : route("admin.categories.store");

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
                    ? `Edit Kategori: ${initialData.name}`
                    : "Tambah Kategori"}
            </h2>

            {/* Nama Usaha */}
            <div className="mb-4">
                <InputLabel htmlFor="name" value="Nama Kategori" />
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
                <InputLabel htmlFor="description" value="Deskripsi" />
                <TextInput
                    id="description"
                    type="text"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    className="mt-1 block w-full"
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            {isEditing && (
                <div className="mt-4">
                    <InputLabel value="Status Kategori" />
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
                    {isEditing ? "Simpan Perubahan" : "Tambahkan Kategori"}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default function CategoryIndex({
    auth,
    categories,
    success,
    error,
    filters = {},
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const openModal = (category = null) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingCategory(null);
        setIsModalOpen(false);
    };

    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");

    // Filter
    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route("admin.categories.index"),
            { search, status },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (category) => {
        Swal.fire({
            title: `Hapus ${category.name}?`,
            text: "Hapus Kategori!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.categories.destroy", unit.id));
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Kategori Produk
                </h2>
            }
        >
            <Head title="Manajemen Kategori" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/90 backdrop-blur-md shadow-lg sm:rounded-2xl p-8 border border-gray-100">
                        {/* Header dan Tombol Tambah */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                Daftar Kategori
                            </h3>

                            <PrimaryButton
                                onClick={() => openModal(null)}
                                className="flex items-center gap-2 text-sm px-5 py-2.5"
                            >
                                <FaPlusCircle /> Tambah Kategori
                            </PrimaryButton>
                        </div>

                        <form
                            onSubmit={handleFilter}
                            className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200"
                        >
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Cari Nama Kategori
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Cari kategori..."
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
                                        setStatus("");
                                        router.get(
                                            route("admin.categories.index")
                                        );
                                    }}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <FaSyncAlt /> Reset
                                </button>
                            </div>
                        </form>

                        {/* Tabel Daftar Kategori */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Kategori
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Deskripsi
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
                                    {categories.data.length > 0 ? (
                                        categories.data.map((category) => (
                                            <tr key={category.id}>
                                                <td className="px-6 py-4 whitespace-nowrap font-semibold">
                                                    {category.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {category.description ||
                                                        "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            category.is_active
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {category.is_active
                                                            ? "Aktif"
                                                            : "Non-aktif"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 space-x-2 text-center">
                                                    <SecondaryButton
                                                        onClick={() =>
                                                            openModal(category)
                                                        }
                                                    >
                                                        <FaEdit className="mr-1" />
                                                        {""} Edit
                                                    </SecondaryButton>
                                                    {/* Hapus harus menggunakan konfirmasi dan Inertia delete request */}
                                                    <DangerButton
                                                        onClick={() =>
                                                            handleDelete(
                                                                category
                                                            )
                                                        }
                                                    >
                                                        <FaTrash className="mr-1" />
                                                        {""} Hapus
                                                    </DangerButton>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-4 text-center text-gray-500 italic"
                                            >
                                                {filters.search ||
                                                filters.status
                                                    ? `Tidak ada kategori ditemukan dengan kriteria pencarian tersebut`
                                                    : "Belum ada data kategori yang tercatat."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <Pagination
                            links={categories.links}
                            from={categories.from}
                            to={categories.to}
                            total={categories.total}
                        />
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <CategoryForm
                    initialData={editingCategory || { categories: [] }}
                    categories={categories}
                    onClose={closeModal}
                    isEditing={!!editingCategory}
                />
            </Modal>
        </AuthenticatedLayout>
    );
}
