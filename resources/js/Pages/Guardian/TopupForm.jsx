import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

// Fungsi utilitas untuk memformat rupiah
const formatRupiah = (number) => {
    if (typeof number !== "number") return "0";
    return number.toLocaleString("id-ID", {
        minimumFractionDigits: 0,
    });
};

export default function TopupForm({ auth, student }) {
    const { data, setData, post, processing, errors } = useForm({
        student_id: student.id,
        amount: 10000, // Nilai default
        payment_method: "gopay", // Nilai default
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("guardian.topup.process"));
    };

    const paymentMethods = [
        { value: "gopay", label: "Gopay (Virtual Account)" },
        { value: "bca_va", label: "BCA (Virtual Account)" },
        { value: "midtrans", label: "Kartu Kredit/Lainnya" },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Top-Up Saldo E-Card
                </h2>
            }
        >
            <Head title={`Top-Up ${student.name}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                        <h3 className="text-2xl font-bold mb-4 border-b pb-2 text-indigo-700">
                            Top-Up untuk {student.name}
                        </h3>

                        {/* Detail Siswa */}
                        <div className="mb-6 space-y-2 text-gray-700">
                            <p>
                                <span className="font-semibold">Kelas:</span>{" "}
                                {student.class}
                            </p>
                            <p className="text-xl">
                                <span className="font-semibold">
                                    Saldo Saat Ini:
                                </span>{" "}
                                <span className="font-bold text-green-600">
                                    Rp{formatRupiah(student.balance)}
                                </span>
                            </p>
                        </div>

                        <form onSubmit={submit}>
                            {/* Input Jumlah Top-Up */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="amount"
                                    value="Jumlah Top-Up (Min Rp10.000,00)"
                                />
                                <TextInput
                                    id="amount"
                                    type="number"
                                    name="amount"
                                    value={data.amount}
                                    className="mt-1 block w-full text-lg"
                                    isFocused
                                    onChange={(e) =>
                                        setData("amount", e.target.value)
                                    }
                                    required
                                    min="10000"
                                    max="5000000"
                                />
                                <InputError
                                    message={errors.amount}
                                    className="mt-2"
                                />
                            </div>

                            {/* Pilihan Metode Pembayaran */}
                            <div className="mt-6">
                                <InputLabel value="Metode Pembayaran" />

                                <div className="mt-2 space-y-3">
                                    {paymentMethods.map((method) => (
                                        <label
                                            key={method.value}
                                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition duration-150 ease-in-out ${
                                                data.payment_method ===
                                                method.value
                                                    ? "bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500"
                                                    : "bg-white hover:bg-gray-50 border-gray-300"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value={method.value}
                                                checked={
                                                    data.payment_method ===
                                                    method.value
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "payment_method",
                                                        e.target.value
                                                    )
                                                }
                                                className="form-radio h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="ml-3 text-sm font-medium text-gray-900">
                                                {method.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                <InputError
                                    message={errors.payment_method}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-center justify-end mt-6">
                                <PrimaryButton
                                    disabled={processing}
                                    className="w-full justify-center"
                                >
                                    {processing
                                        ? "Memproses..."
                                        : `Top-Up Sekarang (Rp${formatRupiah(
                                              Number(data.amount)
                                          )})`}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
