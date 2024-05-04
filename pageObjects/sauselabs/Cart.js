import {
    isElementPresent,
    scrollDown,
    scrollDownUntilElementPresent,
    scrollDownUntilElementInViewport
} from '../../helpers/utils/uiUtils.js'

class Cart {
    constructor () {
        this.locator = {
            cartNavButton: driver.isIOS ? '~Cart-tab-item' : 'id=com.saucelabs.mydemoapp.android:id/cartIV',
            cartItemsNumber: driver.isIOS ? '//XCUIElementTypeImage[@name="GrayRoundView Icons"]/following-sibling::XCUIElementTypeStaticText' : 'id=com.saucelabs.mydemoapp.android:id/cartTV',
            cartItem: driver.isIOS ? '//XCUIElementTypeTable/XCUIElementTypeCell/XCUIElementTypeButton[@name="Remove Item"]/..'
                : '//androidx.recyclerview.widget.RecyclerView[@content-desc="Displays list of selected products"]/android.view.ViewGroup',
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
            viewportHeader: driver.isIOS ? '~My Cart' : '',
            viewportFooter: driver.isIOS ? '//XCUIElementTypeButton[@name="ProceedToCheckout"]/..' : ''
        }
    }

    cartNavButton = async function () {
        return await $(this.locator.cartNavButton)
    }

    getCartItemsNumber = async function () {
        const cartItemsNumberElement = await $(this.locator.cartItemsNumber)
        return parseInt(await cartItemsNumberElement.getText())
    }

    getAllCartItems = async function () {
        const cartItems = []
        const elementsIds = []
        if (driver.isIOS) {
            const cartItemsElements = await $$(this.locator.cartItem)
            for (let cartItemElement of cartItemsElements) {
                await scrollDownUntilElementInViewport(cartItemElement, this.locator.viewportHeader, this.locator.viewportFooter)
                const title = await (await cartItemElement.$(this.locator.cartItemTitle)).getText()
                const price = parseFloat((await (await cartItemElement.$(this.locator.cartItemPrice)).getText()).replace('$ ', ''))
                const color = await (await cartItemElement.$(this.locator.cartItemColor)).getText()
                const quantity = parseInt(await (await cartItemElement.$(this.locator.cartItemQuantity)).getText())
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
                const cartElementLocator = this.locator.cartItem
                await driver.waitUntil(async function () {
                    return await isElementPresent(cartElementLocator)
                }, { timout: 2000 })
                const cartItemsElements = await $$(this.locator.cartItem)
                const cartFooterPresent = await isElementPresent(this.locator.cartFooter)
                for (const cartItemElement of cartItemsElements) {
                    if (!elementsIds.includes(cartItemElement.elementId)) {
                        const title = await (await scrollDownUntilElementPresent(this.locator.cartItemTitle, cartItemElement)).getText()
                        const price = parseFloat((await (await scrollDownUntilElementPresent(this.locator.cartItemPrice, cartItemElement)).getText()).replace('$ ', ''))
                        // const color = await (await cartItemElement.$(this.locator.cartItemColor)).getText() // todo: implement color parsing
                        const quantity = parseInt(await (await scrollDownUntilElementPresent(this.locator.cartItemQuantity, cartItemElement)).getText())
                        cartItems.push(
                            {
                                title: title,
                                price: price,
                                // color: color,
                                quantity: quantity
                            }
                        )
                        elementsIds.push(cartItemElement.elementId)
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
        return parseInt(await (await $(this.locator.cartTotalItems).getText()))
    }

    getTotalPrice = async function () {
        return parseFloat((await (await $(this.locator.cartTotalPrice).getText())).replace('$', ''))
    }

    get proceedToCheckoutButton  () {
        return $(this.locator.proceedToCheckoutButton)
    }
}

export default new Cart()
