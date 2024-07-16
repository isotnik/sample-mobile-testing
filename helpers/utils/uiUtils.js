import { debugLog } from "./logUtils.js"
import { isCurrentServiceBrowserStack } from "./testUtils.js"

/**
 * Performs swipe back gesture, may not work on iOS simulator
 */
async function swipeBack() {
    await driver.execute(
        driver.isIOS
            ? 'mobile: swipe'
            : 'mobile: swipeGesture',
        driver.isIOS
            ? { direction: 'right', velocity: 400 }
            : {
                direction: 'right',
                left: 5,
                top: 500,
                width: 300,
                height: 50,
                percent: 1.0,
            }
    )
}

/**
 * Performs scroll down until element by given locator can be found.
 * This is very useful in case when you have scrollable list,
 * but only elements currently shown in viewport are present in elements tree.
 * @param {string} locator - element locator
 * @param {WebdriverIO.Element} [parentElement] - parent element in case you need to look for specific element inside another element which is already present
 * @param {number} [scrollAttemptsLimit] - set limit of scroll attempts, 5 by default
 */
async function scrollDownUntilElementPresent (locator, parentElement, scrollAttemptsLimit) {
    const scrollAttempts = (typeof scrollAttemptsLimit === 'number') ? scrollAttemptsLimit : 5 // limit scroll attempts to avoid endless cycle
    let element
    if (parentElement) {
        await parentElement.waitForExist({timeout: 2000, timeoutMsg: 'Parent element is not present'})
    }
    for (let i = 0; i < scrollAttempts; i++) {
        element = parentElement  ? await parentElement.$(locator) : await $(locator)
        let elementNotFound = true
        try {
            await element.waitForExist({timeout: 2000})
            elementNotFound = false
        } catch (error) {
            elementNotFound = true
        }
        if (elementNotFound) {
            debugLog(`scrollDownUntilElementPresent: Element with ${locator} locator is not on screen, scrolling down`)
            await scrollDown()
        }
        else {
            debugLog(`scrollDownUntilElementPresent: Element with ${locator} locator was found in ${i} scrolls`)
            return element
        }
    }
    if (element.error) {
        throw new Error(`Wasn't able to scroll to element with ${locator} in ${scrollAttempts} scrolls.`)
    }
    return element
}

/**
 * Performs scroll down using swipe gesture
 */
async function scrollDown () {
    if (driver.options['services'][0][0] === 'appium') {
        const screenSize = await driver.getWindowSize()
        await driver.execute(
            driver.isIOS
                ? 'mobile: swipe'
                : 'mobile: swipeGesture',
            driver.isIOS
                ? { direction: 'up'}
                : {
                    direction: 'up',
                    left: 0,
                    top: 20,
                    width: screenSize.width/2,
                    height: screenSize.height/2,
                    percent: 1,
                    speed: 900
                }
        )
    } else if (isCurrentServiceBrowserStack()) { // browserstack doesn't support mobile: swipeGesture
        const { width, height } = await driver.getWindowRect()
        const start_y = Math.floor(height * 0.7)
        const end_y = Math.floor(height * 0.3)
        const x = Math.floor(width * 0.5)
        await driver.touchAction([
            { action: 'press', x: x, y: start_y },
            { action: 'wait', ms: 1000 },
            { action: 'moveTo', x: x, y: end_y },
            { action: 'release' }
        ]);
    }
}

/**
 * Performs scroll up using swipe gesture
 */
async function scrollUp() {
    const screenSize = await driver.getWindowSize()
    await driver.execute(
        driver.isIOS
            ? 'mobile: swipe'
            : 'mobile: swipeGesture',
        driver.isIOS
            ? { direction: 'down'}
            : {
                direction: 'down',
                left: 0,
                top: 20,
                width: screenSize.width/2,
                height: screenSize.height/2,
                percent: 1,
                speed: 900
            }
    )
}

/**
 * Performs calculation of vertical position of element in viewport (between provided header and footer elements)
 * This is very useful in case when you have scrollable list and element exists, but not all attributes are correct until it's in viewport
 * @param {WebdriverIO.Element} element - element to be visible in viewport
 * @param {string} viewportHeaderLocator - locator for top element, if null it means that viewport is not limited from top
 * @param {string} viewportFooterLocator - locator for bottom element, if null it means that viewport is not limited from bottom with any element but keyboard
 * @returns {Promise<Object>} - An object containing two properties: `pixelsToTop` and `pixelsToBottom`, `pixelsToTop` is distance between element top to bottom of header (or status bar),
 * `pixelsToBottom` is distance between element bottom to top of footer (or navigations bar),
 * if distance is <=0 it means that element is not fully shown in viewport, and we need to scroll to see it
 */
