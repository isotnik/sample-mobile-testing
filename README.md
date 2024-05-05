# sample-mobile-testing
This is demo project showing my current skill set in mobile test automation.
Used WebdriverIO and Appium which allows to cover both Android and iOS platforms using the same set of tests.

Currently, **Saucelabs My Demo App** ([Android](https://github.com/saucelabs/my-demo-app-android) and [iOS](https://github.com/saucelabs/my-demo-app-ios)) is used as subject for automation, it allows to show main concepts and approaches. I don't work for Saucelabs company, this is just for demo purposes since this app is open sourced and has versions for Android and iOS.

## Usage
1. Clone repo on you local machine
2. Run `npm install`
3. Use `ios_caps_example.json` and `android_caps_example.json` in order to create your own config with desired capabilities. Pay attention to emulator/simulator name, OS version and path to `My Demo App` (it has to be absolute)
4. Name them `saucelabs_ios_caps.json` and `saucelabs_ios_caps.json`. In general json with capabilities config should be named `${appName}_${platformName}_caps.json`
5. You need to spinup you Android emulator manually, `utils/scripts/runAndroidEmulator.sh` can be executed in order to run first emulator in your list of emulators. You can specify environment variable `deviceName` in order to run specific emulator.
6. In terminal execute `npm run ios:saucelabs` or `npm run android:saucelabs`
7. After test run you can see test results in terminal, also you can see html test report in `reports/html-reports`, screenshots will be included in case of failures.
8. WebdriverIO log can be found at `reports/${platformName}/wdio.log`, Appium log can be found at `reports/os/appium.log`

## Hints
You can run Appium standalone on default port by executing `npm run appium` in order to connect to your emulator/simulator using Appium Inspector or for any other purposes. Tests still can be run in usual way but invoking appium service will fail (since port is already used) which actually won't affect test run.
You can check your code style errors by executing eslint using the next command `npm run linter`
You can specify environment variables in `.env` file using `ENV_VARIABLE=value` syntax. Those variable will be injected once WebdriverIO starts.


## Project structure
### tests
`tests/${appName}` - keep tests for specific app inside its directory
### pageObjects
`pageObjects/${appName}` - keep page object for specific app inside its directory
### helpers
`helpers/utils` - utils set with common action wrappers for usage in page objects and tests
`helpers/scripts` - shell scripts