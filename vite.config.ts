import { defineConfig } from 'vite';

export default defineConfig({
    root: 'src/stand-alone',
    build: {
        // Relative to the root
        outDir: '../buildv',
    },
});
