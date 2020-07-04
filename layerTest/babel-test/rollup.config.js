
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  sourcemap: true,
  output: [
    {
      format: 'es',
      file: 'build/index.js',
    }
  ],
  plugins: [
    babel({
      plugins: [ '@babel/preset-env', '@babel/plugin-proposal-object-rest-spread' ],
    }),
  ],
};
