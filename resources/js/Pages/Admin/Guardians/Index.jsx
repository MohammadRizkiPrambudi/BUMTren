import React, { useState } from "react";
import { Head, useForm, router, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; // Sesuaikan path layout Anda
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Modal from "@/Components/Modal";
import Select from "react-select";
import {
    FaEdit,
    FaPlusCircle,
    FaSearch,
    FaSyncAlt,
    FaTrash,
} from "react-icons/fa";

const GuardianForm = ({ initialData, students, onClose, isEditing }) => {
    const { data, setData, post, put, errors, processing, reset } = useForm({
        name: initialData.user?.name || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        email: initialData.user?.email || "",
        password: "",
        password_confirmation: "",
        students_id: initialData.students.map((s) => s.id) || [],
    });

    const studentOptions = students.map((s) => ({
        value: s.id,
        label: `${s.name} (${s.nisn})`,
    }));

    const submit = (e) => {
        e.preventDefault();
        const endpoint = isEditing
            ? route("admin.guardians.update", initialData.id)
            : route("admin.guardians.store");

        // Menggunakan POST/PUT sesuai mode
        const method = isEditing ? put : post;

        method(endpoint, {
            onSuccess: () => {
                reset("password", "password_confirmation");
                onClose();
            },
        });
    };

    return (
        <form onSubmit={submit} className="p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
                {isEditing
                    ? `Edit Wali: ${initialData.name}`
                    : "Tambah Wali Baru"}
            </h2>

            {/* Nama Wali */}
            <div className="mb-4">
                <InputLabel htmlFor="name" value="Nama Wali" />
                <TextInput
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="mt-1 block w-full"
                    isFocused
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* No Telepon */}
                <div>
                    <InputLabel htmlFor="phone" value="No. Telepon" />
                    <TextInput
                        id="phone"
                        type="text"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.phone} className="mt-2" />
                </div>
                {/* Email (Akun Login) */}
                <div>
                    <InputLabel htmlFor="email" value="Email (Akun Login)" />
                    <TextInput
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
            </div>

            <div className="mb-4">
                <InputLabel htmlFor="address" value="Alamat" />
                <TextInput
                    id="address"
                    type="text"
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                    className="mt-1 block w-full"
                />
                <InputError message={errors.address} className="mt-2" />
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <InputLabel
                        htmlFor="password"
                        value={
                            isEditing
                                ? "Password Baru (Kosongkan jika tidak diubah)"
                                : "Password"
                        }
                    />
                    <TextInput
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>
                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Password"
                    />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>
            </div>

            {/* Santri yang Ditautkan */}
            <div className="mb-6">
                <InputLabel
                    htmlFor="students_id"
                    value="Santri yang Ditautkan"
                />
                <Select
                    id="students_id"
                    isMulti
                    options={studentOptions}
                    value={studentOptions.filter((option) =>
                        data.students_id.includes(option.value)
                    )}
                    onChange={(selected) =>
                        setData(
                            "students_id",
                            selected.map((item) => item.value)
                        )
                    }
                    className="mt-1 block w-full"
                    placeholder="Pilih santri yang diurus wali ini"
                />
                <InputError message={errors.students_id} className="mt-2" />
            </div>

            <div className="flex justify-end">
                <SecondaryButton onClick={onClose} className="mr-3">
                    Batal
                </SecondaryButton>
                <PrimaryButton processing={processing}>
                    {isEditing ? "Simpan Perubahan" : "Tambahkan Wali"}
                </PrimaryButton>
            </div>
        </form>
    );
};

// --- Komponen Utama Index ---
export default function GuardianIndex({
    auth,
    guardians,
    students,
    filters = {},
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuardian, setEditingGuardian] = useState(null);

    const openModal = (guardian = null) => {
        setEditingGuardian(guardian);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingGuardian(null);
        setIsModalOpen(false);
    };

    const [search, setSearch] = useState(filters.search || "");

    // 🔍 Filter
    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route("admin.students.index"),
            { search },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (guardian) => {
        const isConfirmed = confirm(
            `Apakah Anda yakin ingin menghapus Wali: ${guardian.name}? Akun login juga akan terhapus.`
        );
        if (isConfirmed) {
            router.delete(route("admin.guardians.destroy", guardian.id), {
                onSuccess: () => alert("Wali berhasil dihapus."),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Wali Murid
                </h2>
            }
        >
            <Head title="Manajemen Wali Murid" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/90 backdrop-blur-md shadow-lg sm:rounded-2xl p-8 border border-gray-100">
                        {/* Tombol Tambah */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                Manajemen Wali Murid
                            </h3>
                            <PrimaryButton
                                className="flex items-center gap-2 text-sm px-5 py-2.5"
                                onClick={() => openModal(null)}
                            >
                                <FaPlusCircle /> Tambah Wali
                            </PrimaryButton>
                        </div>

                        <form
                            onSubmit={handleFilter}
                            className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200"
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
                                <thead className=" bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Wali
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email Login
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No. Telepon
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Santri Ditautkan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guardians.data.map((guardian) => (
                                        <tr
                                            key={guardian.id}
                                            className="bg-white divide-y divide-gray-200"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                {guardian.user?.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {guardian.user?.email || "-"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {guardian.phone || "-"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {guardian.students
                                                    .map((s) => s.name)
                                                    .join(", ") || "Belum ada"}
                                            </td>
                                            <td className="px-6 py-4 flex space-x-2">
                                                <SecondaryButton
                                                    onClick={() =>
                                                        openModal(guardian)
                                                    }
                                                >
                                                    <FaEdit className="mr-1" />
                                                    {""}
                                                    Edit
                                                </SecondaryButton>
                                                <DangerButton
                                                    onClick={() =>
                                                        handleDelete(guardian)
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

                        {/* Pagination */}
                    </div>
                </div>
            </div>

            {/* Modal Tambah/Edit */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <GuardianForm
                    initialData={editingGuardian || { students: [] }}
                    students={students}
                    onClose={closeModal}
                    isEditing={!!editingGuardian}
                />
            </Modal>
        </AuthenticatedLayout>
    );
}
