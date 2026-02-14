import Constants from 'expo-constants';

// For Expo Go, localhost won't work on actual devices. 
// We try to detect the host IP.
const getBaseUrl = () => {
    const hostUri = Constants.expoConfig?.hostUri;
    if (!hostUri) return 'http://localhost:8080';

    const host = hostUri.split(':')[0];
    return `http://${host}:8080`;
};

const API_BASE = getBaseUrl();
const VALIDATE_PATH = '/api/v1/invoices/validate';
const HISTORY_PATH = '/api/v1/invoices';

export async function validateInvoice(payload) {
    try {
        const response = await fetch(`${API_BASE}${VALIDATE_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => null);

        if (response.ok) {
            return { ok: true, data };
        }

        return {
            ok: false,
            status: response.status,
            error: response.status === 422 ? 'invalid_data' : 'server_error',
            data
        };
    } catch (error) {
        return { ok: false, error: 'network_error' };
    }
}

export async function getValidationHistory() {
    try {
        const response = await fetch(`${API_BASE}${HISTORY_PATH}`);
        if (!response.ok) throw new Error('Failed to fetch history');
        return await response.json();
    } catch (error) {
        console.error('History fetch failed:', error);
        return [];
    }
}
