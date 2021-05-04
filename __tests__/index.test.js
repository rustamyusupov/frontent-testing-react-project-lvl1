import axios from 'axios';
import fs from 'fs';
import nock from 'nock';
import os from 'os';
import path from 'path';

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

describe('index loader', () => {
  let tempDir = '';

  beforeAll(() => nock.disableNetConnect());
  beforeEach(async () => {
    const dirPath = path.join(os.tmpdir(), 'page-loader-');

    tempDir = await fs.promises.mkdtemp(dirPath);
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
    nock(origin).get(pathname).replyWithFile(responseStatuses.ok, getFixture('index.html'));

    const response = await loader(url, tempDir);
    const result = fs.readFileSync(response, 'utf-8');
    const expected = fs.readFileSync(getFixture('result.html'), 'utf-8');

    expect(result).toBe(expected);
  });

  it('should return images', async () => {
    nock(origin)
      .get(pathname)
      .replyWithFile(responseStatuses.ok, getFixture('index.html'))
      .get(/[img|css|js]\/.*/)
      .reply((uri) => [responseStatuses.ok, fs.readFileSync(getFixture(uri))]);

    await loader(url, tempDir);

    ['index-features1.png', 'index-features2.png', 'index-features3.png'].forEach((name) => {
      const imgPath = path.join(
        tempDir,
        'rustamyusupov-github-io-nerds_files',
        `rustamyusupov-github-io-img-${name}`
      );
      const expected = fs.readFileSync(getFixture(`img/${name}`), 'utf-8');
      const result = fs.readFileSync(imgPath);

      expect(result).toBe(expected);
    });
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
