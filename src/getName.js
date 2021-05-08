import path from 'path';

const getName = (url, type = 'file') => {
  if (!url) {
    return '';
  }

  const { host, pathname } = new URL(url);
  const str = `${host}${pathname}`;
  const ext = path.extname(str) || '.html';
  const transformed = str.replace(ext, '').replace(/[^\w]/gi, '-');
  const postfix = type === 'file' ? ext : '_files';
  const result = `${transformed}${postfix}`;

  return result;
};

export default getName;