async function elementViewportVerticalPosition (element, viewportHeaderLocator, viewportFooterLocator){
    let viewportHeaderRect
    let viewportFooterRect
    let statusBarHeight
    let navBarHeight
    const screenSize = await driver.getWindowSize()
    if (driver.isAndroid) {
        const bars = await driver.getSystemBars()
        statusBarHeight = bars["statusBar"].height
        navBarHeight = bars["navigationBar"].height
    } else {
        // assume status and navigation bars on iOS
        statusBarHeight = 65
        navBarHeight = 100
    }
    if (viewportHeaderLocator) {
        viewportHeaderRect = await driver.getElementRect((await $(viewportHeaderLocator)).elementId)
    } else {
        // assume there is no header
        viewportHeaderRect = { x: 0, y:0, width: 0, height: statusBarHeight }
    }
    if (viewportFooterLocator) {
        viewportFooterRect = await driver.getElementRect((await $(viewportFooterLocator)).elementId)
    } else {
        // assume there is no footer
        if (await driver.isKeyboardShown()) {
            if (driver.isIOS) {
                // assume that keyboard is a footer
                viewportFooterRect = await driver.getElementRect(await $('//XCUIElementTypeKeyboard').elementId)
            }
            else {
                // it's always possible to hide keyboard on Android
                viewportFooterRect = { x: 0, y: screenSize.height - navBarHeight, width: 0, height: 0 }
            }
        }

    }
    debugLog('elementViewportVerticalPosition: viewport header:', viewportHeaderRect)
    debugLog('elementViewportVerticalPosition: viewport footer:', viewportFooterRect)
    const viewportTop = viewportHeaderRect.y + viewportHeaderRect.height
    const viewportBottom = viewportFooterRect.y
    debugLog('elementViewportVerticalPosition: viewport top:', viewportTop)
    debugLog('elementViewportVerticalPosition: viewport bottom:', viewportBottom)
    const elementRect = await driver.getElementRect(element.elementId)
    debugLog('elementViewportVerticalPosition: element rect:', elementRect)
    const pixelsToTop = elementRect.y - viewportTop
    const pixelsToBottom = viewportBottom - (elementRect.y + elementRect.height)
    return {
        pixelsToTop: pixelsToTop,
        pixelsToBottom: pixelsToBottom
    }
}

/**
 * Performs scroll down or up until element is in viewport (between provided header and footer elements)
 * This is very useful in case when you have scrollable list and element exists, but not all attributes are correct until it's in viewport
 * @param {WebdriverIO.Element} element - element to be visible in viewport
 * @param {string} viewportHeaderLocator - locator for top element, if null it means that viewport is not limited from top
 * @param {string} viewportFooterLocator - locator for bottom element, if null it means that viewport is not limited from bottom with any element but keyboard
 * @param {number} scrollAttemptsLimit - set limit of scroll attempts, 5 by default
 */
async function scrollUntilElementInViewport (element, viewportHeaderLocator, viewportFooterLocator, scrollAttemptsLimit = 5){

    if (await driver.isKeyboardShown()) {
        try {
            await driver.hideKeyboard()
        } catch (error) {
            debugLog('scrollUntilElementInViewport:', 'Unable to hide keyboard')
        }
    }
    for (let i = 0; i < scrollAttemptsLimit; i++) {
        const verticalPosition = await elementViewportVerticalPosition(element, viewportHeaderLocator, viewportFooterLocator)
        if (verticalPosition.pixelsToBottom <= 0) {
            debugLog('scrollUntilElementInViewport:', `${element.elementId} is not fully on screen, scrolling down`)
            await scrollDown()
        } else if (verticalPosition.pixelsToTop <= 0) {
            debugLog('scrollUntilElementInViewport:', `${element.elementId} is not fully on screen, scrolling up`)
            await scrollUp()
        }
    }
}

/**
 * Checks if element can be found on screen using given locator
 * @param {string} locator - locator for element to find
 * @returns {Promise<boolean>}
 */
async function isElementPresent (locator) {
    const element = await $(locator)
    return !element.error
}

/**
 * Performs tap of left side of element. Can be useful in case if only left part of element is actually clickable
 * @param {string} locator - locator for element to tap
 */
async function clickLeftSideOfElement(locator) {
    const element = await $(locator)
    // Get the size and location of the element
    const size = await element.getSize()
    debugLog('clickLeftSideOfElement: Element size:', JSON.stringify(size))
    const location = await element.getLocation()
    debugLog('clickLeftSideOfElement: Element location:', JSON.stringify(location))
    const x = location.x + size.width * 0.1
    const y = location.y + size.height / 2
    await driver.execute('mobile: tap', { x: x, y: y })
}

/**
 * Performs tap of left down area of screen. Can be useful in cases if you need to click this specific area for some reason
 */
async function clickLeftDownScreenArea() {
    const screenSize = await driver.getWindowSize()
    debugLog('Screen size:', JSON.stringify(screenSize))
    const x = screenSize.width * 0.05
    const y = screenSize.height - (screenSize.height * 0.05)
    await driver.execute('mobile: tap', { x: x, y: y})
}

export  { swipeBack, scrollDown, scrollDownUntilElementPresent, scrollUntilElementInViewport, isElementPresent, clickLeftSideOfElement, clickLeftDownScreenArea, elementViewportVerticalPosition }