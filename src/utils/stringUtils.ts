export const stripHtmlTags = (html: string) => {
    // TODO this is not sufficient, see skipped test
    return html.replace(/<\/?[^>]+(>|$)/g, '');
    /*
    // errors in nodejs
    const htmlParser = new DOMParser().parseFromString(html, 'text/html');
    return htmlParser.body.textContent;
    */
};
