import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { removeSync, appendFile } from 'fs-extra'
import solidPlugin from './plugin/vite-plugin-solid'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  plugins: [solidPlugin({
    solid: {
      moduleName: '@tarojs/plugin-framework-solid/dist/reconciler',
      generate: 'universal',
      uniqueTransform: true,
    }
  }), dts({
    rollupTypes: true,
    copyDtsFiles: false,
    afterBuild: () => {
      removeSync('./dist/types/icons-solid.js')
      appendFile('./dist/types/index.d.ts', 'export declare class IconFontConfig { [key: string]:any }')
    }
  })],
  build: {
    outDir: 'dist/types',
    lib: {
      entry: './src/buildEntry/lib-new-dts.ts',
      formats: ['es'],
    },
  }
})
