import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

const isHmrDisabled = process.env.DISABLE_HMR === 'true';

const STUB_CLIENT_CODE = `// Inactive Vite client stub (DISABLE_HMR=true)
export function createHotContext() {
  return {
    accept: () => {},
    prune: () => {},
    dispose: () => {},
    decline: () => {},
    invalidate: () => {},
    on: () => {},
    off: () => {},
    send: () => {},
    data: {},
  };
}

export function updateStyle(id, content) {
  let style = document.querySelector(\`style[data-vite-dev-id="\${id}"]\`);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    document.head.appendChild(style);
  }
  style.textContent = content;
}

export function removeStyle(id) {
  const style = document.querySelector(\`style[data-vite-dev-id="\${id}"]\`);
  if (style) {
    style.remove();
  }
}

export class ErrorOverlay extends (typeof HTMLElement !== 'undefined' ? HTMLElement : class {}) {}
if (typeof customElements !== 'undefined' && !customElements.get('vite-error-overlay')) {
  try {
    customElements.define('vite-error-overlay', ErrorOverlay);
  } catch {}
}

export function injectQuery(url) {
  return url;
}
`;

/**
 * When DISABLE_HMR=true (e.g. inside AI Studio preview iframe where WebSocket
 * connections to dev ports are not permitted or desired), prevent Vite from
 * injecting the HMR client script into index.html, strip /@vite/client imports from
 * CSS modules, and stub @vite/client completely so no WebSocket connection is ever attempted.
 */
function disableHmrPlugin(): Plugin {
  return {
    name: 'disable-hmr',
    apply: 'serve',
    resolveId(id) {
      const cleanId = id.split('?')[0];
      if (cleanId === '/@vite/client' || cleanId === '@vite/client' || cleanId.endsWith('/vite/dist/client/client.mjs')) {
        return '\0stub-vite-client';
      }
      return null;
    },
    load(id) {
      if (id.startsWith('\0stub-vite-client')) {
        return STUB_CLIENT_CODE;
      }
      return null;
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        // Strip the @vite/client script tag injected by Vite's HTML middleware
        return html.replace(/<script type="module" src="\/@vite\/client[^"]*"><\/script>\s*/gi, '');
      },
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

