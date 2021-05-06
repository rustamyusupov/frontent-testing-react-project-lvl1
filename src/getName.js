import path from 'path';

const getName = (str) => {
  const ext = path.extname(str);
  const name = str.replace(ext, '').replace(/[^\w]/gi, '-');

  return str ? `${name}${ext}` : '';
};

export default getName;
