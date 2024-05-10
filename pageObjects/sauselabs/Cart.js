import {
    elementViewportVerticalPosition,
    isElementPresent,
    scrollDown,
    scrollDownUntilElementPresent,
    scrollUntilElementInViewport
} from '../../helpers/utils/uiUtils.js'
import {debugLog} from "../../helpers/utils/logUtils.js";

class Cart {
    constructor () {
        this.locators = {
            cartNavButton: driver.isIOS ? '~Cart-tab-item' : 'id=com.saucelabs.mydemoapp.android:id/cartIV',
            cartItemsNumber: driver.isIOS ? '//XCUIElementTypeImage[@name="GrayRoundView Icons"]/following-sibling::XCUIElementTypeStaticText' : 'id=com.saucelabs.mydemoapp.android:id/cartTV',
            cartItem: driver.isIOS ? '//XCUIElementTypeTable/XCUIElementTypeCell/XCUIElementTypeButton[@name="Remove Item"]/..'
                : '//androidx.recyclerview.widget.RecyclerView[@resource-id="com.saucelabs.mydemoapp.android:id/productRV"]/android.view.ViewGroup',
            cartFooter: driver.isIOS ? '//XCUIElementTypeTable//XCUIElementTypeStaticText[contains(@name, "Sauce Labs. All Rights Reserved")]'
                : '//android.widget.LinearLayout[@resource-id="com.saucelabs.mydemoapp.android:id/socialLL"]',
            cartItemTitle: driver.isIOS ? './/XCUIElementTypeButton[@name="AddPlus Icons"]/following-sibling::XCUIElementTypeStaticText[1]'
                : './/android.widget.TextView[@resource-id="com.saucelabs.mydemoapp.android:id/titleTV"]',
            cartItemPrice: driver.isIOS ? './/XCUIElementTypeButton[@name="AddPlus Icons"]/following-sibling::XCUIElementTypeStaticText[2]'
                : './/android.widget.TextView[@resource-id="com.saucelabs.mydemoapp.android:id/priceTV"]',
            cartItemColor: driver.isIOS ? './/XCUIElementTypeStaticText[@name="Color:"]/following-sibling::XCUIElementTypeStaticText[1]'
                : './/android.widget.ImageView[@resource-id="com.saucelabs.mydemoapp.android:id/colorIV"]',
            cartItemQuantity: driver.isIOS ? './/XCUIElementTypeStaticText[@name="Color:"]/following-sibling::XCUIElementTypeStaticText[2]'
                : './/android.widget.TextView[@resource-id="com.saucelabs.mydemoapp.android:id/noTV"]',
            cartTotalItems: driver.isIOS ? '//XCUIElementTypeStaticText[@name="Total:"]/following-sibling::XCUIElementTypeStaticText[1]'
                : '//android.widget.TextView[@resource-id="com.saucelabs.mydemoapp.android:id/itemsTV"]',
            cartTotalPrice: driver.isIOS ? '//XCUIElementTypeStaticText[@name="Total:"]/following-sibling::XCUIElementTypeStaticText[2]'
                : '//android.widget.TextView[@resource-id="com.saucelabs.mydemoapp.android:id/totalPriceTV"]',
            proceedToCheckoutButton: driver.isIOS ? '//XCUIElementTypeButton[@name="ProceedToCheckout"]'
                : '~Confirms products for checkout',
            viewportHeader: driver.isIOS ? '~My Cart' : '//android.view.ViewGroup[@resource-id="com.saucelabs.mydemoapp.android:id/header"]',
            viewportFooter: driver.isIOS ? '//XCUIElementTypeButton[@name="ProceedToCheckout"]/..' : '//android.widget.LinearLayout[@resource-id="com.saucelabs.mydemoapp.android:id/bottomLL"]'
        }
    }

    cartNavButton = async function () {
        return await $(this.locators.cartNavButton)
    }

    getCartItemsNumber = async function () {
        const cartItemsNumberElement = await $(this.locators.cartItemsNumber)
        return parseInt(await cartItemsNumberElement.getText())
    }

