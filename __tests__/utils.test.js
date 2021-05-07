import { getFileName, getFolderName } from '../src/utils';

describe('utils', () => {
  it(`should return html file name`, () => {
    const url = 'http://rustamyusupov.github.io/nerds';
    const result = getFileName(url);
    const expected = 'rustamyusupov-github-io-nerds.html';

    expect(result).toBe(expected);
  });

  it('should return resource file name', () => {
    const url = 'http://rustamyusupov.github.io/img/index-features1.img';
    const result = getFileName(url);
    const expected = 'rustamyusupov-github-io-img-index-features1.img';

    expect(result).toBe(expected);
  });

  it('should return file name for double extension', () => {
    const url = 'http://rustamyusupov.github.io/css/style.min.css';
    const result = getFileName(url);
    const expected = 'rustamyusupov-github-io-css-style-min.css';

    expect(result).toBe(expected);
  });

  it('should return empty file name', () => {
    const result = getFileName('');

    expect(result).toBe('');
  });

  it('should return empty folder name', () => {
    const url = 'http://rustamyusupov.github.io/nerds';
    const result = getFolderName(url);
    const expected = 'rustamyusupov-github-io-nerds_files';

    expect(result).toBe(expected);
  });

  it('should return empty folder', () => {
    const result = getFolderName('');

    expect(result).toBe('');
  });
});
