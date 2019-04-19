module.exports = {
  excludes: ["./dist/**", "**/**.test.js"],
  namedExports: {
    reselect: ["createSelector"],
    enzyme: ["mount", "shallow"],
    react: ["useState", "useRef", "useEffect", "useLayoutEffect"],
    "react-dom": ["renderToString"],
    lodash: ["throttle", "get", "isEqual", "isEmpty", "every", "kebabCase"],
    "react-router-dom": ["Redirect"]
  }
}
