import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
// 🚨 Tambahkan ikon untuk tombol menu mobile
import { HiMenu, HiX } from "react-icons/hi";

const adminMenuGroups = [
    {
        group: "Manajemen Data",
        defaultRoute: "admin.students.index",
        items: [
            { name: "Santri & E-Kartu", route: "admin.students.index" },
            { name: "Orang Tua", route: "admin.guardians.index" },
        ],
    },
    {
        group: "Manajemen Produk",
        defaultRoute: "admin.products.index",
        items: [
            { name: "Unit Usaha", route: "admin.units.index" },
            { name: "Kategori", route: "admin.categories.index" },
            { name: "Produk", route: "admin.products.index" },
            { name: "Stok Unit", route: "admin.stocks.index" },
        ],
    },
    // {
    //     group: "Manajemen Pengguna",
    //     defaultRoute: "admin.users.index",
    //     items: [
    //         { name: "Pengguna", route: "admin.users.index" },
    //         { name: "Role", route: "admin.roles.index" },
    //         { name: "Permission", route: "admin.permissions.index" },
    //     ],
    // },
];

const posItem = { name: "Aplikasi POS", route: "pos.index" };
const GuardianItem = { name: "Dashboard", route: "guardian.dashboard" };

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const roles = user.roles ? user.roles.map((r) => r.name) : [];

    const isCashier = roles.includes("cashier");
    const isAdmin = roles.includes("admin");
    const isGuardian = roles.includes("guardian");
    const isManager = roles.includes("manager");

    const showAdmin = isAdmin || isManager;
    const showPos = isCashier || isManager;
    const showGuardian = isGuardian;

    // 🚨 State untuk mengontrol Sidebar/Drawer
    const [showingDrawer, setShowingDrawer] = useState(false);

    const isLinkActive = (item) => {
        if (!item || !item.route) return false;

        // Logika untuk mencocokkan rute index
        if (item.route.endsWith(".index")) {
            const base = item.route.replace(".index", "");
            return route().current(`${base}.*`);
        }
        return route().current(item.route);
    };

    const navLinkClass = (isActive) =>
        `inline-flex items-center border-b-2 px-2 py-5 font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
            isActive
                ? "border-indigo-400 text-gray-900 focus:border-indigo-700"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700"
        }`;

    // 🚨 Kelas untuk link di dalam drawer
    const drawerLinkClass = (isActive) =>
        `block w-full text-left px-4 py-2 text-sm ${
            isActive
                ? "bg-indigo-100 text-indigo-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* === KIRI: Logo & Menu Desktop === */}
                        <div className="flex items-center space-x-8">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-indigo-600" />
                            </Link>

                            {/* Desktop Navigation Links (Hidden on small screens) */}
                            <div className="hidden sm:flex h-full space-x-4 items-center">
                                {/* POS Menu */}
                                {showPos && (
                                    <NavLink
                                        href={route(posItem.route)}
                                        active={isLinkActive(posItem)}
                                    >
                                        {posItem.name}
                                    </NavLink>
                                )}

                                {/* Guardian Menu */}
                                {showGuardian && (
                                    <NavLink
                                        href={route(GuardianItem.route)}
                                        active={isLinkActive(GuardianItem)}
                                    >
                                        {GuardianItem.name}
                                    </NavLink>
                                )}

                                {/* === ADMIN MENU DESKTOP DENGAN DROPDOWN HOVER === */}
                                {showAdmin && (
                                    <>
                                        {/* Dashboard */}
                                        <NavLink
                                            href={route("admin.dashboard")}
                                            active={route().current(
                                                "admin.dashboard"
                                            )}
                                        >
                                            Dashboard
                                        </NavLink>

                                        {/* Dropdown Menu Groups */}
                                        {adminMenuGroups.map((group) => {
                                            const isActive = group.items.some(
                                                (i) => isLinkActive(i)
                                            );
                                            return (
                                                <div
                                                    key={group.group}
                                                    className="relative group h-full flex items-center"
                                                >
                                                    {/* Link utama berfungsi sebagai tombol dropdown dan link default */}
                                                    <Link
                                                        href={route(
                                                            group.defaultRoute
                                                        )}
                                                        className={navLinkClass(
                                                            isActive
                                                        )}
                                                    >
                                                        {group.group}
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="2"
                                                            stroke="currentColor"
                                                            className="w-4 h-4 ml-1 opacity-70"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </Link>

                                                    {/* Dropdown Items (muncul saat hover) */}
                                                    <div className="absolute top-full hidden group-hover:block bg-white border border-gray-100 rounded-md shadow-lg w-56 z-50 overflow-hidden">
                                                        {group.items.map(
                                                            (item) => (
                                                                <Link
                                                                    key={
                                                                        item.route
                                                                    }
                                                                    href={route(
                                                                        item.route
                                                                    )}
                                                                    className={drawerLinkClass(
                                                                        isLinkActive(
                                                                            item
                                                                        )
                                                                    )} // Gunakan kelas yang sama
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* === KANAN: User Dropdown & Tombol Mobile === */}
                        <div className="flex items-center">
                            {/* User Dropdown */}
                            <div className="hidden sm:block">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="inline-flex items-center border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-indigo-600 hover:border-indigo-300">
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

                            {/* Mobile Menu Button */}
                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowingDrawer((prev) => !prev)
                                    }
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                >
                                    {/* Tampilkan ikon menu atau close */}
                                    {showingDrawer ? (
                                        <HiX size={24} />
                                    ) : (
                                        <HiMenu size={24} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- RESPONSIVE DRAWER (SIDEBAR) --- */}
            {showingDrawer && (
                <div className="sm:hidden fixed inset-0 z-40">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black opacity-25"
                        onClick={() => setShowingDrawer(false)}
                    ></div>

                    {/* Drawer Content */}
                    <div
                        className="relative w-64 bg-white h-full shadow-xl transition-transform duration-300 ease-in-out transform translate-x-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b">
                            <h3 className="font-bold text-lg">{user.name}</h3>
                            <p className="text-sm text-gray-500">
                                {user.email}
                            </p>
                        </div>

                        <div className="space-y-2 p-4">
                            {/* POS & Guardian Menu Mobile */}
                            {showPos && (
                                <Link
                                    href={route(posItem.route)}
                                    className={drawerLinkClass(
                                        isLinkActive(posItem)
                                    )}
                                >
                                    {posItem.name}
                                </Link>
                            )}
                            {showGuardian && (
                                <Link
                                    href={route(GuardianItem.route)}
                                    className={drawerLinkClass(
                                        isLinkActive(GuardianItem)
                                    )}
                                >
                                    {GuardianItem.name}
                                </Link>
                            )}

                            {/* Dashboard Admin Mobile */}
                            {showAdmin && (
                                <Link
                                    href={route("admin.dashboard")}
                                    className={drawerLinkClass(
                                        route().current("admin.dashboard")
                                    )}
                                >
                                    Dashboard
                                </Link>
                            )}

                            {/* Menu Group Admin Mobile (Flat List) */}
                            {showAdmin && (
                                <>
                                    {adminMenuGroups.map((group) => (
                                        <div key={group.group}>
                                            <h5 className="font-semibold text-sm text-gray-700 mt-2 mb-1">
                                                {group.group}
                                            </h5>
                                            {group.items.map((item) => (
                                                <Link
                                                    key={item.route}
                                                    href={route(item.route)}
                                                    className={`pl-4 ${drawerLinkClass(
                                                        isLinkActive(item)
                                                    )}`}
                                                    onClick={() =>
                                                        setShowingDrawer(false)
                                                    } // Tutup drawer setelah klik
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        <div className="absolute bottom-0 w-full p-4 border-t space-y-2">
                            <Link
                                href={route("profile.edit")}
                                className={drawerLinkClass(
                                    route().current("profile.edit")
                                )}
                            >
                                Profile
                            </Link>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className={`${drawerLinkClass(
                                    false
                                )} text-red-600`}
                            >
                                Log Out
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            {/* --- END RESPONSIVE DRAWER --- */}

            {/* Header */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-lg font-semibold text-gray-800">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
