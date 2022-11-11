import { parseFeedsAndFolders } from './opmlParser';

export const readOpmlFile = async (file: File): Promise<ReturnType<typeof parseFeedsAndFolders>> => {
    const reader = new FileReader();

    return new Promise((resolve) => {
        reader.onload = async () => {
            const fileContent = reader.result as string;
            resolve(parseFeedsAndFolders(fileContent));
        };

        reader.readAsText(file);
    });
};
