import cheerio from 'cheerio';
import path from 'path';

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
      const value = $(el).attr(attr);
      const ext = path.extname(value);
      const withoutExt = value.replace(ext, '');
      const name = getName(`${host}/${withoutExt}`);
      const newSrc = `${folder}_files/${name}${ext}`;

      if (ext) {
        $(el).attr(attr, newSrc);
        links.push(value);
      }
    })
  );

  return { data: $.html(), links };
};

export default replaceLinks;
