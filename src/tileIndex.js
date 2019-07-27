'use strict'

const TILE_INDEX_OFFSET = 64
const TILE_INDEX_ARRAY_SIZE = 128
const TILE_INDEX_RECORD_SIZE = 8

const asyncFs = require('./asyncFs')

const tileIndexOffset = (row, column) => TILE_INDEX_OFFSET + TILE_INDEX_RECORD_SIZE * (TILE_INDEX_ARRAY_SIZE * (row % TILE_INDEX_ARRAY_SIZE) + (column % TILE_INDEX_ARRAY_SIZE))

/*
The tile offset is stored in bits 0 to 39, while the tile size is located in bits 40 to 63. Bit 0 is the least significant bit, and both offset and size are stored in little-endian format.
*/
const tileIndexRecord = (buffer) => {
    const record = {
        TileOffset: buffer.readUIntLE(0, 5),
        TileSize: buffer.readUIntLE(5, 3)
    }
    return record
}


async function records(fd) {
    const buffer = Buffer.alloc(TILE_INDEX_RECORD_SIZE)
    const allRecords = []
    for (let row = 0; row < TILE_INDEX_ARRAY_SIZE; row++) {
        for (let column = 0; column < TILE_INDEX_ARRAY_SIZE; column++) {
            await asyncFs.read(fd, buffer, 0, TILE_INDEX_RECORD_SIZE, tileIndexOffset(row, column))
            const record = tileIndexRecord(buffer)
            if (record.TileSize !== 0) {
                allRecords.push({ ...{ row: row, column: column }, ...record })
            }
        }
    }
    return allRecords
}

module.exports = records