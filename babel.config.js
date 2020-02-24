const pk = require('./package.json')

module.exports = {
  presets: ["@babel/preset-env", "minify"],
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
