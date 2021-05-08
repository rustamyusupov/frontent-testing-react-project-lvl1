import path from 'path';

const getStr = (url) => {
  const { host, pathname } = new URL(url);
  const str = `${host}${pathname}`;

  return str;
};

const transform = (str) => str.replace(/[^\w]/gi, '-');

// union to one func
export const getFileName = (url) => {
  if (!url) {
    return '';
  }

  const str = getStr(url);
  const ext = path.extname(str) || '.html';
  const transformed = transform(str.replace(ext, ''));
  const result = `${transformed}${ext}`;

  return result;
};

export const getFolderName = (url) => {
  if (!url) {
    return '';
  }

  const str = getStr(url);
  const transformed = transform(str);
  const result = `${transformed}_files`;

  return result;
};
