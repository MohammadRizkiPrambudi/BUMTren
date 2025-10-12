import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Swal from "sweetalert2";

export default function StockIndex({
    auth,
    unitStocks,
    units,
    success,
    error,
}) {
    // Form untuk Tambah Stok Awal
    const { data, setData, post, processing, errors, reset } = useForm({
        unit_id: "",
        product_id: "",
        quantity: 0, // Disesuaikan dengan migrasi Anda
        low_stock_threshold: 10, // Default nilai awal
    });

    // State UI
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentStock, setCurrentStock] = useState(null); // Untuk data stok yang sedang di-edit

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Fetch Products based on search term (Debounced)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length > 2) {
                fetch(
                    route("admin.stocks.products.search", { query: searchTerm })
                )
                    .then((res) => res.json())
                    .then((data) => setSearchResults(data));
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setData("product_id", product.id);
        setSearchTerm(product.name);
        setSearchResults([]);
    };

    const openCreateModal = () => {
        reset();
        setSelectedProduct(null);
        setSearchTerm("");
        setIsCreateModalOpen(true);
    };

    const closeAllModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setCurrentStock(null);
        reset();
    };

    // Handler Submit Form Tambah Stok Awal
    const submitCreate = (e) => {
        e.preventDefault();
        post(route("admin.stocks.store"), {
            onSuccess: () => {
                closeAllModals();
                Swal.fire(
                    "Berhasil!",
                    "Stok awal berhasil ditambahkan.",
                    "success"
                );
            },
            onError: (err) => {
                // Gunakan error message dari controller jika ada
                const message =
                    err.product_id ||
                    "Terjadi kesalahan. Pastikan produk belum terdaftar di unit ini.";
                Swal.fire("Gagal!", message, "error");
            },
        });
    };

    // --- Edit Threshold/Kuantitas Modal ---
    const openEditModal = (stock) => {
        setCurrentStock(stock);
        setData({
            quantity: stock.quantity,
            low_stock_threshold: stock.low_stock_threshold,
        });
        setIsEditModalOpen(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        router.put(
            route("admin.stocks.update", currentStock.id),
            {
                quantity: data.quantity,
                low_stock_threshold: data.low_stock_threshold,
            },
            {
                onSuccess: () => {
                    closeAllModals();
                    Swal.fire(
                        "Berhasil!",
                        "Stok dan Threshold diperbarui.",
                        "success"
                    );
                },
                onError: () =>
                    Swal.fire(
                        "Gagal!",
                        "Terjadi kesalahan saat update.",
                        "error"
                    ),
            }
        );
    };

    // Notifikasi Flash
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
                    Manajemen Stok Unit
                </h2>
            }
        >
            <Head title="Stok Unit" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold text-gray-700">
                                Persediaan Produk di Setiap Unit
                            </h3>
                            <PrimaryButton onClick={openCreateModal}>
                                + Tambah Stok Awal
                            </PrimaryButton>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Unit Usaha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Produk
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            SKU
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kuantitas Stok
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Batas Minimum
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {unitStocks.data.map((stock) => (
                                        <tr
                                            key={stock.id}
                                            className={
                                                stock.quantity <=
                                                stock.low_stock_threshold
                                                    ? "bg-red-50 hover:bg-red-100"
                                                    : "hover:bg-gray-50"
                                            }
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-indigo-700">
                                                {stock.unit.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {stock.product.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                                                {stock.product.sku || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-lg font-bold">
                                                {stock.quantity.toLocaleString(
                                                    "id-ID"
                                                )}
                                                {stock.quantity <=
                                                    stock.low_stock_threshold && (
                                                    <span className="ml-2 text-red-600 text-xs font-normal">
                                                        ⚠️ Kritis
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                                {stock.low_stock_threshold}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(stock)
                                                    }
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    Edit Stok/Batas
                                                </button>
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

            {/* MODAL 1: Tambah Stok Awal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                        <h4 className="text-xl font-bold mb-6">
                            Tambah Stok Awal Produk ke Unit
                        </h4>
                        <form onSubmit={submitCreate}>
                            {/* Input Unit Usaha */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="unit_id"
                                    value="Pilih Unit Usaha"
                                />
                                <select
                                    id="unit_id"
                                    name="unit_id"
                                    value={data.unit_id}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) =>
                                        setData("unit_id", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">-- Pilih Unit --</option>
                                    {Object.entries(units).map(([id, name]) => (
                                        <option key={id} value={id}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.unit_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Pencarian Produk */}
                            <div className="mt-6 relative">
                                <InputLabel
                                    htmlFor="search_product"
                                    value="Cari & Pilih Produk"
                                />
                                <TextInput
                                    id="search_product"
                                    type="text"
                                    value={searchTerm}
                                    className="mt-1 block w-full"
                                    placeholder="Cari berdasarkan nama atau SKU..."
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    required={!selectedProduct}
                                />
                                {/* Hasil Pencarian */}
                                {searchResults.length > 0 && (
                                    <div className="absolute z-10 w-full bg-white border border-indigo-200 rounded-lg shadow-xl max-h-60 overflow-y-auto mt-1">
                                        {searchResults.map((product) => (
                                            <div
                                                key={product.id}
                                                onClick={() =>
                                                    handleProductSelect(product)
                                                }
                                                className="px-4 py-2 cursor-pointer hover:bg-indigo-50 flex justify-between items-center text-sm border-b border-gray-100 last:border-b-0"
                                            >
                                                <span>{product.name}</span>
                                                <span className="text-xs text-gray-500 font-mono">
                                                    (SKU: {product.sku || "-"})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <InputError
                                    message={errors.product_id}
                                    className="mt-2"
                                />
                                {selectedProduct && (
                                    <p className="mt-2 text-sm text-green-600">
                                        Produk Terpilih: **
                                        {selectedProduct.name}**
                                    </p>
                                )}
                            </div>

                            {/* Input Kuantitas Stok Awal */}
                            <div className="mt-6">
                                <InputLabel
                                    htmlFor="quantity"
                                    value="Kuantitas Stok Awal"
                                />
                                <TextInput
                                    id="quantity"
                                    type="number"
                                    value={data.quantity}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("quantity", e.target.value)
                                    }
                                    min="0"
                                    required
                                    disabled={!data.unit_id || !selectedProduct}
                                />
                                <InputError
                                    message={errors.quantity}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Batas Minimum Stok */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="low_stock_threshold"
                                    value="Batas Minimum Stok (Threshold)"
                                />
                                <TextInput
                                    id="low_stock_threshold"
                                    type="number"
                                    value={data.low_stock_threshold}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData(
                                            "low_stock_threshold",
                                            e.target.value
                                        )
                                    }
                                    min="0"
                                    required
                                />
                                <InputError
                                    message={errors.low_stock_threshold}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-center justify-end mt-8">
                                <button
                                    type="button"
                                    onClick={closeAllModals}
                                    className="text-gray-600 hover:text-gray-900 mr-4"
                                >
                                    Batal
                                </button>
                                <PrimaryButton
                                    disabled={
                                        processing ||
                                        !data.unit_id ||
                                        !data.product_id
                                    }
                                >
                                    Simpan Stok
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: Edit Stok dan Threshold */}
            {isEditModalOpen && currentStock && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h4 className="text-xl font-bold mb-6">
                            Edit Stok dan Batas untuk{" "}
                            {currentStock.product.name} (
                            {currentStock.unit.name})
                        </h4>
                        <form onSubmit={submitEdit}>
                            {/* Input Kuantitas Stok */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="edit_quantity"
                                    value="Kuantitas Stok Saat Ini"
                                />
                                <TextInput
                                    id="edit_quantity"
                                    type="number"
                                    value={data.quantity}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("quantity", e.target.value)
                                    }
                                    min="0"
                                    required
                                />
                                <InputError
                                    message={errors.quantity}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Batas Minimum Stok */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="edit_threshold"
                                    value="Batas Minimum Stok (Threshold)"
                                />
                                <TextInput
                                    id="edit_threshold"
                                    type="number"
                                    value={data.low_stock_threshold}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData(
                                            "low_stock_threshold",
                                            e.target.value
                                        )
                                    }
                                    min="0"
                                    required
                                />
                                <InputError
                                    message={errors.low_stock_threshold}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-center justify-end mt-8">
                                <button
                                    type="button"
                                    onClick={closeAllModals}
                                    className="text-gray-600 hover:text-gray-900 mr-4"
                                >
                                    Batal
                                </button>
                                <PrimaryButton disabled={processing}>
                                    Simpan Perubahan
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
