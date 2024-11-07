import * as esbuild from 'npm:esbuild';
// import { denoPlugins } from 'jsr:@luca/esbuild-deno-loader';
import esbuildPluginTsc from 'npm:esbuild-plugin-tsc';

await esbuild.build({
  plugins: [
    esbuildPluginTsc({
      tsconfigPath: './tsconfig.json',
    }),
    // ...denoPlugins(),
  ],
  entryPoints: ['./src/main.ts'],
  outfile: './dist/out.js',
  bundle: true,
  format: 'esm',
});

esbuild.stop();
