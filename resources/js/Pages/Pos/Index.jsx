import React, { useState, useEffect, useMemo } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Index({ auth, cashierUnit }) {
    const [santri, setSantri] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [productSearch, setProductSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: null,
        payment_method: "e_card",
        total_amount: 0,
        paid_e_card: 0,
        paid_cash: 0,
        cart_items: [],
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    // ambil produk
    const fetchProducts = async () => {
        try {
            const response = await axios.get(route("pos.products"));
            setProducts(response.data);
        } catch (error) {
            Swal.fire("Gagal!", "Gagal memuat produk unit.", "error");
        }
    };

    // cari santri
    const handleSearchSantri = async (e) => {
        e.preventDefault();
        if (!searchTerm) {
            Swal.fire(
                "Peringatan",
                "Silakan scan atau masukkan ID Kartu.",
                "warning"
            );
            return;
        }
        setIsSearching(true);
        setSantri(null);
        setData("student_id", null);

        try {
            const response = await axios.get(route("pos.search.santri"), {
                params: { card_uid: searchTerm },
            });
            const dataSantri = response.data;
            setSantri(dataSantri);
            setData("student_id", dataSantri.id);
            setData((prev) => ({
                ...prev,
                payment_method: "e_card",
                paid_e_card: totalAmount,
                paid_cash: 0,
            }));

            Swal.fire(
                "Ditemukan!",
                `Santri ${dataSantri.name} | Saldo: Rp. ${formatRupiah(
                    dataSantri.current_balance
                )}`,
                "success"
            );
        } catch (error) {
            Swal.fire("Gagal!", "Kartu tidak terdaftar atau error.", "error");
            setSearchTerm("");
        } finally {
            setIsSearching(false);
        }
    };

    // menghapus transaksi
    const resetTransaction = () => {
        Swal.fire({
            title: "Yakin me-reset transaksi?",
            text: "Keranjang dan data santri akan dihapus.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Reset!",
        }).then((result) => {
            if (result.isConfirmed) {
                setCart([]);
                setSantri(null);
                setSearchTerm("");
                reset();
                setData("paid_e_card", 0);
                setData("paid_cash", 0);
                setData("payment_method", "e_card");
                Swal.fire(
                    "Direset!",
                    "Transaksi siap dimulai kembali.",
                    "success"
                );
            }
        });
    };

    // menambahkan produk kedalam cart
    const addToCart = (product) => {
        const existingItem = cart.find(
            (item) => item.product_id === product.id
        );

        const currentStock =
            products.find((p) => p.id === product.id)?.current_stock || 0;

        const nextQuantity = (existingItem ? existingItem.quantity : 0) + 1;

        if (currentStock < nextQuantity) {
            Swal.fire(
                "Stok Kurang",
                "Stok produk ini di unit sudah habis!",
                "warning"
            );
            return;
        }

        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item.product_id === product.id
                        ? {
                              ...item,
                              quantity: item.quantity + 1,
                              sub_total:
                                  (item.quantity + 1) * item.selling_price,
                          }
                        : item
                )
            );
        } else {
            setCart([
                ...cart,
                {
                    product_id: product.id,
                    name: product.name,
                    quantity: 1,
                    selling_price: product.selling_price,
                    purchase_price: product.purchase_price,
                    sub_total: product.selling_price,
                },
            ]);
        }
    };

    // hapus produk kedalam cart
    const removeFromCart = (productId) => {
        const existingItem = cart.find((item) => item.product_id === productId);

        if (existingItem) {
            if (existingItem.quantity > 1) {
                setCart(
                    cart.map((item) =>
                        item.product_id === productId
                            ? {
                                  ...item,
                                  quantity: item.quantity - 1,
                                  sub_total:
                                      (item.quantity - 1) * item.selling_price,
                              }
                            : item
                    )
                );
            } else {
                setCart(cart.filter((item) => item.product_id !== productId));
            }
        }
    };

    // hapus semua produk dalam cart
    const removeAllFromCart = (productId) => {
        setCart(cart.filter((item) => item.product_id !== productId));
    };

    // menghitung total pembelian dalam cart
    const totalAmount = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.sub_total, 0);
    }, [cart]);

    // filter produk atau cari produk
    const filteredProducts = useMemo(() => {
        if (!productSearch) return products;
        const searchLower = productSearch.toLowerCase();
        return products.filter(
            (product) =>
                product.name.toLowerCase().includes(searchLower) ||
                (product.sku && product.sku.toLowerCase().includes(searchLower))
        );
    }, [products, productSearch]);

    // Update data form saat keranjang dan total berubah
    useEffect(() => {
        setData((prevData) => {
            let paid_e_card = 0;
            let paid_cash = 0;

            if (prevData.payment_method === "e_card" && santri) {
                paid_e_card = totalAmount;
            } else if (prevData.payment_method === "cash") {
                paid_cash = totalAmount;
            } else if (prevData.payment_method === "mixed" && santri) {
                paid_e_card = Math.min(prevData.paid_e_card, totalAmount);
                paid_cash = Math.min(
                    prevData.paid_cash,
                    totalAmount - paid_e_card
                );
            }

            return {
                ...prevData,
                total_amount: totalAmount,
                cart_items: cart.map((item) => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    selling_price: item.selling_price,
                    purchase_price: item.purchase_price,
                    sub_total: item.sub_total,
                })),
                paid_e_card: paid_e_card,
                paid_cash: paid_cash,
                student_id: santri ? santri.id : null,
            };
        });
    }, [cart, totalAmount, santri]);

    // Handler untuk perubahan metode pembayaran
    const handlePaymentChange = (e) => {
        const method = e.target.value;
        setData((prevData) => {
            let paid_e_card = 0;
            let paid_cash = 0;

            if (method === "e_card") {
                paid_e_card = totalAmount;
            } else if (method === "cash") {
                paid_cash = totalAmount;
            }

            return {
                ...prevData,
                payment_method: method,
                paid_e_card: paid_e_card,
                paid_cash: paid_cash,
            };
        });
    };

    // Handler untuk input E-Card/Cash saat Mixed Payment
    const handleMixedPaymentInput = (e, type) => {
        const value = parseFloat(e.target.value) || 0;
        setData((prevData) => {
            let newPaidEcard = prevData.paid_e_card;
            let newPaidCash = prevData.paid_cash;

            if (type === "e_card") {
                newPaidEcard = Math.min(value, totalAmount);
                newPaidCash = Math.max(0, totalAmount - newPaidEcard);
            } else if (type === "cash") {
                newPaidCash = Math.min(value, totalAmount);
                newPaidEcard = Math.max(0, totalAmount - newPaidCash);
            }
            const sumPaid = newPaidEcard + newPaidCash;
            if (sumPaid < totalAmount) {
                if (type === "e_card") {
                    newPaidCash = totalAmount - newPaidEcard;
                } else if (type === "cash") {
                    newPaidEcard = totalAmount - newPaidCash;
                }
            }

            return {
                ...prevData,
                paid_e_card: newPaidEcard,
                paid_cash: newPaidCash,
            };
        });
    };

    // Hitung Kembalian
    const changeAmount = useMemo(() => {
        const paidTotal = data.paid_cash + data.paid_e_card;
        return paidTotal > totalAmount ? paidTotal - totalAmount : 0;
    }, [data.paid_cash, data.paid_e_card, totalAmount]);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: 0,
        }).format(number);
    };

    // submit transaksi kedalam database
    const submitOrder = (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            Swal.fire(
                "Keranjang Kosong",
                "Tambahkan produk ke keranjang untuk melanjutkan.",
                "warning"
            );
            return;
        }

        // Cek Santri diperlukan jika bukan murni Tunai
        if (data.payment_method !== "cash" && !santri) {
            Swal.fire(
                "Gagal!",
                "Pilih santri untuk pembayaran E-Card/Campuran.",
                "error"
            );
            return;
        }

        // Cek kecukupan Pembayaran
        if (data.paid_e_card + data.paid_cash < totalAmount) {
            Swal.fire(
                "Gagal!",
                "Jumlah pembayaran kurang dari total belanja.",
                "error"
            );
            return;
        }

        // Cek Saldo Santri (Hanya untuk E-Card/Mixed)
        if (data.payment_method !== "cash" && santri) {
            if (data.paid_e_card > santri.current_balance) {
                Swal.fire(
                    "Saldo Kurang",
                    `Saldo E-Card Santri hanya Rp. ${formatRupiah(
                        santri.current_balance
                    )}. Tidak cukup untuk pembayaran E-Card Rp. ${formatRupiah(
                        data.paid_e_card
                    )}.`,
                    "error"
                );
                return;
            }

            console.log(santri);

            const dailyLimit = parseFloat(santri.daily_limit);
            const totalUsedToday = parseFloat(santri.total_jajan_hari_ini || 0);
            const totalPaidEcard = data.paid_e_card;
            const totalUsageAfterThisTransaction =
                totalUsedToday + totalPaidEcard;
            if (totalUsageAfterThisTransaction > dailyLimit) {
                const remainingLimit = dailyLimit - totalUsedToday;
                Swal.fire(
                    "Batas Belanja Harian Terlampui!",
                    `Total penggunaan hari ini akan mencapai Rp${formatRupiah(
                        totalUsageAfterThisTransaction
                    )}. Sisa limit harian santri adalah Rp${formatRupiah(
                        remainingLimit
                    )} (dari limit Rp${formatRupiah(dailyLimit)}).`,
                    "error"
                );
                return;
            }
        }

        router.post(route("pos.store"), data, {
            onSuccess: (response) => {
                const flashData = response.props?.flash || {};
                const orderId = flashData.order_id || "";
                const newBalance = flashData.new_balance;

                let successMessage = `Transaksi ${orderId} berhasil diproses.`;
                if (
                    data.payment_method !== "cash" &&
                    newBalance !== undefined
                ) {
                    successMessage += ` Saldo E-Card baru: Rp. ${formatRupiah(
                        newBalance
                    )}.`;
                }
                if (changeAmount > 0 && data.payment_method !== "e_card") {
                    successMessage += ` Kembalian Tunai: Rp. ${formatRupiah(
                        changeAmount
                    )}.`;
                }

                Swal.fire("Sukses!", successMessage, "success");

                // Reset semua state setelah sukses
                setCart([]);
                setSantri(null);
                setSearchTerm("");
                reset();
                fetchProducts(); // Refresh stok
            },
            onError: (err) => {
                let errorMessage =
                    "Terjadi kesalahan yang tidak terduga saat memproses transaksi. Silakan coba lagi.";
                if (err && err.message) {
                    errorMessage = err.message;
                } else if (Object.keys(err).length > 0) {
                    errorMessage = Object.values(err).flat().join("\n");
                }
                Swal.fire({
                    title: "Gagal Transaksi",
                    html: errorMessage,
                    icon: "error",
                });
            },
            preserveScroll: false,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            <Head title={`POS | ${cashierUnit.name}`} />

            {/* Sidebar KIRI: Produk dan Pencarian (70% di MD+, 100% di bawah) */}
            <div className="w-full md:w-8/12 p-4 flex flex-col space-y-4">
                {/* Header Unit & Pencarian Produk */}
                <div className="bg-white p-4 rounded-lg shadow flex-shrink-0 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-indigo-700">
                        {cashierUnit.name} POS
                    </h1>
                    <div className="w-1/2">
                        <TextInput
                            type="text"
                            placeholder="Cari produk (nama/SKU)..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Area Produk (Tabel Scrollable) */}
                <div className="flex-grow bg-white rounded-lg shadow overflow-hidden">
                    <div className="h-full overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama Produk
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                        Harga
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                        Stok
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr
                                            key={product.id}
                                            className={`hover:bg-indigo-50 transition ${
                                                product.current_stock === 0
                                                    ? "bg-red-50 text-gray-400"
                                                    : ""
                                            }`}
                                        >
                                            <td className="px-6 py-3 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    SKU: {product.sku}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-right font-bold text-sm text-emerald-600">
                                                Rp
                                                {formatRupiah(
                                                    product.selling_price
                                                )}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-center text-sm">
                                                <span
                                                    className={`font-mono ${
                                                        product.current_stock <
                                                            10 &&
                                                        product.current_stock >
                                                            0
                                                            ? "text-red-500 font-bold"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    {product.current_stock.toLocaleString(
                                                        "id-ID"
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-center text-sm">
                                                <PrimaryButton
                                                    onClick={() =>
                                                        addToCart(product)
                                                    }
                                                    disabled={
                                                        product.current_stock ===
                                                        0
                                                    }
                                                    className="py-1 px-3 text-xs"
                                                >
                                                    Tambah
                                                </PrimaryButton>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-4 text-center text-gray-500"
                                        >
                                            {products.length === 0
                                                ? "Tidak ada produk di unit ini."
                                                : "Produk tidak ditemukan."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Sidebar KANAN: Santri dan Pembayaran (30% di MD+, 100% di bawah) */}
            <div className="w-full md:w-4/12 bg-white border-t md:border-t-0 md:border-l border-gray-200 shadow-xl flex flex-col flex-shrink-0">
                {/* 1. Area Santri */}
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Pelanggan
                        </h2>
                        <SecondaryButton
                            onClick={resetTransaction}
                            className="py-1 px-3 text-xs"
                        >
                            Reset ↺
                        </SecondaryButton>
                    </div>

                    <form
                        onSubmit={handleSearchSantri}
                        className="flex space-x-2"
                    >
                        <TextInput
                            type="text"
                            placeholder="Scan/Input ID Kartu Santri..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow text-sm"
                            required
                            disabled={isSearching}
                        />
                        <PrimaryButton
                            type="submit"
                            disabled={isSearching || searchTerm.length < 1}
                            className="py-2 px-3 text-sm"
                        >
                            {isSearching ? "..." : "Cari"}
                        </PrimaryButton>
                    </form>

                    <div className="mt-3 p-2 bg-indigo-50 rounded text-sm border border-indigo-200">
                        {santri ? (
                            <>
                                <p className="font-bold text-indigo-800">
                                    {santri.name}
                                </p>
                                <p className="text-indigo-600">
                                    Saldo E-Card:{" "}
                                    <span className="font-bold">
                                        Rp.{" "}
                                        {formatRupiah(santri.current_balance)}
                                    </span>
                                </p>
                            </>
                        ) : (
                            <p className="text-indigo-600">
                                Santri:{" "}
                                <span className="font-semibold">
                                    Umum / Tunai
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                {/* 2. Area Keranjang (Scrollable) */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3 border-b">
                    <h2 className="text-lg font-semibold text-gray-700 sticky top-0 bg-white pb-2">
                        Keranjang ({cart.length} Item)
                    </h2>
                    {cart.map((item) => {
                        const originalProduct = products.find(
                            (p) => p.id === item.product_id
                        );
                        return (
                            <div
                                key={item.product_id}
                                className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
                            >
                                <div className="w-1/2">
                                    <p className="font-semibold text-sm text-gray-800">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        @ Rp{formatRupiah(item.selling_price)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-1">
                                    {/* Tombol - */}
                                    <DangerButton
                                        onClick={() =>
                                            removeFromCart(item.product_id)
                                        }
                                        className="p-1 h-6 w-6 flex items-center justify-center text-xs"
                                    >
                                        -
                                    </DangerButton>
                                    <span className="font-bold text-sm w-5 text-center">
                                        {item.quantity}
                                    </span>
                                    {/* Tombol + */}

                                    <PrimaryButton
                                        onClick={() =>
                                            originalProduct &&
                                            addToCart(originalProduct)
                                        }
                                        className="p-1 h-6 w-6 flex items-center justify-center text-xs"
                                    >
                                        +
                                    </PrimaryButton>
                                </div>
                                {/* Sub Total */}
                                <div className="flex flex-col items-end w-1/4">
                                    <span className="font-bold text-sm text-right text-indigo-600">
                                        Rp. {formatRupiah(item.sub_total)}
                                    </span>
                                    <button
                                        onClick={() =>
                                            removeAllFromCart(item.product_id)
                                        }
                                        className="text-red-500 hover:text-red-700 text-xs mt-1"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {cart.length === 0 && (
                        <p className="text-center text-gray-500 py-10">
                            Keranjang kosong. Tambahkan produk.
                        </p>
                    )}
                </div>

                {/* 3. Area Total dan Pembayaran (Footer) */}
                <div className="p-4 bg-gray-50 border-t flex-shrink-0">
                    <div className="flex justify-between items-center text-2xl font-bold text-indigo-800 mb-4">
                        <span>TOTAL</span>
                        <span>Rp. {formatRupiah(totalAmount)}</span>
                    </div>

                    <form onSubmit={submitOrder}>
                        {/* Metode Pembayaran */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Metode Bayar
                            </label>
                            <select
                                value={data.payment_method}
                                onChange={handlePaymentChange}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="e_card" disabled={!santri}>
                                    💳 E-Card Santri
                                </option>
                                <option value="cash">💵 Tunai (Cash)</option>
                                <option value="mixed" disabled={!santri}>
                                    💰 Campuran (E-Card + Tunai)
                                </option>
                            </select>
                        </div>

                        {/* Detail Pembayaran E-Card */}
                        {(data.payment_method === "e_card" ||
                            data.payment_method === "mixed") &&
                            santri && (
                                <div className="mb-2">
                                    <label className="block text-sm text-gray-500">
                                        Bayar E-Card (
                                        {santri?.current_balance
                                            ? `Saldo: Rp. ${formatRupiah(
                                                  santri.current_balance
                                              )}`
                                            : "Saldo Kosong"}
                                        )
                                    </label>
                                    <TextInput
                                        type="number"
                                        value={data.paid_e_card}
                                        onChange={(e) =>
                                            data.payment_method === "mixed"
                                                ? handleMixedPaymentInput(
                                                      e,
                                                      "e_card"
                                                  )
                                                : setData(
                                                      "paid_e_card",
                                                      parseFloat(
                                                          e.target.value
                                                      ) || 0
                                                  )
                                        }
                                        className="w-full text-right text-sm bg-indigo-100"
                                        min="0"
                                        // Hanya bisa diubah jika mixed payment
                                        readOnly={
                                            data.payment_method === "e_card"
                                        }
                                        required={
                                            data.payment_method !== "cash"
                                        }
                                    />
                                    {errors.paid_e_card && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.paid_e_card}
                                        </p>
                                    )}
                                </div>
                            )}

                        {/* Detail Pembayaran Tunai */}
                        {(data.payment_method === "cash" ||
                            data.payment_method === "mixed") && (
                            <div className="mb-4">
                                <label className="block text-sm text-gray-500">
                                    Bayar Tunai
                                </label>
                                <TextInput
                                    type="number"
                                    value={data.paid_cash}
                                    onChange={(e) =>
                                        data.payment_method === "mixed"
                                            ? handleMixedPaymentInput(e, "cash")
                                            : setData(
                                                  "paid_cash",
                                                  parseFloat(e.target.value) ||
                                                      0
                                              )
                                    }
                                    className="w-full text-right text-sm bg-yellow-100"
                                    min="0"
                                    // Hanya bisa diubah jika mixed payment atau cash
                                    readOnly={data.payment_method === "e_card"}
                                    required={data.payment_method !== "e_card"}
                                />
                                {errors.paid_cash && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.paid_cash}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Kembalian */}
                        <div className="flex justify-between items-center text-xl font-bold text-red-600 mb-4 pt-2 border-t border-dashed">
                            <span>KEMBALIAN</span>
                            <span>Rp{formatRupiah(changeAmount)}</span>
                        </div>

                        {/* Tombol Proses */}
                        <PrimaryButton
                            type="submit"
                            className="w-full py-3 text-lg justify-center"
                            disabled={
                                processing ||
                                cart.length === 0 ||
                                totalAmount <= 0 ||
                                // Disable jika total pembayaran kurang dari total belanja (dan bukan mixed, karena mixed dihandle di handler)
                                (data.paid_e_card + data.paid_cash <
                                    totalAmount &&
                                    data.payment_method !== "mixed")
                            }
                        >
                            {processing
                                ? "Memproses..."
                                : `PROSES TRANSAKSI - Rp${formatRupiah(
                                      totalAmount
                                  )}`}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
