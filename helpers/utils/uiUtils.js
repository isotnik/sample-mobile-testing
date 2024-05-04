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

async function scrollDownUntilElementPresent (locator, parentElement, scrollAttemptsLimit) {
    const scrollAttempts = (typeof scrollAttemptsLimit === 'number') ? scrollAttemptsLimit : 5 // limit scroll attempts to avoid endless cycle
    let element
    //console.log('screen size is: ' + JSON.stringify(await driver.getWindowSize()))
    for (let i = 0; i < scrollAttempts; i++) {
        element = parentElement  ? await parentElement.$(locator) : await $(locator)
        //console.log('element is: ' + JSON.stringify(element))
        if (element.error) {
            console.log('Element is not on screen, scrolling down')
            await scrollDown()
        }
        else {
            console.log(`element was found in ${i} scrolls`)
            //console.log('element rect is: ' + JSON.stringify(await driver.getElementRect(element.elementId)))
            return element
        }
    }
    return element
}

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

async function scrollDownUntilElementInViewport (element, viewportHeaderLocator, viewportFooterLocator, scrollAttemptsLimit)  {
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
        console.log('element id is:', element.elementId)
        console.log('element rect is:', elementRect)
        console.log('header rect is:', viewportHeaderRect)
        console.log('footer rect is:', viewportFooterRect)
        const needToScrollDown = (function () {
            return (elementRect.y + elementRect.height - viewportFooterRect.y) > 0
        })()
        const needToScrollUp = (function () {
            return elementRect.y < (viewportHeaderRect.y + viewportHeaderRect.height)
        })()
        console.log('Need to scroll down:', needToScrollDown)
        console.log('Need to scroll up:', needToScrollUp)
        if (needToScrollDown) {
            await scrollDown()
        } else if (needToScrollUp) {
            await scrollUp()
        } else {
            break
        }
    }
}

async function isElementPresent (locator) {
    const element = await $(locator)
    return !element.error
}

async function clickLeftSideOfElement(selector) {
    const element = await $(selector);
    // Get the size and location of the element
    const size = await element.getSize()
    console.log('Element size:', JSON.stringify(size))
    const location = await element.getLocation()
    console.log('Element location:', JSON.stringify(location))
    const x = location.x + size.width * 0.1
    const y = location.y + size.height / 2
    await driver.execute('mobile: tap', { x: x, y: y })
}

async function clickLeftDownScreenArea() {
    const screenSize = await driver.getWindowSize()
    console.log('Screen size:', JSON.stringify(screenSize))
    const x = screenSize.width * 0.05
    const y = screenSize.height - (screenSize.height * 0.05)
    await driver.execute('mobile: tap', { x: x, y: y})
}

export  { swipeBack, scrollDown, scrollDownUntilElementPresent, scrollDownUntilElementInViewport, isElementPresent, clickLeftSideOfElement, clickLeftDownScreenArea }