export const createWorker = () => new Worker(new URL('./index.ts', import.meta.url));
