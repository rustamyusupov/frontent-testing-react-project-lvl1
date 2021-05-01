import getFileName from '../src/getFileName';

describe('getFileName', () => {
  it(`should return filename for simple url`, () => {
    const url = 'https://raw.githubusercontent.com/rustamyusupov/life-in-weeks/master/README.md';
    const result = getFileName(url);
    const expected = 'raw-githubusercontent-com-rustamyusupov-life-in-weeks-master-README-md.html';

    expect(result).toBe(expected);
  });

  it('should return filename for url with hash', () => {
    const url =
      'https://en.wikipedia.org/wiki/Mexican_War_of_Independence#French_invasion_of_Spain_and_political_crisis_in_New_Spain,_1808–09';
    const result = getFileName(url);
    const expected = 'en-wikipedia-org-wiki-Mexican_War_of_Independence.html';

    expect(result).toBe(expected);
  });

  it('should return empty string', () => {
    const result = getFileName('');

    expect(result).toBe('');
  });
});
