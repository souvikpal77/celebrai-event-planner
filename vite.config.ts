import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

const isHmrDisabled = process.env.DISABLE_HMR === 'true';

/**
 * When DISABLE_HMR=true (e.g. inside AI Studio preview iframe where WebSocket
 * connections to dev ports are not permitted or desired), prevent Vite from
 * injecting the HMR client script into index.html and prevent @vite/client from
 * attempting any WebSocket connection.
 */
function disableHmrPlugin(): Plugin {
  return {
    name: 'disable-hmr',
    apply: 'serve',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        // Strip the @vite/client script tag injected by Vite's HTML middleware
        return html.replace(/<script type="module" src="\/@vite\/client"><\/script>\s*/gi, '');
      },
    },
    transform(code, id) {
      // In case @vite/client is loaded by CSS injection or direct imports,
      // stub the WebSocket runner transport so no socket connection is ever attempted.
      if (id.includes('@vite/client') || id.endsWith('/client.mjs')) {
        return code
          .replace(
            /console\.debug\("\[vite\] connecting\.\.\."\);[\s\S]*?const transport = normalizeModuleRunnerTransport\([\s\S]*?\nconst debounceReload =/,
            'const forwardConsole = { enabled: false };\nconst transport = { connect: async () => {}, disconnect: async () => {}, send: () => {} };\nconst debounceReload ='
          )
          .replace(
            /transport\.connect\(createHMRHandler\(handleMessage\)\);?/g,
            '/* HMR WebSocket connection disabled via DISABLE_HMR=true */'
          )
          .replace(
            /\bsetupForwardConsoleHandler\s*\(\s*transport\s*,\s*forwardConsole\s*\);?/g,
            '/* Console forwarder disabled via DISABLE_HMR=true */'
          );
      }
      return null;
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(isHmrDisabled ? [disableHmrPlugin()] : []),
    ],
    resolve: {
      alias: {
        '@': import.meta.dirname ?? path.resolve('.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: !isHmrDisabled,
      // Explicitly disable the WebSocket server when HMR is disabled to avoid port binding conflicts.
      ws: isHmrDisabled ? (false as const) : undefined,
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: isHmrDisabled ? null : {},
    },
  };
});

