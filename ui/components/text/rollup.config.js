import typescript from '@rollup/plugin-typescript';
import styles from "rollup-plugin-styles";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.tsx',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    peerDepsExternal(),
    commonjs(),
    typescript({
      cacheDir: 'node_modules/.cache/rollup.typescript',
      declaration: true,
      declarationDir: 'dist',
      outputToFilesystem: true,
    }),
    styles({
      mode: 'inject',
      modules: true,
    }),
    nodeResolve(),
  ],
  cache: false,
};
