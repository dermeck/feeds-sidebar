import { parseOpml } from './opmlParser';

export const readOpmlFile = async (file: File): Promise<ReturnType<typeof parseOpml>> => {
    const reader = new FileReader();

    return new Promise((resolve) => {
        reader.onload = async () => {
            const fileContent = reader.result as string;
            resolve(parseOpml(fileContent));
        };

        reader.readAsText(file);
    });
};
