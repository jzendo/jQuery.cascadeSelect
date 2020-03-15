const pk = require('./package.json')

let presets

if (process.env.NODE_ENV === 'test') {
  presets = ["@babel/preset-env"]
} else {
  presets = ["@babel/preset-env", "minify"]
}

module.exports = {
  presets,
  comments: true,
  shouldPrintComment: val => /^!/.test(val),
  plugins: [
    ["@comandeer/babel-plugin-banner", {
      "banner": `\
/*!
 * jQuery CascadeSelect Plugin <by ${pk.author}>
 * - Ver: ${pk.version}, Build: ${new Date().toUTCString()}
 * - Repos: ${pk.repository}
 */
`
    }]
  ]
}
