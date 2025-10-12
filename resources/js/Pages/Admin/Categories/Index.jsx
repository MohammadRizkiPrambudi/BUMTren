import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Swal from "sweetalert2";
import { Button } from "@headlessui/react";

export default function CategoryIndex({ auth, categories, success, error }) {
    // State untuk form tambah/edit (Kita pakai useForm Inertia)
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
        description: "",
        is_active: true,
    });

    // State untuk modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    // Buka Modal Tambah
    const openCreateModal = () => {
        setIsEditing(false);
        reset(); // Reset form
        setIsModalOpen(true);
    };

    // Buka Modal Edit
    const openEditModal = (category) => {
        setIsEditing(true);
        setCurrentCategory(category);
        setData({
            name: category.name,
            description: category.description || "",
            is_active: category.is_active,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
        reset();
    };

    // Handler Submit Form
    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.categories.update", currentCategory.id), {
                onSuccess: () => {
                    closeModal();
                    Swal.fire("Berhasil!", "Kategori diperbarui.", "success");
                },
                onError: () =>
                    Swal.fire("Gagal!", "Periksa kembali input Anda.", "error"),
            });
        } else {
            post(route("admin.categories.store"), {
                onSuccess: () => {
                    closeModal();
                    Swal.fire(
                        "Berhasil!",
                        "Kategori baru ditambahkan.",
                        "success"
                    );
                },
                onError: () =>
                    Swal.fire("Gagal!", "Periksa kembali input Anda.", "error"),
            });
        }
    };

    // Notifikasi Flash dari Controller
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
                    Manajemen Kategori Produk
                </h2>
            }
        >
            <Head title="Manajemen Kategori" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {/* Header dan Tombol Tambah */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold text-gray-700">
                                Daftar Kategori
                            </h3>

                            <Button
                                onClick={openCreateModal}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded transition duration-150"
                            >
                                + Tambah Kategori
                            </Button>
                        </div>

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
                                    {categories.data.map((category) => (
                                        <tr key={category.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold">
                                                {category.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {category.description || "-"}
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
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(category)
                                                    }
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                {/* Hapus harus menggunakan konfirmasi dan Inertia delete request */}
                                                {/* <button onClick={() => handleDelete(category)} className="text-red-600 hover:text-red-900">Hapus</button> */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* ... Pagination ... */}
                    </div>
                </div>
            </div>

            {/* Modal Tambah/Edit Kategori */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h4 className="text-xl font-bold mb-4">
                            {isEditing
                                ? "Edit Kategori"
                                : "Tambah Kategori Baru"}
                        </h4>
                        <form onSubmit={submit}>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Kategori"
                                />
                                <TextInput
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="description"
                                    value="Deskripsi (Opsional)"
                                />
                                <textarea
                                    id="description"
                                    value={data.description}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    rows="3"
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                ></textarea>
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>

                            {isEditing && (
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="is_active"
                                        value="Status"
                                    />
                                    <select
                                        id="is_active"
                                        value={data.is_active ? 1 : 0}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) =>
                                            setData(
                                                "is_active",
                                                e.target.value == 1
                                            )
                                        }
                                    >
                                        <option value={1}>Aktif</option>
                                        <option value={0}>Non-aktif</option>
                                    </select>
                                    <InputError
                                        message={errors.is_active}
                                        className="mt-2"
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="text-gray-600 hover:text-gray-900 mr-4"
                                >
                                    Batal
                                </button>
                                <PrimaryButton disabled={processing}>
                                    {isEditing
                                        ? "Simpan Perubahan"
                                        : "Tambahkan Kategori"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
