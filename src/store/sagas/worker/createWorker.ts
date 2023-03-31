export function createWorker() {
    return new Worker(new URL('./index.ts', import.meta.url));
}
