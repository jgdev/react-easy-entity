const esbuild = require("esbuild");
const fs = require("fs").promises;

const { readFile, writeFile, mkdir } = fs;

(async () => {
  // await mkdir("./dist");

  esbuild.buildSync({
    entryPoints: ["src/index.mts"],
    bundle: true,
    sourcemap: true,
    minify: true,
    splitting: true,
    format: "esm",
    target: ["esnext"],
    outdir: "./lib",
  });

  const script = esbuild.buildSync({
    entryPoints: ["src/_example/index.tsx"],
    bundle: true,
    minify: true,
    format: "esm",
    target: ["esnext"],
    write: false,
  });

  const html = await readFile("src/_example/index.html", "utf8");

  await writeFile(
    "lib/index.html",
    `${html.replace(
      "%script%",
      `<script type="text/javascript">${script.outputFiles[0].text}</script>`
    )}`
  );
})().catch(async (err) => {
  console.error(err);
  // await rmdir("./dist", { });
  process.exit(1);
});
