import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import minify from "rollup-plugin-babel-minify";

export default {
  input: "index.js",
  output: {
    file: "dist/index.min.js",
    format: "iife",
    name: "OpenNative"
  },
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    minify({
      mangle: { topLevel: true }
    })
  ]
};
