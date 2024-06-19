import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import fse from 'fs-extra'
import path from 'path'
import config from './package.json'

const banner = `/*!
* ${config.name} v${config.version} ${new Date()}
* (c) 2023 @jdf2e.
* Released under the MIT License.
*/`

const { resolve } = path

let fileStr = `@import "@/styles/variables.scss";`
const projectID = process.env.VITE_APP_PROJECT_ID
if (projectID) {
  fileStr = `@import '@/styles/variables-${projectID}.scss';`
}
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
  },
  plugins: [
    dts({
      outDir: 'dist/types',
      clearPureImport: false,
      exclude: [
        'node_modules/**',
        'src/sites/**',
        'src/**/demo.tsx',
        'src/**/demo.taro.tsx',
        'src/**/*.spec.tsx',
      ],
      beforeWriteFile(filePath, content) {
        return { filePath: filePath.replace('src/', ''), content }
      },
      // afterBuild: () => {
      //   fse
      //     .readFile('./dist/types/packages/nutui.react.build.d.ts', 'utf-8')
      //     .then((data: string) => {
      //       fse.remove('./dist/types/packages/nutui.react.build.d.ts')
      //       fse.outputFile(
      //         './dist/types/index.d.ts',
      //         `${data.replace(/\.\.\//g, './')}`
      //       )
      //     })
      // },
    }),
  ],
  build: {
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: ['solid-js'],
      output: [
        {
          banner,
          format: 'es',
          entryFileNames: 'nutui.solid.es.js',
        },
        {
          banner,
          name: 'nutui.solid',
          format: 'umd',
          entryFileNames: 'nutui.solid.umd.js',
        },
      ],
    },
    lib: {
      entry: '',
    },
  },
})