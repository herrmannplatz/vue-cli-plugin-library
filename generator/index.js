const fs = require('fs')

module.exports = (api, options, rootOptions) => {
  const pkgPath = api.resolve('./package.json')
  const pkg = require(pkgPath)
  const name = pkg.name || 'my-component-library'
  const importName = 'MyComponentLibrary'

  // Modify package.json
  api.extendPackage({
    'main': `dist/${name}.umd.js`,
    'browser': `dist/${name}.common.js`,
    'unpkg': `dist/${name}.umd.min.js`,
    'jsDelivr': `dist/${name}.umd.min.js`,
    'files': ['dist', 'src'],
    'peerDependencies': {
      'vue': '^2.5.22'
    },
    'scripts': {
      'serve': 'vue-cli-service serve ./demo/main',
      'build:demo': 'vue-cli-service build ./demo/main',
      'build': `vue-cli-service build --target lib --name ${name} src/index.js`
    }
  })

  // Use components in demo app
  api.injectImports(api.entryFile, `import ${importName} from '../src'`)

  // generate new src folder
  api.render('./template')

  api.onCreateComplete(() => {
    let contentMain = fs.readFileSync(api.entryFile, { encoding: 'utf-8' })
    contentMain = contentMain.replace(
      `import ${importName} from '../src'`,
      `import ${importName} from '../src'\nVue.use(${importName})`
    )
    fs.writeFileSync(api.entryFile, contentMain, { encoding: 'utf-8' })

    // rename original src folder to demo
    fs.renameSync('src', 'demo')

    // rename generated src folder to demo
    fs.renameSync('generated', 'src')
  })
}
