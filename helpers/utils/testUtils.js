
function compareObjectArrays(actual, expected) {
    const normalizeArray = (arr, reference) => {
        const keys = Object.keys(reference[0]) // Take keys from the first object of the expected array
        return arr.map(item => {
            let filteredObject = {}
            keys.forEach(key => {
                if (key in item) {
                    filteredObject[key] = item[key]
                }
            });
            return filteredObject
        })
    }
    const normalizedActual = normalizeArray(actual, expected)
    const sortObjects = (a, b) => {
        for (let key of Object.keys(normalizedActual[0])) {
            if (a[key] < b[key]) return -1
            if (a[key] > b[key]) return 1
        }
        return 0
    }
    const sortedActual = normalizedActual.sort(sortObjects)
    const sortedExpected = expected.sort(sortObjects)
    console.log('sorted actual:', sortedActual)
    console.log('sorted expected:', sortedExpected)
    expect(sortedActual).toEqual(sortedExpected)

}

export { compareObjectArrays }