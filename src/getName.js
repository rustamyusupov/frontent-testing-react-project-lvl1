const getName = (url) => {
  if (!url) {
    return '';
  }

  const { host, pathname } = new URL(url);
  const location = `${host}${pathname}`;
  const fileName = location.replace(/[^\w]/gi, '-');

  return fileName;
};

export default getName;
