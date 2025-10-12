import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function StudentEdit({ auth, student }) {
    // Inisialisasi useForm Inertia dengan data santri yang ada
    const { data, setData, put, processing, errors } = useForm({
        name: student.name,
        nisn: student.nisn,
        class: student.class,
        card_uid: student.card_uid,
        daily_limit: student.daily_limit,
        is_active: student.is_active,
        // Saldo tidak di-update di sini, hanya ditampilkan
        current_balance: student.wallet.current_balance,
    });

    const submit = (e) => {
        e.preventDefault();
        // Kirim data ke StudentController@update (menggunakan PUT method)
        put(route("admin.students.update", student.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Santri: {student.name}
                </h2>
            }
        >
            <Head title={`Edit Santri: ${student.name}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            <h3 className="text-xl font-semibold mb-6 text-gray-700">
                                Data Santri
                            </h3>

                            {/* Input Nama */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Lengkap"
                                />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
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

                            {/* Input NISN & Kelas (Mirip Create) */}
                            {/* ... (Tambahkan input NISN dan Kelas di sini) ... */}

                            {/* Status Saldo Saat Ini (Read Only) */}
                            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800">
                                Saldo E-Kartu Saat Ini:
                                <span className="font-bold text-lg ml-2">
                                    Rp{" "}
                                    {data.current_balance.toLocaleString(
                                        "id-ID"
                                    )}
                                </span>
                            </div>

                            <hr className="my-8 border-t" />
                            <h3 className="text-xl font-semibold mb-6 text-gray-700">
                                Pengaturan E-Kartu
                            </h3>

                            {/* Input E-Kartu UID */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="card_uid"
                                    value="E-Kartu UID"
                                />
                                <TextInput
                                    id="card_uid"
                                    type="text"
                                    name="card_uid"
                                    value={data.card_uid}
                                    className="mt-1 block w-full font-mono"
                                    onChange={(e) =>
                                        setData("card_uid", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.card_uid}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Batas Harian */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="daily_limit"
                                    value="Batas Belanja Harian (Rp)"
                                />
                                <TextInput
                                    id="daily_limit"
                                    type="number"
                                    name="daily_limit"
                                    value={data.daily_limit}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("daily_limit", e.target.value)
                                    }
                                    min="0"
                                />
                                <InputError
                                    message={errors.daily_limit}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Status (Active/Inactive) */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="is_active"
                                    value="Status Kartu"
                                />
                                <select
                                    id="is_active"
                                    name="is_active"
                                    value={data.is_active ? 1 : 0}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) =>
                                        setData(
                                            "is_active",
                                            e.target.value == 1
                                        )
                                    }
                                >
                                    <option value={1}>
                                        Aktif (Bisa digunakan)
                                    </option>
                                    <option value={0}>
                                        Blokir (Tidak bisa digunakan)
                                    </option>
                                </select>
                                <InputError
                                    message={errors.is_active}
                                    className="mt-2"
                                />
                            </div>

                            {/* Tombol Simpan */}
                            <div className="flex items-center justify-end mt-8">
                                <PrimaryButton disabled={processing}>
                                    Update Data Santri
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
