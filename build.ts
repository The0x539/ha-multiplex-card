import * as esbuild from 'npm:esbuild';
import { denoPlugins } from 'jsr:@luca/esbuild-deno-loader';

const result = await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ['./src/main.ts'],
  outfile: './dist/out.js',
  bundle: true,
  format: 'esm',
});

esbuild.stop();
