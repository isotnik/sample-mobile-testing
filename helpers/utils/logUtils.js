/**
 * Logs debug messages to the console if the DEBUG environment variable is set to 'true'.
 * @param {...any} args - The messages or objects to be logged.
 */
function debugLog (...args) {
    if (process.env.DEBUG === 'true') {
        const timestamp = new Date().toISOString()
        console.log(`[${timestamp}]`, ...args)
    }
}

export { debugLog }