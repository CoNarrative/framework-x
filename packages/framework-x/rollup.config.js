import typescript from '@rollup/plugin-typescript'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'

import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    typescript(),
    // external(),
    // postcss({
    //   modules: true
    // }),
    // url(),
    // babel({
    //   include: "src/*.(js|jsx)",
    //   exclude: 'node_modules/**'
    // }),
    // resolve(),
    // commonjs()
  ]
}
