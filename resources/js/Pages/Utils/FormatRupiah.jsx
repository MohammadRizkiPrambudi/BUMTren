export default function FormatRupiah(number) {
    if (typeof number !== "number" || isNaN(number)) return "0";
    return number
        .toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        })
        .replace("IDR", "")
        .trim();
}
