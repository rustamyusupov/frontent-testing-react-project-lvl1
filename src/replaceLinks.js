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
  const { host, origin } = new URL(url);
  const folder = getName(url);

  Object.entries(map).forEach(([tag, attr]) =>
    $(tag).each((_, el) => {
      const value = $(el).attr(attr);
      const link = new URL(value, origin);

      if (link.host !== host) {
        return;
      }

      const name = getName(link.toString());
      const newSrc = `${folder}_files/${name}`;

      $(el).attr(attr, newSrc);
      links.push(link.toString());
    })
  );

  return { data: $.html(), links };
};

export default replaceLinks;
