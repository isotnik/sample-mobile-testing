import { readJson } from "../../helpers/utils/dataUtils.js"
const productsData = readJson('./testData/sauceLabsProducts.json')
const loginData = readJson('./testData/saucelabsDummyLogins.json')
const shippingAddressData = readJson('./testData/sauceLabsCheckoutData.json')
const paymentData = readJson('./testData/sauceLabsPayment.json')
import productsPage from '../../pageObjects/sauselabs/Producs.js'
import productDetail from '../../pageObjects/sauselabs/ProductDetail.js'
import cartPage from '../../pageObjects/sauselabs/Cart.js'
import loginPage from '../../pageObjects/sauselabs/Login.js'
import shippingAddressPage from '../../pageObjects/sauselabs/ShippingAddress.js'
import checkoutPage from '../../pageObjects/sauselabs/Checkout.js'
import reviewOrderPage from '../../pageObjects/sauselabs/ReviewOrder.js'
import checkoutCompletePage from '../../pageObjects/sauselabs/CheckoutComplete.js'
import { compareObjectArrays } from "../../helpers/utils/testUtils.js"

describe ('Products E2E - happy path', async function () {
    let cartCount = 0
    const  cartTotalExpected = (function () {
        let total = 0.0
        productsData.forEach(product => {
            total += product.price
        })
        return total
    })()

    productsData.forEach(productDataItem => {
        it (`Check product detail: ${productDataItem.title} and add to cart`, async function () {
            const currentProductCard = await productsPage.productCard(productDataItem.title)
            expect (await productsPage.getTitle()).toBe(productDataItem.title)
            expect (await productsPage.getPrice()).toBe(productDataItem.price)
            await currentProductCard.click()
            await expect(await (await productDetail.productTitle(productDataItem.title))).toHaveText(productDataItem.title)
            await expect(await productDetail.productPrice).toHaveText(`$ ${productDataItem.price}`)
            await (await productDetail.addToCartButton).click()
            cartCount++
            await expect (await cartPage.getCartItemsNumber()).toBe(cartCount)
            await productDetail.goBack()
        })
    })

    it ('Check cart', async function () {
        await (await cartPage.cartNavButton()).click()
        await expect (await cartPage.getTotalItemsNumber()).toBe(productsData.length)
        await expect (await cartPage.getTotalPrice()).toBe(cartTotalExpected)
        const currentCartItems = await cartPage.getAllCartItems()
        console.log('Cart items: ' + JSON.stringify(currentCartItems))
        compareObjectArrays(currentCartItems, productsData)
        await cartPage.proceedToCheckoutButton.click()
    })

    it ('Login as existing user', async function () {
        await loginPage.usernameInput.addValue(loginData[0].username)
        await loginPage.passwordInput.addValue(loginData[0].password)
        // dirty hack in order to hide software keyboard, works only in combination with "appium:connectHardwareKeyboard": true
        if (driver.isIOS) {
            await loginPage.usernameInput.click()
        }
        await loginPage.loginButton.click()
        await expect(shippingAddressPage.fullNameInput).toBePresent()
    })

    it ('Set shipping address', async function () {
        // dirty hack in order to hide software keyboard, works only in combination with "appium:connectHardwareKeyboard": true
        const clickFirstField = async function () {
            if (driver.isIOS) {
                await shippingAddressPage.fullNameInput.click()
            }
        }
        await shippingAddressPage.fullNameInput.addValue(shippingAddressData.fullName)
        await shippingAddressPage.addressLine1Input.addValue(shippingAddressData.address1)
        await clickFirstField()
        await shippingAddressPage.addressLine2Input.addValue(shippingAddressData.address2)
        await clickFirstField()
        await shippingAddressPage.cityInput.addValue(shippingAddressData.city)
        await clickFirstField()
        await shippingAddressPage.stateInput.addValue(shippingAddressData.state)
        await clickFirstField()
        await shippingAddressPage.zipCodeInput.addValue(shippingAddressData.zipCode)
        await clickFirstField()
        await shippingAddressPage.countryInput.addValue(shippingAddressData.country)
        await clickFirstField()
        await shippingAddressPage.toPaymentButton.click()
        await expect(checkoutPage.cardNumberInput).toBePresent()
    })

    it ('Set payment info', async function () {
        // dirty hack in order to hide software keyboard, works only in combination with "appium:connectHardwareKeyboard": true
        const clickFirstField = async function () {
            if (driver.isIOS) {
                await checkoutPage.fullNameInput.click()
            }
        }
        await checkoutPage.fullNameInput.addValue(paymentData.fullName)
        await checkoutPage.cardNumberInput.addValue(paymentData.cardNumber)
        await clickFirstField()
        await checkoutPage.expirationDateInput.addValue(paymentData.expirationDate)
        await clickFirstField()
        await checkoutPage.securityCodeInput.addValue(paymentData.securityCode)
        await clickFirstField()
        await checkoutPage.reviewOrderButton.click()
        await expect(reviewOrderPage.placeOrderButton).toBePresent()
    })

    it ('Finish order', async function (){
        await reviewOrderPage.placeOrderButton.click()
        await expect(checkoutCompletePage.continueShoppingButton).toBePresent()
    })
})
