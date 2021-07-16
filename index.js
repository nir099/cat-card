const { writeFile } = require('fs').promises;
const { join } = require('path');
const request = require('request-promise');
const blend = require('@mapbox/blend');
const argv = require('minimist')(process.argv.slice(2));
const catBaseURl = 'https://cataas.com';

const catUrlMaker = ({ path, ...queryParameters }) => {
  const newUrl = new URL(`cat/says/${path}`, catBaseURl);
  newUrl.search = new URLSearchParams(Object.entries(queryParameters));
  return { url: newUrl, encoding: 'binary', resolveWithFullResponse: true };
};

const sendCatRequest = async (alias = 'cat-request', requestS) => {
  const { body, statusCode } = await request.get(requestS);
  console.log('Received response to ' + alias + ' with status : ' + statusCode);
  return body;
};

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
    const firstReq = catUrlMaker({ path: greeting, width, height, color, size });
    const secondReq = catUrlMaker({ path: who, width, height, color, size });
    const firstCat = await sendCatRequest('firstCat', firstReq);
    const secondCat = await sendCatRequest('secondCat', secondReq);
    const data = await makeFinalCatImage({
      firstCat,
      secondCat,
      width,
      height,
    });
    const fileOut = join(process.cwd(), `/cat-card.jpg`);
    await writeFile(fileOut, data, 'binary');
    console.log('The cat file was saved!');
  } catch (error) {
    console.log(error);
  }
};

getTwoFunnyCats(argv);
