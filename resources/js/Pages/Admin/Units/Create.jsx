import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link } from "@inertiajs/react";

export default function UnitCreate({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        location: "",
        // manager_name: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.units.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tambah Unit Usaha
                </h2>
            }
        >
            <Head title="Tambah Unit" />

            <div className="py-12">
                <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            {/* Input Nama Unit */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Unit (Contoh: Kantin Utama)"
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

                            {/* Input Lokasi */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="location"
                                    value="Lokasi Fisik (Contoh: Gedung A Lantai 1)"
                                />
                                <TextInput
                                    id="location"
                                    type="text"
                                    name="location"
                                    value={data.location}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("location", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.location}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Manajer */}
                            {/* <div className="mt-4">
                                <InputLabel
                                    htmlFor="manager_name"
                                    value="Nama Manajer/Penanggung Jawab (Opsional)"
                                />
                                <TextInput
                                    id="manager_name"
                                    type="text"
                                    name="manager_name"
                                    value={data.manager_name}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("manager_name", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.manager_name}
                                    className="mt-2"
                                />
                            </div> */}

                            {/* Tombol Simpan */}
                            <div className="flex items-center justify-between mt-8">
                                <Link
                                    href={route("admin.units.index")}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Batal
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    Simpan Unit Usaha
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
