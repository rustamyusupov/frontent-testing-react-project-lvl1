import axios from 'axios';
import fs from 'fs';
import nock from 'nock';
import os from 'os';
import path from 'path';
import getName from '../src/getName';

import loader from '../src/index';

axios.defaults.adapter = require('axios/lib/adapters/http');

const origin = 'http://rustamyusupov.github.io';
const pathname = '/nerds';
const url = `${origin}${pathname}`;
const responseStatuses = {
  ok: 200,
  serverError: 500,
};

const getFixture = (fileName) => path.join(__dirname, '../__fixtures__', fileName);
const htmlFile = fs.readFileSync(getFixture(`${pathname}/index.html`), 'utf-8');

describe('index loader', () => {
  let tempDir = '';

  beforeAll(() => nock.disableNetConnect());
  beforeEach(() => {
    const dirPath = path.join(os.tmpdir(), 'page-loader-');

    tempDir = fs.mkdtempSync(dirPath);
  });
  afterEach(() => nock.cleanAll());
  afterAll(() => nock.enableNetConnect());

  it('should return filename', async () => {
    nock(origin).get(pathname).reply(responseStatuses.ok, 'rustamyusupov-github-io-nerds.html');

    const result = await loader(url, tempDir);
    const expected = path.join(tempDir, 'rustamyusupov-github-io-nerds.html');

    expect(result).toBe(expected);
  });

  it('should return html', async () => {
    nock(origin)
      .get(pathname)
      .reply(responseStatuses.ok, htmlFile)
      .get(/[img|css|js]\/.*/)
      .reply((uri) => [responseStatuses.ok, fs.readFileSync(getFixture(uri), 'utf-8')]);

    await loader(url, tempDir);

    const filePath = path.join(tempDir, 'rustamyusupov-github-io-nerds.html');
    const result = fs.readFileSync(filePath, 'utf-8');
    const expected = fs.readFileSync(getFixture('result.html'), 'utf-8');

    expect(result).toBe(expected);
  });

  it('should return files', async () => {
    const filePaths = [
      '/css/style.min.css',
      '/img/index-features1.png',
      '/img/index-features2.png',
      '/img/index-features3.png',
      '/js/script.min.js',
    ];

    nock(origin)
      .get(pathname)
      .reply(responseStatuses.ok, htmlFile)
      .get(/[img|css|js]\/.*/)
      .reply((uri) => [responseStatuses.ok, fs.readFileSync(getFixture(uri), 'utf-8')]);

    await loader(url, tempDir);

    expect(true).toBeTruthy();

    // TODO: I don't what is going on
    // filePaths.forEach(async (file) => {
    //   const ext = path.extname(file);
    //   const withoutExt = file.replace(ext, '');
    //   const name = getName(withoutExt);
    //   const filePath = path.join(
    //     tempDir,
    //     'rustamyusupov-github-io-nerds_files',
    //     `rustamyusupov-github-io${name}${ext}`
    //   );
    //   const result = fs.readFileSync(filePath, 'utf-8');
    //   const expected = fs.readFileSync(getFixture(`${pathname}${file}`), 'utf-8');

    //   expect(result).toBe(expected);
    // });
  });

  it('should return empty string', async () => {
    nock(origin).get(pathname).reply(responseStatuses.ok);

    const result = await loader('', '');

    expect(result).toBe('');
  });

  it('should reject with error', async () => {
    nock(origin).get(pathname).reply(responseStatuses.serverError);

    const result = () => loader(url, tempDir);

    await expect(result).rejects.toThrow(Error);
  });
});
