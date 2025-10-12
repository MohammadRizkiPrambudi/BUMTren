import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function UnitEdit({ auth, unit }) {
    const { data, setData, put, processing, errors } = useForm({
        name: unit.name,
        location: unit.location,
        // manager_name: unit.manager_name || "",
        // is_active: unit.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.units.update", unit.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Unit: {unit.name}
                </h2>
            }
        >
            <Head title={`Edit Unit: ${unit.name}`} />

            <div className="py-12">
                <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            {/* Input Nama Unit */}
                            <div className="mt-4">
                                <InputLabel htmlFor="name" value="Nama Unit" />
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
                                    value="Lokasi Fisik"
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
                                    value="Nama Manajer/Penanggung Jawab"
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

                            {/* Input Status Aktif */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="is_active"
                                    value="Status Operasional Unit"
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
                                    <option value={1}>
                                        Aktif (Beroperasi)
                                    </option>
                                    <option value={0}>
                                        Non-aktif (Tutup/Maintenance)
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
                                    href={route("admin.units.index")}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Batal
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    Update Unit Usaha
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
