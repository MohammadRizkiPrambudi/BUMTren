import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Create({ auth, types, parents }) {
    const { data, setData, post, processing, errors } = useForm({
        code: "",
        name: "",
        type: "",
        parent_id: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.financial-accounts.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Tambah Akun Keuangan
                </h2>
            }
        >
            <Head title="Tambah Akun Keuangan" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/80 backdrop-blur-md shadow-lg sm:rounded-2xl p-8 border border-gray-100">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <InputLabel
                                        htmlFor="code"
                                        value="Kode Akun"
                                    />
                                    <TextInput
                                        id="code"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData("code", e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        placeholder="Contoh: 1-101"
                                        required
                                    />
                                    <InputError
                                        message={errors.code}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="type"
                                        value="Tipe Akun"
                                    />
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={(e) =>
                                            setData("type", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    >
                                        <option value="">
                                            -- Pilih Tipe --
                                        </option>
                                        {types.map((t) => (
                                            <option key={t} value={t}>
                                                {t.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={errors.type}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <InputLabel htmlFor="name" value="Nama Akun" />
                                <TextInput
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    placeholder="Contoh: Kas Kantin, Pendapatan Topup"
                                    required
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-6">
                                <InputLabel
                                    htmlFor="parent_id"
                                    value="Parent Akun (Opsional)"
                                />
                                <select
                                    id="parent_id"
                                    value={data.parent_id}
                                    onChange={(e) =>
                                        setData("parent_id", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">
                                        -- Tidak ada parent --
                                    </option>
                                    {parents.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.code} - {p.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.parent_id}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex justify-end items-center gap-3 mt-10">
                                <Link
                                    href={route(
                                        "admin.financial-accounts.index"
                                    )}
                                >
                                    <SecondaryButton>Batal</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing
                                        ? "Menyimpan..."
                                        : "Tambahkan Akun"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
