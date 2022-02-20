const fs = require("fs");

module.exports = {
  mount: {
    public: { url: "/", static: true },
    src: "/dist",
  },
  routes: [
    {
      match: "routes",
      src: ".*",
      dest: (req, res) => {
        // Default headers. See https://github.com/withastro/snowpack/blob/c44d86f73ac7b74507d4d5554ccb96e8b7dc5294/snowpack/src/commands/dev.ts#L133-L137.
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "text/html");
        res.setHeader("Vary", "Accept-Encoding");

        // Make `index.html` cross-origin isolated to enable `SharedArrayBuffer`.
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");

        return fs.createReadStream("public/index.html").pipe(res);
      },
    },
  ],
};
