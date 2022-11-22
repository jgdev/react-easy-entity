import esbuild from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import Watcher from "watcher";
import { createServer } from "node:http";
import serveStatic from "serve-static";
import finalHandler from "finalhandler";
import { Server } from "socket.io";

const build = async (isDev) => {
  const logLevel = isDev ? "info" : "error";
  esbuild.buildSync({
    entryPoints: ["src/index.mts"],
    bundle: true,
    sourcemap: true,
    minify: true,
    splitting: true,
    format: "esm",
    target: ["esnext"],
    outdir: "./lib",
    treeShaking: true,
    logLevel,
  });

  const script = esbuild.buildSync({
    entryPoints: ["src/_example/index.tsx"],
    bundle: true,
    minify: true,
    format: "esm",
    target: ["esnext"],
    write: false,
    logLevel,
  });

  const html = await readFile("src/_example/index.html", "utf8");

  await writeFile(
    "lib/index.html",
    `${html.replace(
      "%script%",
      `<script type="text/javascript">${script.outputFiles[0].text}</script>`
    )}`
  );
};

const debounce = (func, timeout = 200) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

(async () => {
  const isDev = process.argv.indexOf("--dev") > -1;

  if (isDev) {
    const serve = serveStatic("./lib");

    const server = createServer((req, res) => {
      const done = finalHandler(req, res);
      serve(req, res, done);
    });

    const ws = new Server(server);

    server.listen(3000, () => {
      console.log("Server listening in http://localhost:3000");
    });

    const buildDev = debounce(() => {
      build(isDev)
        .then(() => {
          ws.emit("reload");
        })
        .catch(console.error);
    }, 1000);

    const watcher = new Watcher("./src", {
      native: true,
      recursive: true,
    });

    watcher.on("error", console.error);
    watcher.on("ready", () => {
      console.log("Watching ./src folder for changes");
    });
    watcher.on("all", () => buildDev());
    return;
  }

  return build();
})().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
