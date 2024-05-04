function debugLog (...args) {
    if (process.env.DEBUG === 'true') {
        console.log(...args)
    }
}

export { debugLog }