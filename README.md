# @syncpoint/compact-cache-bundle

ESRI's compact cache V2 bundle files contain pre-rendered raster or vector tiles. This node module provides read-only access to a bundle file in order to read the header, the tile index and the tiles.

ESRI provides a [technical description of the compact cache bundle file V2 structure](https://github.com/Esri/raster-tiles-compactcache/blob/master/CompactCacheV2.md) in their github repository. In contrast to the statement in the description the tiles stored in the bundle are not limited to raster tiles. 

ESRI's Vector Tile Package (VTPK) contain bundle files as well. The tiles within the bundle files comply with [Mapbox's Vector Tile Specification v2.0](https://docs.mapbox.com/vector-tiles/specification/).

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

## License

Copyright (c) Syncpoint GmbH. All rights reserved.

Licensed under the [MIT](LICENSE) License.