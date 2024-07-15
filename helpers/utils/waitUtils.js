import { debugLog } from "./logUtils.js";

/**
 * Waits until element can be located on page in given amount of milliseconds, otherwise throws an exception
 * @param {string | WebdriverIO.Element} locator element locator or element object
 * @param {number} [timeout=5000] timout in milliseconds
 * @returns {Promise<WebdriverIO.Element>} A promise which resolves in case element is found within given timeout, rejects if not
 */
async function waitForElementToBePresent(locator, timeout = 5000){
    const actualLocator = typeof locator === 'string' ? locator : locator.selector
    debugLog('waitForElementToBePresent:', `trying to locate element by ${JSON.stringify(actualLocator)} locator`)
    await $(actualLocator).waitForExist({
        timeout: timeout,
        timeoutMsg: `Unable to locate element by ${JSON.stringify(actualLocator)}} in ${timeout} milliseconds`,
        interval: 300
    })
    return await $(actualLocator)
}

export { waitForElementToBePresent }