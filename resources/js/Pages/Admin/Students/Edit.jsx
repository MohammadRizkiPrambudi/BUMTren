import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { FaUserGraduate, FaIdCard, FaWallet } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import FormatRupiah from "@/Pages/Utils/FormatRupiah";

export default function StudentEdit({ auth, student }) {
    const { data, setData, put, processing, errors } = useForm({
        name: student.name || "",
        nisn: student.nisn || "",
        class: student.class || "",
        card_uid: student.card_uid || "",
        daily_limit: student.daily_limit || 0,
        is_active: student.is_active || 0,
        current_balance: student.wallet?.current_balance || 0,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.students.update", student.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-2 text-gray-800">
                    <h2 className="font-semibold text-xl leading-tight">
                        Edit Santri: {student.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Edit Santri: ${student.name}`} />

            <div className="py-10">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/95 backdrop-blur-md overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100 p-8">
                        <form onSubmit={submit}>
                            {/* === Section 1: Data Santri === */}
                            <div className="flex items-center gap-2 mb-6 border-b pb-3">
                                <FaUserGraduate className="text-indigo-600 text-xl" />
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Informasi Santri
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Nama */}
                                <div>
                                    <InputLabel
                                        htmlFor="name"
                                        value="Nama Lengkap"
                                    />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-2 block w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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

                                {/* NISN */}
                                <div>
                                    <InputLabel
                                        htmlFor="nisn"
                                        value="NISN (Opsional)"
                                    />
                                    <TextInput
                                        id="nisn"
                                        type="text"
                                        name="nisn"
                                        value={data.nisn}
                                        className="mt-2 block w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) =>
                                            setData("nisn", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.nisn}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Kelas */}
                                <div>
                                    <InputLabel
                                        htmlFor="class"
                                        value="Kelas/Tingkat"
                                    />
                                    <TextInput
                                        id="class"
                                        type="text"
                                        name="class"
                                        value={data.class}
                                        className="mt-2 block w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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

                                {/* Status */}
                                <div>
                                    <InputLabel
                                        htmlFor="is_active"
                                        value="Status Kartu"
                                    />
                                    <select
                                        id="is_active"
                                        name="is_active"
                                        value={data.is_active ? 1 : 0}
                                        className="mt-2 block w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                            </div>

                            {/* === Saldo Info === */}
                            <div className="mt-8 bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-lg">
                                <p className="text-gray-700">
                                    Saldo E-Kartu Saat Ini:
                                    <span className="ml-2 font-semibold text-indigo-700 text-lg">
                                        {FormatRupiah(
                                            Number(data.current_balance)
                                        )}
                                    </span>
                                </p>
                            </div>

                            {/* === Section 2: E-Kartu === */}
                            <div className="flex items-center gap-2 mt-10 mb-6 border-b pb-3">
                                <FaIdCard className="text-indigo-600 text-xl" />
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Pengaturan E-Kartu
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* UID */}
                                <div>
                                    <InputLabel
                                        htmlFor="card_uid"
                                        value="UID E-Kartu"
                                    />
                                    <TextInput
                                        id="card_uid"
                                        type="text"
                                        name="card_uid"
                                        value={data.card_uid}
                                        className="mt-2 block w-full font-mono rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) =>
                                            setData("card_uid", e.target.value)
                                        }
                                        placeholder="Tempelkan kartu RFID/NFC"
                                        required
                                    />
                                    <InputError
                                        message={errors.card_uid}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Batas Harian */}
                                <div>
                                    <InputLabel
                                        htmlFor="daily_limit"
                                        value="Batas Belanja Harian (Rp)"
                                    />
                                    <div className="relative mt-2">
                                        <MdOutlinePayments className="absolute left-3 top-3 text-gray-400" />
                                        <TextInput
                                            id="daily_limit"
                                            type="number"
                                            name="daily_limit"
                                            min="0"
                                            value={data.daily_limit}
                                            className="pl-10 block w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            onChange={(e) =>
                                                setData(
                                                    "daily_limit",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <InputError
                                        message={errors.daily_limit}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* === Tombol Update === */}
                            <div className="flex items-center justify-end mt-10 gap-3">
                                <Link
                                    href={route("admin.students.index")}
                                    className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-all duration-150"
                                >
                                    Batal
                                </Link>
                                <PrimaryButton
                                    disabled={processing}
                                    className="px-6 py-3 text-sm font-semibold tracking-wide bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all duration-200"
                                >
                                    {processing
                                        ? "Memperbarui..."
                                        : "Update Data Santri"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
