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
  const { host, origin } = new URL(url);
  const folder = getFolderName(url);

  Object.entries(map).forEach(([tag, attr]) =>
    $(tag).each((_, el) => {
      const value = $(el).attr(attr);
      const link = new URL(value, origin);

      if (link.host !== host) {
        return;
      }

      const name = getFileName(link.toString());
      const path = `${folder}/${name}`;

      $(el).attr(attr, path);
      links.push({ href: link.toString(), name });
    })
  );

  return { data: $.html(), links };
};

export default replaceLinks;
