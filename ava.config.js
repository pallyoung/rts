export default {
  files: ["test/**/*.ts"],
  extensions: ["ts"],
  require: ["./run-ts.js"],
  timeout: "2m",
  verbose: true,
  environmentVariables: {
    NODE_ENV: "test",
  },
};
