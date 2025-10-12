import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function StudentCreate({ auth }) {
    // Inisialisasi useForm Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        nisn: "",
        class: "",
        card_uid: "",
        daily_limit: 0,
        initial_balance: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.students.store")); // Kirim data ke StudentController@store
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tambah Santri Baru
                </h2>
            }
        >
            <Head title="Tambah Santri" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            <h3 className="text-xl font-semibold mb-6 text-gray-700">
                                Detail Santri
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
                                    autoComplete="name"
                                    isFocused={true}
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

                            {/* Input NISN */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="nisn"
                                    value="NISN (Opsional)"
                                />
                                <TextInput
                                    id="nisn"
                                    type="text"
                                    name="nisn"
                                    value={data.nisn}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("nisn", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.nisn}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Kelas */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="class"
                                    value="Kelas/Tingkat"
                                />
                                <TextInput
                                    id="class"
                                    type="text"
                                    name="class"
                                    value={data.class}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("class", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.class}
                                    className="mt-2"
                                />
                            </div>

                            <hr className="my-8 border-t" />
                            <h3 className="text-xl font-semibold mb-6 text-gray-700">
                                E-Kartu & Keuangan
                            </h3>

                            {/* Input E-Kartu UID */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="card_uid"
                                    value="E-Kartu UID (Scan Kartu)"
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
                                    placeholder="Tempelkan kartu untuk mendapatkan ID unik"
                                    required
                                />
                                <InputError
                                    message={errors.card_uid}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Saldo Awal */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="initial_balance"
                                    value="Saldo Awal (Rp)"
                                />
                                <TextInput
                                    id="initial_balance"
                                    type="number"
                                    name="initial_balance"
                                    value={data.initial_balance}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData(
                                            "initial_balance",
                                            e.target.value
                                        )
                                    }
                                    min="0"
                                    required
                                />
                                <InputError
                                    message={errors.initial_balance}
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

                            {/* Tombol Simpan */}
                            <div className="flex items-center justify-end mt-8">
                                <PrimaryButton disabled={processing}>
                                    Simpan Santri
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
