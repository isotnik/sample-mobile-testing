class Files {
    constructor() {
        this.locators = {
            storagePermissionsPopupText: driver.isIOS ? '' : '//androidx.appcompat.widget.LinearLayoutCompat[@resource-id="com.nextcloud.client:id/parentPanel"]//android.widget.TextView[@resource-id="android:id/message"]',
            storagePermissionsCancelButton: driver.isIOS ? '' : '//androidx.appcompat.widget.LinearLayoutCompat[@resource-id="com.nextcloud.client:id/parentPanel"]//android.widget.Button[@resource-id="android:id/button3"]',
            storagePermissionsFullAccessButton: driver.isIOS ? '' : '//androidx.appcompat.widget.LinearLayoutCompat[@resource-id="com.nextcloud.client:id/parentPanel"]//android.widget.Button[@resource-id="android:id/button1"]',
            uploadButton: driver.isIOS ? '//XCUIElementTypeButton[@name="Add and upload"]' : '~Add or upload',
            uploadFilesButton: driver.isIOS ? '~Upload file' : '//android.widget.LinearLayout[@resource-id="com.nextcloud.client:id/menu_upload_files"]',
            createFolderButton: driver.isIOS ? '~Create folder' : '//android.widget.LinearLayout[@resource-id="com.nextcloud.client:id/menu_mkdir"]',
            createFolderPopupInput: driver.isIOS ? '//XCUIElementTypeAlert[@name="Create folder"]//XCUIElementTypeTextField'
                : '//android.widget.FrameLayout[@resource-id="android:id/content"]//android.widget.EditText[@resource-id="com.nextcloud.client:id/user_input"]',
            createFolderPopupConfirmButton: driver.isIOS ? '//XCUIElementTypeAlert[@name="Create folder"]//XCUIElementTypeButton[@name="Save"]'
                : '//android.widget.FrameLayout[@resource-id="android:id/content"]//android.widget.Button[@resource-id="android:id/button1"]',
            createFolderPopupDismissButton: driver.isIOS ? '//XCUIElementTypeAlert[@name="Create folder"]//XCUIElementTypeButton[@name="Cancel"]'
                : '//android.widget.FrameLayout[@resource-id="android:id/content"]//android.widget.Button[@resource-id="android:id/button2"]',
            fileItemName: function (fileName) {
                return driver.isIOS ? `//XCUIElementTypeStaticText[@name="${fileName}"]` : `//android.widget.TextView[@resource-id="com.nextcloud.client:id/Filename" and @text="${fileName}"]`
            },
            fileItemMenuButton: function (fileName) {
                return driver.isIOS ? `//XCUIElementTypeStaticText[@name="${fileName}"]/../XCUIElementTypeButton[2]` : `//android.widget.TextView[@resource-id="com.nextcloud.client:id/Filename" and @text="${fileName}"]/../..//android.widget.ImageView[@content-desc="More menu"]`
            },
            fileItemMenuDelete: driver.isIOS ? '//XCUIElementTypeImage[@name="trash"]/..'
                : '//android.widget.LinearLayout[@resource-id="com.nextcloud.client:id/menu_upload_files"]//android.widget.TextView[@resource-id="com.nextcloud.client:id/text" and @text="Delete"]/../..',
            confirmDialogMessage: driver.isIOS ? '//XCUIElementTypeAlert//XCUIElementTypeScrollView[1]//XCUIElementTypeStaticText[2]' : '//android.widget.TextView[@resource-id="android:id/message"]',
            confirmDialogDeleteButton: driver.isIOS ? '//XCUIElementTypeAlert//XCUIElementTypeButton[@name="Yes"]' : '//android.widget.Button[@resource-id="android:id/button1"]',
            backButton: driver.isIOS ? '//XCUIElementTypeNavigationBar/XCUIElementTypeButton[1]' : '~Navigate up',
            folderName: driver.isIOS ? '//XCUIElementTypeNavigationBar/XCUIElementTypeStaticText' : '//android.view.ViewGroup[@resource-id="com.nextcloud.client:id/toolbar"]/android.widget.TextView',
        }
    }

    get storagePermissionsPopupText () {
        return $(this.locators.storagePermissionsPopupText)
    }

    get storagePermissionsCancelButton () {
        return $(this.locators.storagePermissionsCancelButton)
    }

    get storagePermissionsFullAccessButton () {
        return $(this.locators.storagePermissionsFullAccessButton)
    }

    get uploadButton () {
        return $(this.locators.uploadButton)
    }

    get uploadFilesButton () {
        return $(this.locators.uploadFilesButton)
    }

    get createFolderButton () {
        return $(this.locators.createFolderButton)
    }

    get createFolderPopupInput () {
        return $(this.locators.createFolderPopupInput)
    }

    get createFolderPopupConfirmButton () {
        return $(this.locators.createFolderPopupConfirmButton)
    }

    get createFolderPopupDismissButton () {
        return $(this.locators.createFolderPopupDismissButton)
    }

    async fileItemName (fileName) {
        return $(this.locators.fileItemName(fileName))
    }

    async fileItemMenuButton (fileName) {
        return $(this.locators.fileItemMenuButton(fileName))
    }

    get fileItemMenuDelete () {
        return $(this.locators.fileItemMenuDelete)
    }

    get confirmDialogMessage () {
        return $(this.locators.confirmDialogMessage)
    }

    get confirmDialogDeleteButton () {
        return $(this.locators.confirmDialogDeleteButton)
    }

    get backButton() {
        return $(this.locators.backButton)
    }

    get folderName() {
        return $(this.locators.folderName)
    }

}

export default new Files()