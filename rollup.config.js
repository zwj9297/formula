import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import ts from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';
import analyzer from 'rollup-plugin-analyzer';

var getPath = (_path) => path.resolve(__dirname, _path);

var inputSrc = getPath('./es/index.ts');
var name = 'Formula';

// 需要导出的模块类型
export default [
  {
    input: inputSrc,
    output: [
      {
        name,
        file: getPath(pkg.module), // package.json 中 "module": "dist/index.esm.js"
        format: 'esm' // es module 形式的包， 用来import 导入， 可以tree shaking
      },
      {
        name,
        file: getPath(pkg.main), // package.json 中 "main": "dist/index.cjs.js",
        format: 'cjs' // commonjs 形式的包， require 导入
      }
    ],
    plugins: [ts()]
  },
  {
    // umd
    input: inputSrc,
    output: {
      name,
      file: getPath('./dist/formula.js'),
      format: 'umd' // umd 兼容形式的包， 可以直接应用于网页 script
    },
    plugins: [
      resolve(),
      commonjs(),
      ts(),
      analyzer({
        summaryOnly: true, // 只显示总结而不显示每个模块的详细信息
        hideDeps: true // 隐藏依赖项的大小信息
      })
    ]
  },
  {
    // umd min
    input: inputSrc,
    output: {
      name,
      file: getPath('./dist/formula.min.js'),
      format: 'umd' // umd 兼容形式的包， 可以直接应用于网页 script
    },
    plugins: [resolve(), commonjs(), ts(), uglify()]
  },
  {
    // 声明文件
    input: inputSrc,
    output: { name, file: getPath(pkg.typings), format: 'es' },
    plugins: [dts()]
  }
];
