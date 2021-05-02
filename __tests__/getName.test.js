import getName from '../src/getName';

describe('getName', () => {
  it(`should return name for url`, () => {
    const url = 'https://ru.hexlet.io/courses';
    const result = getName(url);
    const expected = 'ru-hexlet-io-courses';

    expect(result).toBe(expected);
  });

  it('should return name for path', () => {
    const url = 'https://ru.hexlet.io/assets/professions/nodejs';
    const result = getName(url);
    const expected = 'ru-hexlet-io-assets-professions-nodejs';

    expect(result).toBe(expected);
  });

  it('should return empty string', () => {
    const result = getName('');

    expect(result).toBe('');
  });
});
