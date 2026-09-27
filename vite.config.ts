import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    devtools({
      injectSource: {
        // When using devtools, it injects data-tsd-source attribute. However, react map libre does
        // not like it when it is injected into its objects, so it is disabled.
        enabled: false,
      },
    }),
    tanstackStart(),
    // https://tanstack.com/start/latest/docs/framework/react/guide/hosting
    nitro({
      plugins: [
        // Perform migrations and seeding
        'src/base/plugins/run-migrations-plugin.ts',
      ],
      preset: 'bun',
    }),
    viteReact({
      // // https://react.dev/learn/react-compiler
      // babel: {
      //   plugins: [
      //     [
      //       'babel-plugin-react-compiler',
      //       {
      //         target: '19',
      //       },
      //     ],
      //   ],
      // },
    }),
    // https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#react-compiler
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    allowedHosts: [process.env.SERVER_HOST ?? 'localhost'],
  },
});
