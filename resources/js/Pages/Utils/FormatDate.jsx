const DATE_OPTIONS = {
    day: "numeric",
    month: "long",
    year: "numeric",
};

const DATETIME_OPTIONS = {
    ...DATE_OPTIONS,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Jakarta",
    timeZoneName: "short",
};

/**
 * Memformat tanggal ke format Indonesia tanpa waktu.
 * @param {Date|string} dateInput
 * @returns {string} Contoh: 16 Oktober 2025
 */
export const FormatDateIndonesia = (dateInput) => {
    const date = new Date(dateInput);
    if (isNaN(date)) {
        return "-";
    }
    return new Intl.DateTimeFormat("id-ID", DATE_OPTIONS).format(date);
};

/**
 * Memformat tanggal dan waktu ke format Indonesia.
 * @param {Date|string} dateInput
 * @returns {string} Contoh: 16 Oktober 2025, 09.27.29 WIB
 */
export const FormatDateTimeIndonesia = (dateInput) => {
    const date = new Date(dateInput);

    if (isNaN(date)) {
        return "-";
    }
    const formatter = new Intl.DateTimeFormat("id-ID", DATETIME_OPTIONS);
    let formattedString = formatter.format(date);
    formattedString = formattedString.replace("pukul", ",");
    return formattedString;
};
