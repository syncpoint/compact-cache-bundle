'use strict'

/*

Offset	Size	Field Name	Value
0	4	Version	3
4	4	Record Count	16384
8	4	Maximum Tile Size	
12	4	Offset Byte Count	5
16	8	Slack Space	
24	8	File Size	
32	8	User Header Offset	40
40	4	User Header Size	20 + 131072
44	4	Legacy	3
48	4	Legacy	16
52	4	Legacy	16384
56	4	Legacy	5
60	4	Index Size	131072

*/

const HEADER_SIZE = 64

const asyncFs = require('./asyncFs')

const headerFromBuffer = (buffer) => {
    const bundleHeader = {
        Version: buffer.readUIntLE(0, 4),
        RecordCount: buffer.readUIntLE(4, 4),
        MaxTileSize: buffer.readUIntLE(8, 4),
        OffsetByteCount: buffer.readUIntLE(12, 4),
        SlackSpace: buffer.readUInt32LE(16, 8),
        FileSize: buffer.readUInt32LE(24, 8),
        UserHeaderOffset: buffer.readUInt32LE(32, 8),
        UserHeaderSize: buffer.readUIntLE(40, 4),
        Legacy1: buffer.readUIntLE(44, 4),
        Legacy2: buffer.readUIntLE(48, 4),
        Legacy3: buffer.readUIntLE(52, 4),
        Legacy4: buffer.readUIntLE(56, 4),
        IndexSize: buffer.readUIntLE(60, 4)
    }

    return bundleHeader
}

const header = async (fd) => {
    const header = Buffer.alloc(HEADER_SIZE)
    await asyncFs.read(fd, header, 0, HEADER_SIZE, 0)
    return headerFromBuffer(header)
}

module.exports = header