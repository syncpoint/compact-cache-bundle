# @syncpoint/compact-cache-bundle

ESRI's compact cache V2 bundle files contain pre-rendered raster or vector tiles. This nodejs module provides read-only access to a bundle file in order to read the header, the tile index and the tiles.

ESRI provides a [technical description of the compact cache bundle file V2 structure](https://github.com/Esri/raster-tiles-compactcache/blob/master/CompactCacheV2.md) in their github repository. In contrast to the statement in the description the tiles stored in the bundle are not limited to raster tiles. 

ESRI's Vector Tile Package (VTPK) contain bundle files as well. The tiles within the bundle files comply with [Mapbox's Vector Tile Specification v2.0](https://docs.mapbox.com/vector-tiles/specification).

## Installation
```shell

npm install @syncpoint/compact-cache-bundle --save

```

## Usage
```javascript
'use strict'

const file = 'path/to/R0000C0000.bundle'

const bundle = require('@syncpoint/compact-cache-bundle')

/* you don't have to use it the asynchronous way */
const fs = require('fs')
const { promisify } = require('util')
const fsOpen = promisify(fs.open)
const fsClose = promisify(fs.close)

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

                /* tile is a nodejs Buffer */
                console.dir(tile)
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

## Module
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