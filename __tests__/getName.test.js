import getName from '../src/getName';

describe('getName', () => {
  it(`should return name for string`, () => {
    const str = 'rustamyusupov.github.io/nerds';
    const result = getName(str);
    const expected = 'rustamyusupov-github-io-nerds';

    expect(result).toBe(expected);
  });

  it('should return name for long string', () => {
    const str = 'rustamyusupov.github.io/img/index-features1';
    const result = getName(str);
    const expected = 'rustamyusupov-github-io-img-index-features1';

    expect(result).toBe(expected);
  });

  it('should return empty string', () => {
    const result = getName('');

    expect(result).toBe('');
  });
});
