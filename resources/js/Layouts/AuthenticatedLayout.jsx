import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

// Konfigurasi untuk tautan navigasi utama (Ini terutama tautan ADMIN)
const adminNavItems = [
    {
        name: "Dashboard",
        route: "dashboard",
    },
    {
        name: "Manajemen Santri & E-Kartu",
        route: "admin.students.index",
    },
    {
        name: "Manajemen Orang Tua",
        route: "admin.guardians.index",
    },
    {
        name: "Manajemen Unit Usaha",
        route: "admin.units.index",
    },
    {
        name: "Kategori",
        route: "admin.categories.index",
    },
    {
        name: "Manajemen Produk",
        route: "admin.products.index",
    },
    {
        name: "Stok Unit",
        route: "admin.stocks.index",
    },
    {
        name: "Pengguna",
        route: "admin.users.index",
    },
];

// Konfigurasi untuk tautan POS (Digunakan oleh Kasir/Manager)
const posItem = {
    name: "Aplikasi POS",
    route: "pos.index",
};

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const userRoles = user.roles ? user.roles.map((role) => role.name) : [];

    console.log(userRoles);

    const isCashier = userRoles.includes("cashier");
    const isAdmin = userRoles.includes("admin");
    const isManager = userRoles.includes("manager");

    // Tampilkan menu administrasi penuh jika peran adalah admin atau manager
    const showAdminMenus = isAdmin || isManager;
    // Tampilkan tautan POS jika peran adalah kasir atau manager
    const showPosLink = isCashier || isManager;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const isLinkActive = (item) => {
        if (item.route.endsWith(".index") && item.route !== "dashboard") {
            const baseRoute = item.route.replace(".index", "");
            return route().current(`${baseRoute}.*`);
        }
        if (item.route === "pos.index") {
            return route().current("pos.*");
        }
        return route().current(item.route);
    };

    return (
        // 1. BACKGROUND UTAMA: Diubah ke abu-abu yang lebih cerah atau warna kustom
        <div className="min-h-screen bg-gray-50">
            {/* 2. NAVBAR: Tetap putih, tapi border-nya diubah */}
            <nav className="bg-white border-b border-indigo-100 shadow-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Logo and Desktop Navigation */}
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    {/* Logo: Tetap netral */}
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-indigo-600" />
                                </Link>
                            </div>

                            {/* Desktop Nav Links (ROLE FILTERING HERE) */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {/* Link POS (Untuk Kasir & Manager) */}
                                {showPosLink && (
                                    <NavLink
                                        key={posItem.route}
                                        href={route(posItem.route)}
                                        active={isLinkActive(posItem)}
                                    >
                                        {posItem.name}
                                    </NavLink>
                                )}

                                {/* Admin Nav Links (Hanya untuk Admin/Manager) */}
                                {showAdminMenus &&
                                    adminNavItems.map((item) => (
                                        <NavLink
                                            key={item.route}
                                            href={route(item.route)}
                                            active={isLinkActive(item)}
                                        >
                                            {item.name}
                                        </NavLink>
                                    ))}
                            </div>
                        </div>

                        {/* Settings Dropdown */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            // 3. DROPDOWN BUTTON: Lebih fokus pada hover effect
                                            className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 transition duration-150 ease-in-out hover:text-indigo-600 hover:border-indigo-300 focus:outline-none focus:border-indigo-300"
                                        >
                                            {user.name}
                                            <svg
                                                className="-me-0.5 ms-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Menu Button (Hamburger) */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                // 4. MOBILE HAMBURGER: Diubah agar hover/focus lebih berwarna
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-indigo-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-indigo-500 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Responsive Navigation Menu (ROLE FILTERING HERE) */}
                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        {/* Link POS Responsif */}
                        {showPosLink && (
                            <ResponsiveNavLink
                                key={posItem.route}
                                href={route(posItem.route)}
                                active={isLinkActive(posItem)}
                            >
                                {posItem.name}
                            </ResponsiveNavLink>
                        )}

                        {/* Admin Nav Links Responsif */}
                        {showAdminMenus &&
                            adminNavItems.map((item) => (
                                <ResponsiveNavLink
                                    key={item.route}
                                    href={route(item.route)}
                                    active={isLinkActive(item)}
                                >
                                    {item.name}
                                </ResponsiveNavLink>
                            ))}
                    </div>

                    {/* Responsive Settings Options */}
                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                // 5. HEADER (SHADOW): Diubah untuk tampilan yang lebih terangkat
                <header className="bg-white shadow-lg">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-xl font-semibold text-gray-800">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
