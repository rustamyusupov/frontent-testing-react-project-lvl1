import axios from 'axios';
import fs from 'fs/promises';
import nock from 'nock';
import os from 'os';
import path from 'path';

import loader from '../src/index';

axios.defaults.adapter = require('axios/lib/adapters/http');

const getFixture = (fileName) => path.join(__dirname, '../__fixtures__', fileName);
const readFile = (filePath) => fs.readFile(filePath, 'utf-8');

let tempDir = '';
const origin = 'https://ru.hexlet.io';
const pathname = '/courses';
const url = `${origin}${pathname}`;
const htmlFileName = 'ru-hexlet-io-courses.html';
const filesName = 'ru-hexlet-io-courses_files';
const serverResponse = {
  ok: 200,
  notFound: 404,
  serverError: 500,
};

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

    const promises = resources.map(getData);
    await Promise.all(promises);
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

  test.each(resources)('should return %p', async ({ name, data: expected }) => {
    const filePath = `${tempDir}/${filesName}/${name}`;
    const result = await readFile(filePath);

    expect(result).toBe(expected);
  });

  // it('should return files', async () => {
  //   const htmlFile = await fs.readFile(getFixture('index.html'), 'utf-8');
  //   const cssFile = await fs.readFile(getFixture('application.css'), 'utf-8');
  //   const imgFile = await fs.readFile(getFixture('nodejs.png'), 'utf-8');
  //   const jsFile = await fs.readFile(getFixture('runtime.js'), 'utf-8');

  //   nock(origin)
  //     .get(pathname)
  //     .reply(serverResponse.ok, htmlFile)
  //     .get('/assets/application.css')
  //     .reply(serverResponse.ok, cssFile)
  //     .get('/assets/professions/nodejs.png')
  //     .reply(serverResponse.ok, imgFile)
  //     .get('/packs/js/runtime.js')
  //     .reply(serverResponse.ok, jsFile);

  //   await loader(url, tempDir);

  //   const htmlPath = path.join(tempDir, getName(url));
  //   const htmlResult = await fs.readFile(htmlPath, 'utf-8');
  //   const htmlExpected = await fs.readFile(getFixture('result.html'), 'utf-8');

  //   expect(htmlResult).toBe(htmlExpected);

  //   const assetsPaths = [
  //     '/assets/application.css',
  //     '/assets/professions/nodejs.png',
  //     '/packs/js/runtime.js',
  //   ];

  //   const test = async (file) => {
  //     const fileName = getName(`${origin}${file}`);
  //     const filePath = path.join(tempDir, 'ru-hexlet-io-courses_files', fileName);
  //     const result = await fs.readFile(filePath, 'utf-8');
  //     const expected = await fs.readFile(getFixture(file), 'utf-8');

  //     expect(result).toBe(expected);
  //   };

  //   const promises = assetsPaths.map(test);
  //   await Promise.all(promises);
  // });

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
