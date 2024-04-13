const CopyPlugin = require('copy-webpack-plugin')

module.exports = function overrides(config, env){
  
  // Add Copy Plugin Configuration
  config.plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: 'src/assets/images',
          to: 'static/images'
        }
      ]
    })
  )

  return config
}