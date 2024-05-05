import { debugLog } from "./logUtils.js";

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
 * @param {WebdriverIO.Element} parentElement - parent element in case you need to look for specific element inside another element which is already present
 * @param {int} scrollAttemptsLimit - set limit of scroll attempts, 5 by default
 */
async function scrollDownUntilElementPresent (locator, parentElement, scrollAttemptsLimit) {
    const scrollAttempts = (typeof scrollAttemptsLimit === 'number') ? scrollAttemptsLimit : 5 // limit scroll attempts to avoid endless cycle
    let element
    for (let i = 0; i < scrollAttempts; i++) {
        element = parentElement  ? await parentElement.$(locator) : await $(locator)
        if (element.error) {
            debugLog(`scrollDownUntilElementPresent: Element with ${locator} locator is not on screen, scrolling down`)
            await scrollDown()
        }
        else {
            debugLog(`scrollDownUntilElementPresent: Element was found in ${i} scrolls`)
            return element
        }
    }
    return element
}

/**
 * Performs scroll down using swipe gesture
 */
async function scrollDown () {
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
 * Performs scroll down or up until element is in viewport (between provided header and footer elements)
 * This is very useful in case when you have scrollable list and element exists, but not all attributes are correct until it's in viewport
 * @param {WebdriverIO.Element} element - element to be visible in viewport
 * @param {string} viewportHeaderLocator - locator for top element, if null it means that viewport is not limited from top
 * @param {string} viewportFooterLocator - locator for bottom element, if null it means that viewport is not limited from bottom with any element but keyboard
 * @param {int} scrollAttemptsLimit - set limit of scroll attempts, 5 by default
 */
async function scrollUntilElementInViewport (element, viewportHeaderLocator, viewportFooterLocator, scrollAttemptsLimit)  {
    let viewportHeaderRect
    let viewportFooterRect

    if (!viewportHeaderLocator) {
        // assuming there is no header
        viewportHeaderRect = { x: 0, y:0, width: 0, height: 0 }
    } else {
        viewportHeaderRect = await driver.getElementRect(await $(viewportHeaderLocator).elementId)
    }

    if (!viewportFooterLocator) {
        // assuming that keyboard is viewport bottom border
        if (driver.isKeyboardShown()) {
            if (driver.isIOS) {
                // in some cases it's not possible to hide keyboard on iOS
                viewportFooterRect = await driver.getElementRect(await $('//XCUIElementTypeKeyboard').elementId)
            }
            else {
                // hide keyboard and assume there is no footer
                await driver.hideKeyboard()
                viewportFooterRect = { x: 0, y:0, width: 0, height: 0 }
            }
        }
    } else {
        viewportFooterRect = await driver.getElementRect(await $(viewportFooterLocator).elementId)
    }

    const scrollAttempts = (typeof scrollAttemptsLimit === 'number') ? scrollAttemptsLimit : 5
    for (let i = 0; i < scrollAttempts; i++) {
        const elementRect = await driver.getElementRect(element.elementId)
        debugLog('scrollUntilElementInViewport: element id is:', element.elementId)
        debugLog('scrollUntilElementInViewport: element rect is:', elementRect)
        debugLog('scrollUntilElementInViewport: header rect is:', viewportHeaderRect)
        debugLog('scrollUntilElementInViewport: footer rect is:', viewportFooterRect)
        const needToScrollDown = (function () {
            return (elementRect.y + elementRect.height - viewportFooterRect.y) > 0
        })()
        const needToScrollUp = (function () {
            return elementRect.y < (viewportHeaderRect.y + viewportHeaderRect.height)
        })()
        debugLog('scrollUntilElementInViewport: need to scroll down:', needToScrollDown)
        debugLog('scrollUntilElementInViewport: need to scroll up:', needToScrollUp)
        if (needToScrollDown) {
            await scrollDown()
        } else if (needToScrollUp) {
            await scrollUp()
        } else {
            break
        }
    }
}

/**
 * Checks if element can be found on screen using given locator
 * @param {string} locator - locator for element to find
 * @returns {boolean}
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
    const element = await $(locator);
    // Get the size and location of the element
    const size = await element.getSize()
    debugLog('Element size:', JSON.stringify(size))
    const location = await element.getLocation()
    debugLog('Element location:', JSON.stringify(location))
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

export  { swipeBack, scrollDown, scrollDownUntilElementPresent, scrollUntilElementInViewport, isElementPresent, clickLeftSideOfElement, clickLeftDownScreenArea }