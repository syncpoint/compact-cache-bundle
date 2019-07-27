'use strict'

const fs = require('fs')
const { promisify } = require("util")

const fsOpen = promisify(fs.open)
const fsClose = promisify(fs.close)
const fsRead = promisify(fs.read)
const fsWrite = promisify(fs.write)

module.exports = {
    open: fsOpen,
    close: fsClose,
    read: fsRead,
    write: fsWrite
}