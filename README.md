# @syncpoint/compact-cache-bundle

ESRI's compact cache V2 bundle files contain pre-rendered raster or vector tiles. This nodejs module provides read-only access to a bundle file in order to read the header, the tile index and the tiles.

ESRI provides a [technical description of the compact cache bundle file V2 structure](https://github.com/Esri/raster-tiles-compactcache/blob/master/CompactCacheV2.md) in their github repository. In contrast to the statement in the description the tiles stored in the bundle are not limited to raster tiles. 

ESRI's Vector Tile Package (VTPK) contain bundle files as well. The tiles within the bundle files comply with [Mapbox's Vector Tile Specification v2.0](https://docs.mapbox.com/vector-tiles/specification).

## Installation
```shell

npm install @syncpoint/compact-cache-bundle --save

```

## Usage

Please download any of the bundle files that are part of the [ESRI sample compact cache](https://github.com/Esri/raster-tiles-compactcache/tree/master/sample_cache/_alllayers).

The example below will extract the tiles and write them to the file system. The JPEG file format is hard-coded and should be derived from the file ```conf.xml```:

```xml
    <TileImageInfo xsi:type="typens:TileImageInfo">
        <CacheTileFormat>JPEG</CacheTileFormat>
        <CompressionQuality>75</CompressionQuality>
        <Antialiasing>false</Antialiasing>
    </TileImageInfo>
```

```javascript
'use strict'

const bundle = require('../compact-cache-bundle')

const file = 'PATH_TO/ESRI_Compact_Cache/R0000C0000.bundle'

/* you don't have to use it the asynchronous way */
const fs = require('fs')
const { promisify } = require('util')
const fsOpen = promisify(fs.open)
const fsClose = promisify(fs.close)
const fsWrite = promisify(fs.write)

    ; (async () => {
        let fd
        try {
            fd = await fsOpen(file, 'r')

            const bundleHeader = await bundle.header(fd)
            console.dir(bundleHeader)

            const records = await bundle.tileIndex(fd)
            console.dir(records)

            /* please read ESRI's technical specification for details */
            for (let r = 0; r < records.length; r++) {

                let tile = await bundle.tiles(fd, records[r])

                /* please check if the tiles are in JPEG format upfront */
                const fileName = `${records[r].row}-${records[r].column}.jpeg`

                let outputFd
                try {
                    outputFd = await fsOpen(fileName, 'w')
                    await fsWrite(outputFd, tile)
                    console.log(`created file ${fileName}`)
                }
                catch (error) {
                    console.dir(error)
                }
                finally {
                    await fsClose(outputFd)
                }
            }
        }
        catch (error) {
            console.dir(error)
        }
        finally {
            await fsClose(fd)
        }
    })()

```

## API
@syncpoint/compact-cache-bundle currently provides three functions to access the bundle data. All functions are __asynchronous (return a promise)__ because they need to access data in the filesystem.

### Header
```bundle.header(fileDescriptor)``` returns an object that contains all header data as [specified](https://github.com/Esri/raster-tiles-compactcache/blob/master/CompactCacheV2.md#bundle-header) in ESRI's document.

```javascript
{ Version: 3,
  RecordCount: 0,
  MaxTileSize: 131092,
  OffsetByteCount: 5,
  SlackSpace: 0,
  FileSize: 133358,
  UserHeaderOffset: 40,
  UserHeaderSize: 131092,
  Legacy1: 3,
  Legacy2: 0,
  Legacy3: 16384,
  Legacy4: 5,
  IndexSize: 131072 }
```

### Tile Index Records
```bundle.tileIndex(fileDescriptor)``` returns an array of [Tile Index Record](https://github.com/Esri/raster-tiles-compactcache/blob/master/CompactCacheV2.md#tile-index-record)s.

The array contains only records that have a ```TileSize``` greater than zero and are augmented with the tile row and column information:

```javascript
    [ { row: 0, column: 1, TileOffset: 131140, TileSize: 2218 } ]
```

### Tile
```bundle.tile(fileDescriptor, tileIndexRecord)```returns a ```Buffer``` that contains the tile data. The ```tileIndexRecord``` must be obtained by the function ```tileIndex```. 

## Dependencies
None, just plain nodejs and Javascript.

## nodejs version
Please use the current [nodejs LTS](https://nodejs.org/en/) version.

## License

Copyright (c) Syncpoint GmbH. All rights reserved.

Licensed under the [MIT](LICENSE) License.