/**
 * Italian VAT (Partita IVA) utility.
 * Algorithm provided by the user.
 */

/**
 * Calculates the check digit for the first 10 digits of an Italian VAT number.
 * @param {string} piva10 The first 10 digits of the VAT number.
 * @returns {number} The calculated 11th digit.
 */
export function calculateCheckDigit(piva10) {
    if (!/^\d{10}$/.test(piva10)) {
        throw new Error('PIVA base must be 10 digits');
    }

    const digits = piva10.split('').map(Number);

    // 1. Sum the digits in the odd positions (1st, 3rd, 5th, 7th, 9th)
    // Indices are 0, 2, 4, 6, 8
    const sOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];

    // 2. Process the digits in the even positions (2nd, 4th, 6th, 8th, 10th)
    // Indices are 1, 3, 5, 7, 9
    let sEven = 0;
    [1, 3, 5, 7, 9].forEach(i => {
        let val = digits[i] * 2;
        if (val > 9) val -= 9;
        sEven += val;
    });

    // 3. Compute the total
    const s = sOdd + sEven;

    // 4. Calculate the check digit
    return (10 - (s % 10)) % 10;
}

/**
 * Validates an 11-digit Italian VAT number.
 * @param {string} piva11 The full 11-digit VAT number.
 * @returns {boolean} True if valid.
 */
export function isValidPiva(piva11) {
    if (!/^\d{11}$/.test(piva11)) return false;
    const base = piva11.substring(0, 10);
    const checkDigit = Number(piva11.charAt(10));
    try {
        return calculateCheckDigit(base) === checkDigit;
    } catch (e) {
        return false;
    }
}

/**
 * Corrects the check digit of a Partita IVA.
 * @param {string} piva The PIVA (10 or 11 digits).
 * @returns {string} The corrected 11-digit PIVA.
 */
export function correctPiva(piva) {
    const digitsOnly = piva.replace(/\D/g, '').substring(0, 11);
    if (digitsOnly.length < 10) return digitsOnly;

    const base = digitsOnly.substring(0, 10);
    const correctCheck = calculateCheckDigit(base);
    return base + correctCheck;
}
