import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import PrimaryButton from "@/Components/PrimaryButton";
import {
    FaEdge,
    FaEdit,
    FaPlusCircle,
    FaSearch,
    FaSyncAlt,
    FaTrash,
} from "react-icons/fa";
import FormatRupiah from "@/Pages/Utils/FormatRupiah";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import Pagination from "@/Components/Pagination";

const ProductForm = ({ initialData, categories, onClose, isEditing }) => {
    const { data, setData, post, put, errors, processing, reset } = useForm({
        name: initialData.name || "",
        sku: initialData.sku || "",
        selling_price: Number(initialData.selling_price) || 0,
        purchase_price: Number(initialData.purchase_price) || 0,
        is_active: initialData.is_active ?? true,
        category_id: initialData.category_id,
    });

    const submit = (e) => {
        e.preventDefault();
        const endpoint = isEditing
            ? route("admin.products.update", initialData.id)
            : route("admin.products.store");

        const method = isEditing ? put : post;

        method(endpoint, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <form onSubmit={submit} className="p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
                {isEditing
                    ? `Edit Produk: ${initialData.name}`
                    : "Tambah Produk Baru"}
            </h2>

            {/* Santri yang Ditautkan */}
            <div className="mb-6">
                <InputLabel htmlFor="category_id" value="Kategori Produk" />
                <select
                    id="category_id"
                    name="category_id"
                    value={data.category_id}
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    onChange={(e) => setData("category_id", e.target.value)}
                    required
                >
                    <option value="">-- Pilih Kategori --</option>
                    {Object.entries(categories).map(([id, name]) => (
                        <option key={id} value={id}>
                            {name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.category_id} className="mt-2" />
            </div>

            {/* Nama Produk */}
            <div className="mb-4">
                <InputLabel htmlFor="name" value="Nama Produk" />
                <TextInput
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="mt-1 block w-full"
                    isFocused
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div className="mb-4">
                <InputLabel htmlFor="sku" value="SKU Produk" />
                <TextInput
                    id="sku"
                    value={data.sku}
                    onChange={(e) => setData("sku", e.target.value)}
                    className="mt-1 block w-full"
                />
                <InputError message={errors.sku} className="mt-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* No Telepon */}
                <div>
                    <InputLabel htmlFor="purchase_price" value="Harga Beli" />
                    <TextInput
                        id="purchase_price"
                        type="number"
                        value={data.purchase_price}
                        onChange={(e) =>
                            setData("purchase_price", e.target.value)
                        }
                        className="mt-1 block w-full"
                    />
                    <InputError
                        message={errors.purchase_price}
                        className="mt-2"
                    />
                </div>
                {/* Harga Jual */}
                <div>
                    <InputLabel htmlFor="selling_price" value="Harga Jual" />
                    <TextInput
                        id="selling_price"
                        type="number"
                        value={data.selling_price}
                        onChange={(e) =>
                            setData("selling_price", e.target.value)
                        }
                        className="mt-1 block w-full"
                    />
                    <InputError
                        message={errors.selling_price}
                        className="mt-2"
                    />
                </div>
            </div>

            {isEditing && (
                <div>
                    <InputLabel value="Status Produk" />
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
                    <InputError message={errors.is_active} className="mt-2" />
                </div>
            )}

            <div className="flex justify-end mt-6">
                <SecondaryButton onClick={onClose} className="mr-3">
                    Batal
                </SecondaryButton>
                <PrimaryButton>
                    {isEditing ? "Simpan Perubahan" : "Tambahkan Produk"}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default function ProductIndex({
    auth,
    products,
    categories,
    filters = {},
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [search, setSearch] = useState(filters.search || "");
    const [categoryFilter, setCategoryFilter] = useState(filters.class || "");
    const [status, setStatus] = useState(filters.status || "");

    // Filter
    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route("admin.products.index"),
            { search, category: categoryFilter, status },
            { preserveState: true, replace: true }
        );
    };

    const openModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingProduct(null);
        setIsModalOpen(false);
    };

    const handleDelete = (product) => {
        Swal.fire({
            title: `Hapus Produk ${product.name}?`,
            text: "Produk yang masih ada di stok unit tidak bisa dihapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.products.destroy", product.id));
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Produk
                </h2>
            }
        >
            <Head title="Manajemen Produk" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/90 backdrop-blur-md shadow-lg sm:rounded-2xl p-8 border border-gray-100">
                        {/* Header dan Tombol Tambah */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                Daftar Produk
                            </h3>
                            <PrimaryButton
                                className="flex items-center gap-2 text-sm px-5 py-2.5"
                                onClick={() => openModal(null)}
                            >
                                <FaPlusCircle /> Tambah Produk
                            </PrimaryButton>
                        </div>

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
                                        placeholder="Cari produk..."
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 text-sm"
                                    />
                                    <FaSearch className="absolute top-3 left-3 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Kategori
                                </label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={categoryFilter}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    onChange={(e) =>
                                        setCategoryFilter(e.target.value)
                                    }
                                >
                                    <option value="">Semua</option>
                                    {Object.entries(categories).map(
                                        ([id, name]) => (
                                            <option key={id} value={id}>
                                                {name}
                                            </option>
                                        )
                                    )}
                                </select>
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
                                        setCategoryFilter("");
                                        setStatus("");
                                        router.get(
                                            route("admin.products.index")
                                        );
                                    }}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <FaSyncAlt /> Reset
                                </button>
                            </div>
                        </form>

                        {/* Tabel Daftar Produk */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Produk
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            SKU
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Harga Beli (HPP)
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Harga Jual
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
                                    {products.data.length > 0 ? (
                                        products.data.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap font-semibold">
                                                    {product.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {product.category.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                                                    {product.sku || "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">
                                                    {FormatRupiah(
                                                        Number(
                                                            product.purchase_price
                                                        )
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-indigo-600">
                                                    {FormatRupiah(
                                                        Number(
                                                            product.selling_price
                                                        )
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            product.is_active
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {product.is_active
                                                            ? "Aktif"
                                                            : "Non-aktif"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 flex space-x-2 ">
                                                    <SecondaryButton
                                                        onClick={() =>
                                                            openModal(product)
                                                        }
                                                    >
                                                        <FaEdit className="mr-1" />
                                                        {""}
                                                        Edit
                                                    </SecondaryButton>
                                                    <DangerButton
                                                        onClick={() =>
                                                            handleDelete(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        <FaTrash className="mr-1" />
                                                        {""}
                                                        Hapus
                                                    </DangerButton>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-4 text-center text-gray-500 italic"
                                            >
                                                {filters.search ||
                                                filters.category ||
                                                filters.status
                                                    ? `Tidak ada produk ditemukan dengan kriteria pencarian tersebut`
                                                    : "Belum ada data produk yang tercatat."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <Pagination
                            links={products.links}
                            from={products.from}
                            to={products.to}
                            total={products.total}
                        />
                    </div>
                </div>
            </div>
            {/* Modal Tambah/Edit */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <ProductForm
                    initialData={editingProduct || { categories: [] }}
                    categories={categories}
                    onClose={closeModal}
                    isEditing={!!editingProduct}
                />
            </Modal>
        </AuthenticatedLayout>
    );
}
