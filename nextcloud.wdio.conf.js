import { config as conf } from './wdio.conf.js'
conf.specs = ['./tests/nextcloud/*']
export const config = { ...conf }
