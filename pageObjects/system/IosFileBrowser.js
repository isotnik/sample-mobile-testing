class IosFileBrowser {
    constructor() {
        this.locators = {
            fileItem: function (fileName) {
                const extension = fileName.split('.').slice(-1)
                const name = fileName.replace('.' + extension, '')
                return `//XCUIElementTypeCollectionView[@name="File View"]//XCUIElementTypeCell[@name="${name}, ${extension}"]`
            },
            currentFolderName: '//XCUIElementTypeNavigationBar[@name="FullDocumentManagerViewControllerNavigationBar"]/XCUIElementTypeButton[@name="DOC.itemCollectionMenuButton.Icons"]/preceding-sibling::XCUIElementTypeButton[1]',
            openButton: '//XCUIElementTypeNavigationBar[@name="FullDocumentManagerViewControllerNavigationBar"]/XCUIElementTypeButton[@name="Open"]'
        }
    }

    get openButton () {
        return $(this.locators.openButton)
    }

    async fileItem (fileName) {
        return await $(this.locators.fileItem(fileName))
    }

    async getCurrentFolderName () {
        const folderNameElement = await $(this.locators.currentFolderName);
        return (await folderNameElement.getAttribute('name')).split(',')[0]
    }
}

export default new IosFileBrowser()