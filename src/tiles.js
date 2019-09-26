'use strict'

const asyncFs = require('./asyncFs')

const read = async (fd, tileRecord) => {
    const buffer = Buffer.alloc(tileRecord.tileSize)
    await asyncFs.read(fd, buffer, 0, tileRecord.tileSize, tileRecord.tileOffset)
    return buffer
}

module.exports = read