    /**
     * Retrieves all cart items from the shopping cart page.
     * This function handles both iOS and Android platforms differently.
     * On iOS, it scrolls through each cart item element until it's visible and extracts details.
     * On Android, due to elements only being present when visible on screen, it scrolls and fetches repeatedly
     * until it detects the end of the cart items or reaches a maximum iteration count.
     * @returns {Promise<Array>} A promise that resolves to an array of objects, each representing a cart item.
     * Each object contains the title, price, and quantity of the item. On iOS, it additionally includes the color of the item.
     */
    getAllCartItems = async function () {
        const cartItems = []
        const elementsIds = []
        if (driver.isIOS) {
            const cartItemsElements = await $$(this.locators.cartItem)
            for (let cartItemElement of cartItemsElements) {
                await scrollUntilElementInViewport(cartItemElement, this.locators.viewportHeader, this.locators.viewportFooter)
                const title = await (await cartItemElement.$(this.locators.cartItemTitle)).getText()
                const price = parseFloat((await (await cartItemElement.$(this.locators.cartItemPrice)).getText()).replace('$ ', ''))
                const color = await (await cartItemElement.$(this.locators.cartItemColor)).getText()
                const quantity = parseInt(await (await cartItemElement.$(this.locators.cartItemQuantity)).getText())
                cartItems.push(
                    {
                        title: title,
                        price: price,
                        color: color,
                        quantity: quantity
                    }
                )
            }
        } else { // on android only elements shown on screen are present in tree, so if element footer is shown - it means end of cart reached
            for (let i = 0; i < 50; i++) { // limit number of scrolls to avoid endless cycle
                const cartElementLocator = this.locators.cartItem
                await driver.waitUntil(async function () {
                    return await isElementPresent(cartElementLocator)
                }, { timout: 2000 })
                const cartItemsElements = await $$(cartElementLocator)
                const cartItemsElementsIds = []
                for (const element of cartItemsElements) {
                    cartItemsElementsIds.push(element.elementId)
                }
                debugLog(`Cart elements for scroll number ${i}: ${JSON.stringify(cartItemsElementsIds)}`)
                const cartFooterPresent = await isElementPresent(this.locators.cartFooter)
                for (const cartItemElement of cartItemsElements) {
                    const currentElementPixelsToTop = (await elementViewportVerticalPosition(cartItemElement, this.locators.viewportHeader, this.locators.viewportFooter)).pixelsToTop
                    debugLog(`Scroll number ${i}, element id: ${cartItemElement.elementId}, pixels to top: ${currentElementPixelsToTop}`)
                    if (await currentElementPixelsToTop <= 0) {
                        debugLog(`Skipping cart item element ${cartItemElement.elementId}, it was already seen`)
                    } else {
                        const title = await (await scrollDownUntilElementPresent(this.locators.cartItemTitle, cartItemElement)).getText()
                        const price = parseFloat((await (await scrollDownUntilElementPresent(this.locators.cartItemPrice, cartItemElement)).getText()).replace('$ ', ''))
                        // const color = await (await cartItemElement.$(this.locators.cartItemColor)).getText() // todo: implement color parsing
                        const quantity = parseInt(await (await scrollDownUntilElementPresent(this.locators.cartItemQuantity, cartItemElement)).getText())
                        debugLog('Current cart item:', title, price, quantity)
                        cartItems.push(
                            {
                                title: title,
                                price: price,
                                quantity: quantity
                            }
                        )
                    }

                }
                if (cartFooterPresent) {
                    break
                } else {
                    await scrollDown()
                }
            }
        }
        return cartItems
    }

    getTotalItemsNumber = async function () {
        return parseInt(await (await $(this.locators.cartTotalItems).getText()))
    }

    getTotalPrice = async function () {
        return parseFloat((await (await $(this.locators.cartTotalPrice).getText())).replace('$', ''))
    }

    get proceedToCheckoutButton  () {
        return $(this.locators.proceedToCheckoutButton)
    }
}

export default new Cart()
