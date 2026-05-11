export function getEnv(key) {
    // Vite injects env vars on import.meta.env
    const value = import.meta.env[key];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function requireEnv(key) {
    const value = getEnv(key);
    if (!value) {
        throw new Error(
            `[Firebase config] Missing required environment variable: ${key}. ` +
            `Create it in a .env file (e.g. .env.local) for Vite and restart the dev server.`,
        );
    }
    return value;
}
