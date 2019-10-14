'use strict'

const path = require('path')

const offset = bundleFileName => {
    const bundleName = path.basename(bundleFileName, '.bundle')
    // R<rrrr>C<cccc>
    const row = bundleName.substr(1, 4).toUpperCase()
    const rowOffset = parseInt(row, 16)

    const col = bundleName.substr(6, 4).toUpperCase()
    const columnOffset = parseInt(col, 16)

    return {
        rowOffset: rowOffset,
        columnOffset: columnOffset
    }
}

module.exports = offset
