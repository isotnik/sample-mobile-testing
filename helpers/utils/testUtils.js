import { debugLog } from "./logUtils.js";

/**
 * Compares arrays of objects by normalizing and sorting them.
 * Logs in debug normalized and sorted arrays and asserts equality of them.
 * Only properties existing in expected object are compared, the rest is ignored.
 * @param {Object[]} actual - The actual array of objects.
 * @param {Object[]} expected - The expected array of objects.
 */
function compareObjectArrays(actual, expected) {
    const keys = Object.keys(expected[0])
    const normalizedActual = actual.map(item =>
        keys.reduce((obj, key) => {
            if (key in item) obj[key] = item[key]
            return obj
        }, {})
    )
    const sortObjects = (a, b) => {
        for (let key of Object.keys(normalizedActual[0])) {
            if (a[key] < b[key]) return -1
            if (a[key] > b[key]) return 1
        }
        return 0
    }
    const sortedActual = normalizedActual.sort(sortObjects)
    const sortedExpected = expected.sort(sortObjects)
    debugLog('sorted actual:', sortedActual)
    debugLog('sorted expected:', sortedExpected)
    expect(sortedActual).toEqual(sortedExpected)
}

function isCurrentServiceBrowserStack() {
    return driver.options.services[0][0] === 'browserstack'
}

export { compareObjectArrays, isCurrentServiceBrowserStack }