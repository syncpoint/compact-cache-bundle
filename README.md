# @syncpoint/compact-cache-bundle

ESRI's compact cache V2 bundle files contain pre-rendered raster or vector tiles. This node module provides read-only access to a bundle file in order to read the header, the tile index and the tiles.

ESRI provides a [technical description of the compact cache bundle file V2 structure](https://github.com/Esri/raster-tiles-compactcache/blob/master/CompactCacheV2.md) in their github repository. In contrast to the statement in the description the tiles stored in the bundle are not limited to raster tiles. 

ESRI's Vector Tile Package (VTPK) contain bundle files as well. The tiles within the bundle files comply with [Mapbox's Vector Tile Specification v2.0](https://docs.mapbox.com/vector-tiles/specification/).