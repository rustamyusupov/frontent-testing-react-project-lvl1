import axios from 'axios';
import fs from 'fs';
import nock from 'nock';
import path from 'path';

import fetchFile from '../src/fetchFile';

axios.defaults.adapter = require('axios/lib/adapters/http');

const url = 'https://raw.githubusercontent.com';
const pathname = '/rustamyusupov/life-in-weeks/master/README.md';
const fileData = path.join(
  __dirname,
  '../__fixtures__/raw-githubusercontent-com-rustamyusupov-life-in-weeks-master-README-md.html'
);
const responseStatuses = {
  ok: 200,
  notFound: 404,
};

describe('fetchFile', () => {
  beforeAll(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  afterAll(() => nock.enableNetConnect());

  it('should return md file data', async () => {
    nock(url).get(pathname).replyWithFile(responseStatuses.ok, fileData);
    const result = await fetchFile(`${url}${pathname}`);
    const expected = fs.readFileSync(fileData, { encoding: 'utf-8' });

    expect(result).toEqual(expected);
  });

  it('should reject with error', async () => {
    nock(url).get(pathname).reply(responseStatuses.notFound);
    const result = () => fetchFile(url);

    await expect(result).rejects.toThrow(Error);
  });
});
