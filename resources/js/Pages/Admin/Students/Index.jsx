import React, { useState } from "react";
import { Head, useForm, router, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Modal from "@/Components/Modal";
import {
    FaPlusCircle,
    FaEdit,
    FaTrashAlt,
    FaSearch,
    FaSyncAlt,
} from "react-icons/fa";
import FormatRupiah from "@/Pages/Utils/FormatRupiah";

const StudentForm = ({ onClose, initialData = {}, isEditing = false }) => {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: initialData.name || "",
        nisn: initialData.nisn || "",
        class: initialData.class || "",
        card_uid: initialData.card_uid || "",
        daily_limit: initialData.daily_limit || 0,
        initial_balance: initialData.wallet?.current_balance || 0,
        is_active: initialData.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const endpoint = isEditing
            ? route("admin.students.update", initialData.id)
            : route("admin.students.store");

        const method = isEditing ? put : post;

        method(endpoint, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
                {isEditing
                    ? `Edit Santri: ${initialData.name}`
                    : "Tambah Santri Baru"}
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
                <div>
                    <InputLabel value="Nama Lengkap" />
                    <TextInput
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="mt-1 block w-full"
                        required
                        isFocused
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="NISN (Opsional)" />
                    <TextInput
                        value={data.nisn}
                        onChange={(e) => setData("nisn", e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.nisn} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="Kelas / Tingkat" />
                    <TextInput
                        value={data.class}
                        onChange={(e) => setData("class", e.target.value)}
                        className="mt-1 block w-full"
                        required
                    />
                    <InputError message={errors.class} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="UID E-Kartu (Scan)" />
                    <TextInput
                        value={data.card_uid}
                        onChange={(e) => setData("card_uid", e.target.value)}
                        className="mt-1 block w-full font-mono"
                        required
                    />
                    <InputError message={errors.card_uid} className="mt-2" />
                </div>

                {!isEditing && (
                    <div>
                        <InputLabel value="Saldo Awal (Rp)" />
                        <TextInput
                            type="number"
                            value={data.initial_balance}
                            onChange={(e) =>
                                setData("initial_balance", e.target.value)
                            }
                            className="mt-1 block w-full"
                        />
                        <InputError
                            message={errors.initial_balance}
                            className="mt-2"
                        />
                    </div>
                )}

                <div>
                    <InputLabel value="Batas Belanja Harian (Rp)" />
                    <TextInput
                        type="number"
                        value={data.daily_limit}
                        onChange={(e) => setData("daily_limit", e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.daily_limit} className="mt-2" />
                </div>

                {isEditing && (
                    <div>
                        <InputLabel value="Status Kartu" />
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
                        <InputError
                            message={errors.is_active}
                            className="mt-2"
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-8 gap-3">
                <SecondaryButton onClick={onClose}>Batal</SecondaryButton>
                <PrimaryButton disabled={processing}>
                    {isEditing ? "Simpan Perubahan" : "Tambahkan Santri"}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default function StudentIndex({ auth, students, filters = {} }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

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

    const openModal = (student = null) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingStudent(null);
        setIsModalOpen(false);
    };

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
                    <div className="bg-white/90 backdrop-blur-md shadow-lg sm:rounded-2xl p-8 border border-gray-100">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                Daftar Santri
                            </h3>
                            <PrimaryButton
                                className="flex items-center gap-2 text-sm px-5 py-2.5"
                                onClick={() => openModal(null)}
                            >
                                <FaPlusCircle /> Tambah Santri
                            </PrimaryButton>
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

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Nama
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Kelas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            UID Kartu
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                            Saldo (Rp)
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                            Batas Belanja (Rp)
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.data.map((student) => (
                                        <tr
                                            key={student.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-gray-800 font-medium">
                                                {student.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {student.class}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-sm text-gray-600">
                                                {student.card_uid}
                                            </td>
                                            <td className="px-6 py-4 text-right font-semibold text-indigo-600">
                                                {student.wallet
                                                    ? FormatRupiah(
                                                          Number(
                                                              student.wallet
                                                                  .current_balance
                                                          )
                                                      )
                                                    : "0"}
                                            </td>
                                            <td className="px-6 py-4 text-right font-semibold text-red-600">
                                                {student.wallet
                                                    ? FormatRupiah(
                                                          Number(
                                                              student.daily_limit
                                                          )
                                                      )
                                                    : "0"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                        student.is_active
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {student.is_active
                                                        ? "Aktif"
                                                        : "Non-aktif"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex justify-center gap-2">
                                                <SecondaryButton
                                                    onClick={() =>
                                                        openModal(student)
                                                    }
                                                >
                                                    <FaEdit className="mr-1" />{" "}
                                                    Edit
                                                </SecondaryButton>
                                                <DangerButton
                                                    onClick={() =>
                                                        handleDelete(student)
                                                    }
                                                >
                                                    <FaTrashAlt className="mr-1" />{" "}
                                                    Hapus
                                                </DangerButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Create/Edit */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <StudentForm
                    onClose={closeModal}
                    initialData={editingStudent || {}}
                    isEditing={!!editingStudent}
                />
            </Modal>
        </AuthenticatedLayout>
    );
}
