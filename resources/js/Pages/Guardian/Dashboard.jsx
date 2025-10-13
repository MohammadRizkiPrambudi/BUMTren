import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

// 🔹 Utilitas untuk format rupiah
const formatRupiah = (number) => {
    if (typeof number !== "number" || isNaN(number)) return "0";
    return number
        .toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        })
        .replace("IDR", "")
        .trim();
};

const TopupFormModal = ({ student, show, onClose }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: student?.id || null,
        amount: 50000,
        payment_method: "gopay",
    });

    const paymentMethods = [
        { value: "gopay", label: "GoPay (Virtual Account)" },
        { value: "bca_va", label: "BCA (Virtual Account)" },
        { value: "midtrans", label: "Kartu Kredit / Lainnya" },
    ];

    const quickAmounts = [20000, 50000, 100000];

    const closeModal = () => {
        reset();
        onClose();
    };

    //tripay
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (data.amount < 10000) {
    //         alert("Minimal top-up Rp10.000");
    //         return;
    //     }

    //     const confirmTopup = confirm(
    //         `Yakin ingin top-up Rp${formatRupiah(data.amount)}?`
    //     );
    //     if (!confirmTopup) return;

    //     try {
    //         const res = await axios.post(route("guardian.topup.process"), data);
    //         const checkoutUrl = res.data.checkout_url;

    //         // Buka halaman pembayaran Tripay (QRIS / Bank / dll)
    //         window.open(checkoutUrl, "_blank");
    //         alert("Silakan lanjutkan pembayaran di halaman Tripay.");
    //         closeModal();
    //     } catch (error) {
    //         console.error(error);
    //         alert("Gagal membuat transaksi. Coba lagi.");
    //     }
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.amount < 10000) {
            alert("Minimal top-up adalah Rp10.000,00");
            return;
        }

        if (
            !confirm(
                `Yakin ingin top-up Rp${formatRupiah(
                    Number(data.amount)
                )} untuk ${student.name}?`
            )
        ) {
            return;
        }

        post(route("guardian.topup.process"), {
            onSuccess: () => closeModal(),
        });
    };

    if (!student) return null;

    const saldoSekarang = Number(student.wallet?.current_balance) || 0;
    const saldoAkhir = saldoSekarang + Number(data.amount || 0);

    return (
        <Modal show={show} onClose={closeModal} maxWidth="2xl">
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">Top-Up Saldo E-Card</h2>
                <p className="text-gray-700 mb-6">
                    Santri:{" "}
                    <span className="font-semibold text-indigo-600">
                        {student.name} ({student.class})
                    </span>
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            {/* PILIHAN NOMINAL */}
                            <InputLabel value="Pilih Nominal Cepat" />
                            <div className="flex flex-wrap gap-3 mt-2 mb-4">
                                {quickAmounts.map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() =>
                                            setData("amount", amount)
                                        }
                                        className={`px-4 py-2 rounded-lg border transition-all font-semibold ${
                                            data.amount === amount
                                                ? "bg-indigo-600 text-white border-indigo-700"
                                                : "bg-white border-gray-300 text-gray-700 hover:bg-indigo-50"
                                        }`}
                                    >
                                        {formatRupiah(amount)}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setData("amount", "")}
                                    className={`px-4 py-2 rounded-lg border transition-all font-semibold ${
                                        !quickAmounts.includes(data.amount)
                                            ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                                            : "bg-white border-gray-300 text-gray-700 hover:bg-indigo-50"
                                    }`}
                                >
                                    Input Manual
                                </button>
                            </div>

                            {/* INPUT MANUAL */}
                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="amount"
                                    value="Jumlah Top-Up"
                                />
                                <TextInput
                                    id="amount"
                                    type="text"
                                    name="amount"
                                    className="mt-1 block w-full text-lg"
                                    value={
                                        data.amount
                                            ? formatRupiah(Number(data.amount))
                                            : ""
                                    }
                                    onChange={(e) => {
                                        const raw = e.target.value.replace(
                                            /[^\d]/g,
                                            ""
                                        );
                                        setData("amount", Number(raw));
                                    }}
                                    placeholder="Masukkan nominal lain (min Rp10.000)"
                                    required
                                />
                                <InputError
                                    message={errors.amount}
                                    className="mt-2"
                                />
                            </div>

                            {/* PREVIEW SALDO */}
                            <p className="mt-2 text-sm text-gray-600">
                                Saldo sekarang:{" "}
                                <span className="font-semibold text-indigo-600">
                                    {formatRupiah(saldoSekarang)}
                                </span>{" "}
                                → Setelah top-up:{" "}
                                <span className="font-semibold text-green-600">
                                    {formatRupiah(saldoAkhir)}
                                </span>
                            </p>
                        </div>

                        {/* === KOLOM KANAN === */}
                        <div>
                            <InputLabel value="Metode Pembayaran" />
                            <div className="mt-3 space-y-3">
                                {paymentMethods.map((method) => (
                                    <label
                                        key={method.value}
                                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-150 ${
                                            data.payment_method === method.value
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
                                            className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-900">
                                            {method.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* === TOMBOL AKSI === */}
                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Batal
                        </button>

                        <PrimaryButton disabled={processing}>
                            {processing ? (
                                <span className="flex items-center">
                                    <svg
                                        className="animate-spin h-5 w-5 mr-2 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"
                                        ></path>
                                    </svg>
                                    Memproses...
                                </span>
                            ) : (
                                `Top-Up ${formatRupiah(
                                    Number(data.amount || 0)
                                )}`
                            )}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

const ChildCard = ({ student, onOpenTopup }) => {
    const getColor = (value, high, low) => {
        if (value > high) return "text-green-600";
        if (value > low) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6 mb-8 border-t-4 border-indigo-600">
            <div className="flex justify-between items-start mb-4 border-b pb-3">
                <h2 className="text-2xl font-extrabold text-gray-900">
                    {student.name}
                </h2>
                <PrimaryButton onClick={() => onOpenTopup(student)}>
                    Top-Up Saldo
                </PrimaryButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                <div className="p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-gray-500">SALDO E-CARD</p>
                    <p
                        className={`text-3xl font-bold ${getColor(
                            student.wallet?.current_balance || 0,
                            50000,
                            10000
                        )}`}
                    >
                        {formatRupiah(
                            Number(student.wallet?.current_balance || 0)
                        )}
                    </p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-gray-500">LIMIT HARIAN</p>
                    <p className="text-3xl font-bold text-gray-900">
                        {formatRupiah(Number(student.daily_limit) || 0)}
                    </p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-gray-500">SISA LIMIT HARI INI</p>
                    <p
                        className={`text-3xl font-bold ${getColor(
                            student.remaining_daily_limit,
                            10000,
                            0
                        )}`}
                    >
                        {formatRupiah(student.remaining_daily_limit)}
                    </p>
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
                5 Riwayat Jajan Terakhir
            </h3>

            {student.orders && student.orders.length > 0 ? (
                <div className="space-y-3">
                    {student.orders.map((order) => (
                        <div
                            key={order.id}
                            className="p-3 border rounded-lg hover:bg-gray-50"
                        >
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-indigo-600 font-semibold">
                                    {order.invoice_number}
                                </span>
                                <span className="text-gray-500">
                                    {order.created_at}
                                </span>
                            </div>
                            <div className="flex justify-between mt-1">
                                <p className="text-lg font-bold text-gray-900">
                                    Total:{" "}
                                    {formatRupiah(Number(order.total_amount))}
                                </p>
                                <span className="text-xs text-gray-600">
                                    Unit: {order.unit?.name || "N/A"}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {order.items
                                    .map(
                                        (item) =>
                                            `${item.product.name} (${item.quantity}x)`
                                    )
                                    .join(", ")}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">
                    Belum ada riwayat transaksi.
                </p>
            )}
        </div>
    );
};

export default function Dashboard({ auth, guardian, children }) {
    const [showTopupModal, setShowTopupModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const openTopupModal = (student) => {
        setSelectedStudent(student);
        setShowTopupModal(true);
    };

    const closeTopupModal = () => {
        setSelectedStudent(null);
        setShowTopupModal(false);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard Wali Murid
                </h2>
            }
        >
            <Head title="Dashboard Wali Murid" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-indigo-700 text-white p-6 sm:rounded-lg mb-8">
                        <h1 className="text-3xl font-extrabold">
                            Selamat Datang, {auth.user.name}
                        </h1>
                        <p className="mt-1">
                            Anda terhubung dengan {children.length} santri.
                            Pantau dan kelola saldo E-Card mereka di sini.
                        </p>
                    </div>

                    {children.length > 0 ? (
                        children.map((student) => (
                            <ChildCard
                                key={student.id}
                                student={student}
                                onOpenTopup={openTopupModal}
                            />
                        ))
                    ) : (
                        <div className="bg-white shadow p-6 rounded-lg text-red-500">
                            Anda belum terhubung dengan santri manapun.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Top-Up */}
            <TopupFormModal
                student={selectedStudent}
                show={showTopupModal}
                onClose={closeTopupModal}
            />
        </AuthenticatedLayout>
    );
}
