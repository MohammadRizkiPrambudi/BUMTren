import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function ProductEdit({ auth, product, categories }) {
    // Inisialisasi useForm dengan data produk yang ada
    const { data, setData, put, processing, errors } = useForm({
        category_id: product.category_id.toString(), // Pastikan ini string jika di <select>
        name: product.name,
        sku: product.sku || "",
        purchase_price: product.purchase_price,
        selling_price: product.selling_price,
        is_active: product.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        // Kirim data ke ProductController@update (menggunakan PUT method)
        put(route("admin.products.update", product.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Produk: {product.name}
                </h2>
            }
        >
            <Head title={`Edit Produk: ${product.name}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            {/* Input Kategori (Bisa diubah) */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="category_id"
                                    value="Kategori Produk"
                                />
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={data.category_id}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) =>
                                        setData("category_id", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Pilih Kategori --
                                    </option>
                                    {Object.entries(categories).map(
                                        ([id, name]) => (
                                            <option key={id} value={id}>
                                                {name}
                                            </option>
                                        )
                                    )}
                                </select>
                                <InputError
                                    message={errors.category_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Nama Produk */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Produk"
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

                            {/* Input SKU */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="sku"
                                    value="SKU / Kode Barang (Opsional)"
                                />
                                <TextInput
                                    id="sku"
                                    type="text"
                                    name="sku"
                                    value={data.sku}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("sku", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.sku}
                                    className="mt-2"
                                />
                            </div>

                            <hr className="my-8 border-t" />
                            <h3 className="text-xl font-semibold mb-6 text-gray-700">
                                Penentuan Harga & Status
                            </h3>

                            {/* Input Harga Beli (HPP) */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="purchase_price"
                                    value="Harga Beli (HPP) / Modal (Rp)"
                                />
                                <TextInput
                                    id="purchase_price"
                                    type="number"
                                    name="purchase_price"
                                    value={data.purchase_price}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData(
                                            "purchase_price",
                                            e.target.value
                                        )
                                    }
                                    min="0"
                                    required
                                />
                                <InputError
                                    message={errors.purchase_price}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Harga Jual */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="selling_price"
                                    value="Harga Jual (Rp)"
                                />
                                <TextInput
                                    id="selling_price"
                                    type="number"
                                    name="selling_price"
                                    value={data.selling_price}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("selling_price", e.target.value)
                                    }
                                    min="0"
                                    required
                                />
                                <InputError
                                    message={errors.selling_price}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Status Aktif */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="is_active"
                                    value="Status Produk"
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
                                    <option value={1}>Aktif (Dijual)</option>
                                    <option value={0}>
                                        Non-aktif (Tidak Dijual)
                                    </option>
                                </select>
                                <InputError
                                    message={errors.is_active}
                                    className="mt-2"
                                />
                            </div>

                            {/* Tombol Simpan */}
                            <div className="flex items-center justify-between mt-8">
                                <Link
                                    href={route("admin.products.index")}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Batal
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    Update Produk
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
