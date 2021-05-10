import axios from 'axios';
import fs from 'fs/promises';
import nock from 'nock';
import os from 'os';
import path from 'path';

import loader from '../src/index';

axios.defaults.adapter = require('axios/lib/adapters/http');

const getFixture = (fileName) => path.join(__dirname, '../__fixtures__', fileName);
const readFile = (filePath) => fs.readFile(filePath, 'utf-8');

const origin = 'https://ru.hexlet.io';
const pathname = '/courses';
const url = `${origin}${pathname}`;
const htmlFileName = 'ru-hexlet-io-courses.html';
const filesFolder = 'ru-hexlet-io-courses_files';
const serverResponse = {
  ok: 200,
  notFound: 404,
  serverError: 500,
};
let tempDir = '';

const resources = [
  {
    path: '/assets/application.css',
    name: 'ru-hexlet-io-assets-application.css',
  },
  {
    path: '/assets/professions/nodejs.png',
    name: 'ru-hexlet-io-assets-professions-nodejs.png',
  },
  {
    path: '/packs/js/runtime.js',
    name: 'ru-hexlet-io-packs-js-runtime.js',
  },
];

describe('index loader', () => {
  beforeAll(async () => {
    nock.disableNetConnect();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));

    const getData = async (resource) => {
      const filePath = getFixture(resource.name);
      const data = await readFile(filePath);

      // eslint-disable-next-line no-param-reassign
      resource.data = data;
    };

    await Promise.all(resources.map(getData));
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it(`should return ${htmlFileName}`, async () => {
    const htmlFile = await readFile(getFixture('index.html'));

    nock(origin).get(pathname).reply(serverResponse.ok, htmlFile);

    resources.forEach((resource) => {
      nock(origin).get(resource.path).reply(serverResponse.ok, resource.data);
    });

    const resultPath = await loader(url, tempDir);
    const result = await readFile(resultPath);
    const expectedPath = getFixture(htmlFileName);
    const expected = await readFile(expectedPath);

    expect(result).toBe(expected);
  });

  test.each(resources.map((r) => [r.name, r]))(
    'should return %s',
    async (_, { name, data: expected }) => {
      const filePath = `${tempDir}/${filesFolder}/${name}`;
      const result = await readFile(filePath);

      expect(result).toBe(expected);
    }
  );

  it('should reject with 404', async () => {
    const scope = nock(origin).get('/notFound').reply(serverResponse.notFound);
    const result = () => loader(`${origin}/notFound`, tempDir);

    await expect(result).rejects.toThrow(Error);
    scope.done();
  });

  it('should reject with 500', async () => {
    const scope = nock(origin).get(pathname).reply(serverResponse.serverError);
    const result = () => loader(url, tempDir);

    await expect(result).rejects.toThrow(Error);
    scope.done();
  });

  it('should return error for wrong folder', async () => {
    const scope = nock(origin).get(pathname).reply(serverResponse.ok, '');

    await expect(loader(url, `${tempDir}/folder`)).rejects.toThrow();
    scope.done();
  });
});
