import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function UserEdit({ auth, user, roles, units, currentRole }) {
    // Terima currentRole (ID)

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
        role_id: currentRole ? currentRole.toString() : "", // Set role awal
        unit_id: user.unit_id ? user.unit_id.toString() : "", // Set unit awal
    });

    const submit = (e) => {
        e.preventDefault();
        // Inertia PUT method untuk update
        put(route("admin.users.update", user.id));
    };

    // Tentukan apakah input Unit ID harus ditampilkan (hanya untuk role Kasir)
    // Cari nama role berdasarkan ID yang dipilih
    const selectedRoleName = Object.keys(roles).find(
        (key) => key === data.role_id
    )
        ? roles[data.role_id]
        : "";
    const roleIsCashier = selectedRoleName === "kasir";

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Pengguna: {user.name}
                </h2>
            }
        >
            <Head title={`Edit Pengguna: ${user.name}`} />

            <div className="py-12">
                <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            {/* Input Nama */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Lengkap"
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

                            {/* Input Email */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="email"
                                    value="Email (Login)"
                                />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Role */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="role_id"
                                    value="Peran / Role"
                                />
                                <select
                                    id="role_id"
                                    name="role_id"
                                    value={data.role_id}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) =>
                                        setData("role_id", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">-- Pilih Peran --</option>
                                    {Object.entries(roles).map(([id, name]) => (
                                        <option key={id} value={id}>
                                            {name.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.role_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Unit Usaha (Hanya tampil jika peran = Kasir) */}
                            {roleIsCashier && (
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="unit_id"
                                        value="Unit Tempat Kasir Bertugas"
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
                                        <option value="">
                                            -- Pilih Unit --
                                        </option>
                                        {Object.entries(units).map(
                                            ([id, name]) => (
                                                <option key={id} value={id}>
                                                    {name}
                                                </option>
                                            )
                                        )}
                                    </select>
                                    <InputError
                                        message={errors.unit_id}
                                        className="mt-2"
                                    />
                                </div>
                            )}

                            <hr className="my-8 border-t" />
                            <p className="text-sm text-gray-500 mb-4">
                                Kosongkan kolom *password* jika tidak ingin
                                diubah.
                            </p>

                            {/* Input Password */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password Baru"
                                />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            {/* Input Konfirmasi Password */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Konfirmasi Password"
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-center justify-end mt-8">
                                <Link
                                    href={route("admin.users.index")}
                                    className="text-gray-600 hover:text-gray-900 mr-4"
                                >
                                    Batal
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    Update Pengguna
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
