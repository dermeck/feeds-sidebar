import { stripHtmlTags } from './stringUtils';

describe('#stripHtmlTags', () => {
    it('removes html tags', () => {
        const input =
            'This string contains <i>html</i> tags that should be <b>removed</b> <br>Link: -> <a href="https://example.com/">Link Text</a> <- Link <br><p>normal text</p>';

        const expectation =
            'This string contains html tags that should be removed Link: -> Link Text <- Link normal text';

        expect(stripHtmlTags(input)).toBe(expectation);
    });
});
