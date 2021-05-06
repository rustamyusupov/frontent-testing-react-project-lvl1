import getName from '../src/getName';

describe('getName', () => {
  it(`should return name for string`, () => {
    const url = 'http://rustamyusupov.github.io/nerds';
    const result = getName(url);
    const expected = 'rustamyusupov-github-io-nerds';

    expect(result).toBe(expected);
  });

  it('should return name for long string', () => {
    const url = 'http://rustamyusupov.github.io/img/index-features1.img';
    const result = getName(url);
    const expected = 'rustamyusupov-github-io-img-index-features1.img';

    expect(result).toBe(expected);
  });

  it('should return name for double extension', () => {
    const url = 'http://rustamyusupov.github.io/css/style.min.css';
    const result = getName(url);
    const expected = 'rustamyusupov-github-io-css-style-min.css';

    expect(result).toBe(expected);
  });

  it('should return empty string', () => {
    const result = getName('');

    expect(result).toBe('');
  });
});
