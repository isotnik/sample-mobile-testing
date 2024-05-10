#!/bin/bash
if [[ -z "${ANDROID_HOME}" ]]
then
  echo "ANDROID_HOME is not defined, set it before running"
  exit 1
else
  cd "${ANDROID_HOME}/emulator"
  # Get the list of available emulators, filtering out possible INFO output
  EMULATOR_NAME=($(./emulator -list-avds | grep -v '|'))
  echo "Found next emulators:"
  echo "${EMULATOR_NAME}"
  # Run first emulator from the list in case if deviceName wasn't already set
  [[ -z $DEVICE_NAME ]] && DEVICE_NAME="${EMULATOR_NAME[0]}"
  ./emulator -avd "${DEVICE_NAME}" -no-snapshot -no-audio
fi