import getName from '../src/getName';

describe('getName', () => {
  it(`should return name`, () => {
    const url = 'https://ru.hexlet.io/courses';
    const result = getName(url);
    const expected = 'ru-hexlet-io-courses';

    expect(result).toBe(expected);
  });

  it('should return name without hash', () => {
    const url = 'https://ru.hexlet.io/courses#123';
    const result = getName(url);
    const expected = 'ru-hexlet-io-courses';

    expect(result).toBe(expected);
  });

  it('should return empty string', () => {
    const result = getName('');

    expect(result).toBe('');
  });
});
