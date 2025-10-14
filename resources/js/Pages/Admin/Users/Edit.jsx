import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaUsersCog,
    FaStore,
    FaArrowLeft,
} from "react-icons/fa";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";

export default function UserEdit({ auth, user, roles, units, currentRole }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
        role_id: currentRole ? currentRole.toString() : "",
        unit_id: user.unit_id ? user.unit_id.toString() : "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.users.update", user.id));
    };

    const selectedRoleName = roles[data.role_id] || "";
    const roleIsCashier = selectedRoleName === "cashier";

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Pengguna: {user.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Edit Pengguna: ${user.name}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/80 backdrop-blur-md shadow-lg sm:rounded-2xl p-8 border border-gray-100">
                        <form onSubmit={submit}>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                Informasi Pengguna
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nama */}
                                <div>
                                    <InputLabel
                                        htmlFor="name"
                                        value="Nama Lengkap"
                                    />
                                    <div className="relative mt-1">
                                        <TextInput
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            className=" w-full"
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Email (Login)"
                                    />
                                    <div className="relative mt-1">
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="w-full"
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <InputLabel
                                        htmlFor="role_id"
                                        value="Peran / Role"
                                    />
                                    <div className="relative mt-1">
                                        <select
                                            id="role_id"
                                            name="role_id"
                                            value={data.role_id}
                                            className=" block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            onChange={(e) =>
                                                setData(
                                                    "role_id",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                -- Pilih Peran --
                                            </option>
                                            {Object.entries(roles).map(
                                                ([id, name]) => (
                                                    <option key={id} value={id}>
                                                        {name.toUpperCase()}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <InputError
                                        message={errors.role_id}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Unit Usaha (hanya untuk kasir) */}
                                {roleIsCashier && (
                                    <div>
                                        <InputLabel
                                            htmlFor="unit_id"
                                            value="Unit Tempat Bertugas"
                                        />
                                        <div className="relative mt-1">
                                            <select
                                                id="unit_id"
                                                name="unit_id"
                                                value={data.unit_id}
                                                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                onChange={(e) =>
                                                    setData(
                                                        "unit_id",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">
                                                    -- Pilih Unit --
                                                </option>
                                                {Object.entries(units).map(
                                                    ([id, name]) => (
                                                        <option
                                                            key={id}
                                                            value={id}
                                                        >
                                                            {name}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                        <InputError
                                            message={errors.unit_id}
                                            className="mt-2"
                                        />
                                    </div>
                                )}
                            </div>

                            <hr className="my-8 border-t border-gray-200" />

                            <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                Ganti Password (Opsional)
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Kosongkan kolom di bawah jika tidak ingin
                                mengubah password.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Password */}
                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password Baru"
                                    />
                                    <div className="relative mt-1">
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Konfirmasi Password */}
                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Konfirmasi Password"
                                    />
                                    <div className="relative mt-1">
                                        <TextInput
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end items-center gap-3 mt-10">
                                <Link href={route("admin.users.index")}>
                                    <SecondaryButton>Batal</SecondaryButton>
                                </Link>

                                <PrimaryButton disabled={processing}>
                                    {processing
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
