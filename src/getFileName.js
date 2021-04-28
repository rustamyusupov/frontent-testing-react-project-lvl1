const getFileName = (url) => {
  const { host, pathname } = new URL(url);
  const location = `${host}${pathname}`;
  const name = location.replace(/[^\w]/gi, '-');
  const fileName = `${name}.html`;

  return fileName;
};

export default getFileName;
