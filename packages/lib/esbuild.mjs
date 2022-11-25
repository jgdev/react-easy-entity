import esbuild from "esbuild";

try {
  esbuild.buildSync({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    sourcemap: true,
    minify: true,
    splitting: true,
    format: "esm",
    target: ["esnext"],
    outdir: "./dist",
    treeShaking: true
  });
} catch (err) {
  console.error(err)
}