class Main {
    constructor() {
        this.locators = {
            storagePermissionsPopupText: driver.isIOS ? '' : '//androidx.appcompat.widget.LinearLayoutCompat[@resource-id="com.nextcloud.client:id/parentPanel"]//android.widget.TextView[@resource-id="android:id/message"]',
            storagePermissionsCancelButton: driver.isIOS ? '' : '//androidx.appcompat.widget.LinearLayoutCompat[@resource-id="com.nextcloud.client:id/parentPanel"]//android.widget.Button[@resource-id="android:id/button3"]',
            uploadButton: driver.isIOS ? '//XCUIElementTypeButton[@name="Add and upload"]' : '~Add or upload'
        }
    }

    get storagePermissionsPopupText () {
        return $(this.locators.storagePermissionsPopupText)
    }

    get storagePermissionsCancelButton () {
        return $(this.locators.storagePermissionsCancelButton)
    }

    get uploadButton () {
        return $(this.locators.uploadButton)
    }
}

export default new Main()