module.exports = {
    plugins: [
        require('autoprefixer'),
        require('cssnano')({
            preset: ['default', {
                discardComments: {
                    removeAll: true,
                },
                normalizeWhitespace: true,
                minifyFontValues: true,
                minifyGradients: true,
                colormin: true,
                reduceIdents: true,
                mergeRules: true,
                mergeLonghand: true,
                minifySelectors: true,
                minifyParams: true,
                discardDuplicates: true,
                discardOverridden: true,
                reduceTransforms: true,
                calc: {
                    precision: 2
                },
                zindex: false,
                svgo: {
                    plugins: [
                        { removeViewBox: false },
                        { cleanupIDs: false }
                    ]
                }
            }]
        })
    ]
} 