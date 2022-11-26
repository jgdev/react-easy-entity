import esbuild from "esbuild";
import { exec } from "child_process";

(async () => {
  await esbuild.build({
    bundle: true,
    incremental: true,
    entryPoints: ["./src/index.ts"],
    sourcemap: true,
    format: "esm",
    minify: true,
    splitting: true,
    treeShaking: true,
    outdir: "./dist",
    // watch: !!process.env.WATCH,
    logLevel: "info",
    external: ["react", "react-dom"],
    plugins: [
      {
        name: "start/end",
        setup: (build) => {
          build.onStart(async () => {
            const time = Date.now();
            try {
              await new Promise((resolve, reject) => {
                exec(
                  "tsc --emitDeclarationOnly --outDir dist",
                  (err, stdout, stderr) => {
                    if (err) return reject({ err, stdout, stderr });
                    return resolve();
                  }
                );
              });
              console.log(
                `⚡ Done in ${Date.now() - time}ms - Typescript Definitions\n`
              );
            } catch (err) {
              console.error("typescript", err);
            }
          });
        },
      },
    ],
  });
})().catch(console.error);
