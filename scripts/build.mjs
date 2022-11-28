import { build } from "esbuild";
import typeGen from 'npm-dts';
const { Generator } = typeGen;

const buildConfig = {
  entryPoints: ['src/index.ts'],
  target: 'node16',
  bundle: true,
  sourcemap: true,
}
// esm
build({
  ...buildConfig,
  platform: 'browser',
  target: ['ES2019'],
  format: 'esm',
  outfile: 'lib/esm/index.js',
}).catch(()=>process.exit(1))

// comonjs
build({
  ...buildConfig,
  platform: 'node',
  format: 'cjs',
  outfile: 'lib/cjs/index.js',
}).catch(()=>process.exit(1))

//type
new Generator({
  entry: 'src/index.ts',
  output: 'lib/esm/index.d.ts',
}).generate()