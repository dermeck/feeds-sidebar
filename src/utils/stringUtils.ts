export const stripHtmlTags = (html: string) => {
    const htmlParser = new DOMParser().parseFromString(html, 'text/html');
    return htmlParser.body.textContent;
};
