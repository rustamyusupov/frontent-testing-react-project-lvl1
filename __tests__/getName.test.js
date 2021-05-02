import getName from '../src/getName';

describe('getName', () => {
  it(`should return name for string`, () => {
    const str = 'ru.hexlet.io/courses';
    const result = getName(str);
    const expected = 'ru-hexlet-io-courses';

    expect(result).toBe(expected);
  });

  it('should return name for long string', () => {
    const str = 'ru.hexlet.io/assets/professions/nodejs';
    const result = getName(str);
    const expected = 'ru-hexlet-io-assets-professions-nodejs';

    expect(result).toBe(expected);
  });

  it('should return empty string', () => {
    const result = getName('');

    expect(result).toBe('');
  });
});
