import cheerio from 'cheerio';
import path from 'path';

import getName from './getName';

const replaceLinks = (data, url) => {
  const links = [];
  const $ = cheerio.load(data);
  const { host, pathname } = new URL(url);
  const folder = getName(`${host}${pathname}`);

  $('img').each((i, el) => {
    const src = $(el).attr('src');
    const ext = path.extname(src);
    const withoutExt = src.replace(ext, '');
    const name = getName(`${host}/${withoutExt}`);
    const newSrc = `${folder}_files/${name}${ext}`;

    $(el).attr('src', newSrc);
    links.push(src);
  });

  return { data: $.html(), links };
};

export default replaceLinks;
