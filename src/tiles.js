'use strict'

const asyncFs = require('./asyncFs')

const read = async (fd, tileRecord) => {
    const buffer = Buffer.alloc(tileRecord.TileSize)
    await asyncFs.read(fd, buffer, 0, tileRecord.TileSize, tileRecord.TileOffset)
    return buffer
}

module.exports = read