import path from 'path';

const getName = (url) => {
  if (!url) {
    return '';
  }

  const { host, pathname } = new URL(url);
  const str = `${host}${pathname}`;
  const ext = path.extname(str);
  const name = str.replace(ext, '').replace(/[^\w]/gi, '-');

  return str ? `${name}${ext}` : '';
};

export default getName;
