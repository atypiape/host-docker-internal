import { defineConfig } from 'vite';
import path from 'node:path';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    sourcemap: true,
    target: 'node16', // 目标环境为 Node.js（避免引入浏览器特性）
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'DockerHost',
      formats: ['es', 'cjs'], // 生成 CJS 和 ESM 两种格式
      fileName: (format) => {
        // 输出文件名：CJS 为 *.cjs，ESM 为 *.mjs（便于区分）
        if (format === 'es') return 'index.mjs';
        if (format === 'cjs') return 'index.cjs';
        return `index.${format}.js`;
      },
    },
    minify: false,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['node:child_process', 'node:fs', 'node:os'], // 排除 Node.js 内置模块（避免打包进输出文件）
      output: {
        exports: 'named', // 为 CJS 模块添加默认导出兼容（解决 ESM -> CJS 的默认导出问题）
        interop: 'auto', // 确保 CJS 模块使用 require 语法，ESM 模块使用 import/export
      },
    },
    // 禁用浏览器相关优化（如 CSS 处理、HTML 处理等）
    assetsDir: '',
    cssCodeSplit: false,
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.build.json',
      insertTypesEntry: true,
      rollupTypes: true,
    }),
    tsconfigPaths(),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'lib'),
      '@dist': path.resolve(__dirname, 'dist'),
    },
  },
});
