// resources/js/Components/Pagination.jsx
import { Link } from "@inertiajs/react";

export default function Pagination({ links, from, to, total }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
            <div className="text-gray-700">
                Menampilkan {from} sampai {to} dari {total} data.
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-1">
                {links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url || "#"}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                            link.active
                                ? "bg-indigo-600 text-white font-bold"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                ))}
            </div>
        </div>
    );
}
