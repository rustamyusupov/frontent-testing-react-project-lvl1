import getName from '../src/getName';

describe('getName', () => {
  const origin = 'https://ru.hexlet.io';
  const pathname = '/courses';
  const prefix = 'ru-hexlet-io';

  it('should return html file name', () => {
    const url = `${origin}${pathname}`;
    const result = getName(url);
    const expected = `${prefix}-courses.html`;

    expect(result).toBe(expected);
  });

  it('should return css file name', () => {
    const url = `${origin}/assets/application.css`;
    const result = getName(url);
    const expected = `${prefix}-assets-application.css`;

    expect(result).toBe(expected);
  });

  it('should return img file name', () => {
    const url = `${origin}/assets/professions/nodejs.png`;
    const result = getName(url);
    const expected = `${prefix}-assets-professions-nodejs.png`;

    expect(result).toBe(expected);
  });

  it('should return empty file name', () => {
    const result = getName('');

    expect(result).toBe('');
  });

  it('should return empty folder name', () => {
    const url = `${origin}${pathname}`;
    const result = getName(url, 'folder');
    const expected = `${prefix}-courses_files`;

    expect(result).toBe(expected);
  });

  it('should return empty folder', () => {
    const result = getName('', 'folder');

    expect(result).toBe('');
  });
});
