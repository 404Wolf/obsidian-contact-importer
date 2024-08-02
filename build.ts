const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "bun",
  publicPath: "",
});

if (!result.success) {
  console.error("Build failed");
  result.logs.forEach(console.error);
} else console.log("Successfully built project!");
