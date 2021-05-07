import axios from 'axios';
import fs from 'fs';
import nock from 'nock';
import os from 'os';
import path from 'path';

import { getFileName } from '../src/utils';
import loader from '../src/index';

axios.defaults.adapter = require('axios/lib/adapters/http');

const origin = 'http://rustamyusupov.github.io';
const pathname = '/nerds';
const url = `${origin}${pathname}`;
const responseStatuses = {
  ok: 200,
  notFound: 404,
  serverError: 500,
};

const getFixture = (fileName) => path.join(__dirname, '../__fixtures__', fileName);

describe('index loader', () => {
  let tempDir = '';

  beforeAll(() => {
    const dirPath = path.join(os.tmpdir(), 'page-loader-');

    nock.disableNetConnect();
    tempDir = fs.mkdtempSync(dirPath);
  });
  afterAll(() => {
    nock.enableNetConnect();
    nock.cleanAll();
  });

  it('should return filename', async () => {
    nock(origin).get(pathname).reply(responseStatuses.ok, 'rustamyusupov-github-io-nerds.html');

    const result = await loader(url, tempDir);
    const expected = path.join(tempDir, 'rustamyusupov-github-io-nerds.html');

    expect(result).toBe(expected);
  });

  it('should return files', async () => {
    const htmlFile = fs.readFileSync(getFixture('index.html'), 'utf-8');
    const getFile = (name) => fs.readFileSync(getFixture(name), 'utf-8');
    const files = {
      css: ['/css/style.min.css', getFile('css/style.min.css')],
      img1: ['/img/index-features1.png', getFile('img/index-features1.png')],
      img2: ['/img/index-features2.png', getFile('img/index-features2.png')],
      img3: ['/img/index-features3.png', getFile('img/index-features3.png')],
      js: ['/js/script.min.js', getFile('js/script.min.js')],
    };

    nock(origin)
      .get(pathname)
      .reply(responseStatuses.ok, htmlFile)
      .get(files.css[0])
      .reply(responseStatuses.ok, files.css[1])
      .get(files.img1[0])
      .reply(responseStatuses.ok, files.img1[1])
      .get(files.img2[0])
      .reply(responseStatuses.ok, files.img2[1])
      .get(files.img3[0])
      .reply(responseStatuses.ok, files.img3[1])
      .get(files.js[0])
      .reply(responseStatuses.ok, files.js[1]);

    // TODO: how to do this?
    // .get(/(js|css|img)\/.*/)
    // .reply((uri) => [responseStatuses.ok, fs.readFileSync(getFixture(uri), 'utf-8')]);

    await loader(url, tempDir);

    const htmlPath = path.join(tempDir, 'rustamyusupov-github-io-nerds.html');
    const htmlResult = await fs.promises.readFile(htmlPath, 'utf-8');
    const htmlExpected = await fs.promises.readFile(getFixture('result.html'), 'utf-8');

    expect(htmlResult).toBe(htmlExpected);

    const filePaths = [
      '/css/style.min.css',
      '/img/index-features1.png',
      '/img/index-features2.png',
      '/img/index-features3.png',
      '/js/script.min.js',
    ];

    filePaths.forEach((file) => {
      const fileName = getFileName(`${url}${file}`);
      const filePath = path.join(tempDir, 'rustamyusupov-github-io-nerds_files', fileName);
      const result = fs.readFileSync(filePath, 'utf-8');
      const expected = fs.readFileSync(getFixture(file), 'utf-8');

      expect(result).toBe(expected);
    });
  });

  it('should reject with 404', async () => {
    nock(origin).get('/notFound').reply(responseStatuses.notFound);

    const result = () => loader(`${origin}/notFound`, tempDir);

    await expect(result).rejects.toThrow('Error: Request failed with status code 404');
  });

  it('should reject with 500', async () => {
    nock(origin).get(pathname).reply(responseStatuses.serverError);

    const result = loader(url, tempDir);

    await expect(result).rejects.toThrow('Error: Request failed with status code 500');
  });

  it('should return error for wrong folder', async () => {
    nock(origin).get(pathname).reply(responseStatuses.ok);

    const result = loader(url, 'wrongFolder');

    await expect(result).rejects.toThrow('Error: ENOENT: no such file or directory');
  });
});
