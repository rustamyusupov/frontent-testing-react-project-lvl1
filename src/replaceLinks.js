import cheerio from 'cheerio';

import { getFileName, getFolderName } from './utils';

const map = {
  img: 'src',
  link: 'href',
  script: 'src',
};

const replaceLinks = (data, url) => {
  const links = [];
  const $ = cheerio.load(data);
  const { origin } = new URL(url);
  const folder = getFolderName(url);

  Object.entries(map).forEach(([tag, attr]) =>
    $(tag).each((_, el) => {
      const value = $(el).attr(attr);

      if (value.includes('http')) {
        return;
      }

      const link = new URL(`${url}/${value}`);
      const name = getFileName(`${origin}/${value}`);
      const path = `${folder}/${name}`;

      $(el).attr(attr, path);
      links.push({ href: link.toString(), name });
    })
  );

  return { data: $.html(), links };
};

export default replaceLinks;
