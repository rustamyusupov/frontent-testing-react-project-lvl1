import cheerio from 'cheerio';
import path from 'path';

import getName from './getName';

const map = {
  img: 'src',
  link: 'href',
  script: 'src',
};

const replaceLinks = (data, url, log) => {
  const links = [];
  const $ = cheerio.load(data);
  const { host, pathname, origin } = new URL(url);
  const folder = getName(`${host}${pathname}`);

  Object.entries(map).forEach(([tag, attr]) =>
    $(tag).each((_, el) => {
      const value = $(el).attr(attr).replace(/\/\//g, '/');

      log(`replace link ${value}`);

      const ext = path.extname(value);
      const withoutExt = value.replace(ext, '');
      const name = getName(`${host}/${withoutExt}`);
      const newSrc = `${folder}_files/${name}${ext}`;

      const link = new URL(value, origin);

      if (link.host !== host) return;

      $(el).attr(attr, newSrc);
      links.push(value);
    })
  );

  return { data: $.html(), links };
};

export default replaceLinks;
