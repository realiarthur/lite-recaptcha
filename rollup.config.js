import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const config = {
  input: 'src/index.js',
  external: Object.keys(pkg.peerDependencies || {}),
  output: {
    format: 'umd',
    name: 'WCRecaptcha',
  },
  plugins: [
    nodeResolve(),
    babel({
      exclude: '**/node_modules/**',
      runtimeHelpers: true
    }),
    commonjs(),
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  ]
}

export default config