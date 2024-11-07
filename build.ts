import * as esbuild from 'npm:esbuild';

await esbuild.build({
  entryPoints: ['./src/main.ts'],
  outfile: './dist/out.js',
  bundle: true,
  format: 'esm',
});

esbuild.stop();
