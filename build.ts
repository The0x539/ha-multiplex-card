import * as esbuild from 'npm:esbuild';
import esbuildPluginTsc from 'npm:esbuild-plugin-tsc';

await esbuild.build({
  entryPoints: ['./src/main.ts'],
  outfile: './dist/out.js',
  bundle: true,
  format: 'esm',
  plugins: [
    esbuildPluginTsc({force: true }),
  ],
});

esbuild.stop();
