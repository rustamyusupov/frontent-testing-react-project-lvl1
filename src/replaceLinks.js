import cheerio from 'cheerio';

import getName from './getName';

const map = {
  img: 'src',
  link: 'href',
  script: 'src',
};

const replaceLinks = (data, url) => {
  const links = [];
  const $ = cheerio.load(data);
  const { host, pathname } = new URL(url);
  const folder = getName(`${host}${pathname}`);

  Object.entries(map).forEach(([tag, attr]) =>
    $(tag).each((_, el) => {
      const value = $(el).attr(attr).replace(/\/\//g, '/');
      const name = getName(`${host}/${value}`);
      const newSrc = `${folder}_files/${name}`;

      if (value.includes('http')) {
        return;
      }

      $(el).attr(attr, newSrc);
      links.push(value);
    })
  );

  return { data: $.html(), links };
};

export default replaceLinks;
