const TypeDoc = require('typedoc')

const IN_PATH = './src'
const OUT_PATH = './test-doc'

const app = new TypeDoc.Application({
  mode: 'Modules',
  logger: 'none',
  theme: './doc-theme',
  sourcefileUrlPrefix: 'thttps://github.com/CoNarrative/framework-x/master/',
  ignoreCompilerErrors: true,
  includeDeclarations: true,
  externalPattern: 'node_modules/**',
  exclude: '**/+(*test*|node_modules)/**',
  hideGenerator: true
})

const project = app.convert(app.expandInputFiles([IN_PATH]))

if (!project) throw new Error('tsdoc could not convert project correctly')

app.generateDocs(project, OUT_PATH)

app.generateJson(project, OUT_PATH + '/documentation.json')
