import { promises as fs } from 'fs';
import { join } from 'path';
import blend from '@mapbox/blend';
import argv from 'minimist';
import { catUrlMaker, sendCatRequest } from './utils.js';

const makeFinalCatImage = async ({ firstCat, secondCat, width, height }) => {
  return await new Promise((res, rej) => {
    blend(
      [
        {
          buffer: new Buffer.from(firstCat, 'binary'),
          x: 0,
          y: 0,
        },
        {
          buffer: new Buffer.from(secondCat, 'binary'),
          x: width,
          y: 0,
        },
      ],
      {
        width: width * 2,
        height: height,
        format: 'jpeg',
      },
      (err, result) => {
        if (err) {
          rej(err);
        }
        res(result);
      }
    );
  });
};

const getTwoFunnyCats = async ({
  greeting = 'Hello',
  who = 'You',
  width = 400,
  height = 500,
  color = 'Pink',
  size = 100,
}) => {
  try {
    const firstCatUrl = catUrlMaker({ path: greeting, width, height, color, size });
    const firstCat = await sendCatRequest('firstCat', firstCatUrl);

    const secondCatUrl = catUrlMaker({ path: who, width, height, color, size });
    const secondCat = await sendCatRequest('secondCat', secondCatUrl);

    const finalCatImage = await makeFinalCatImage({
      firstCat,
      secondCat,
      width,
      height,
    });
    const fileOut = join(process.cwd(), `/cat-card.jpg`);
    await fs.writeFile(fileOut, finalCatImage, 'binary');
    console.log('The cat file was saved!');
  } catch (error) {
    console.log(error);
  }
};

getTwoFunnyCats(argv(process.argv.slice(2)));
