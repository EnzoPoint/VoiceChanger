let sassTransformer = require("react-native-sass-transformer")
let svgTransformer = require("react-native-svg-transformer")

module.exports.transform = function({ src, filename, options }) {
    if(filename.endsWith(".scss")) return sassTransformer.transform({ src, filename, options })
    else return svgTransformer.transform({ src, filename, options })
}