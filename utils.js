import { catBaseURl } from './constants.js';
import request from 'request-promise';

export const catUrlMaker = ({ path, ...queryParameters }) => {
  const newUrl = new URL(`cat/says/${path}`, catBaseURl);
  newUrl.search = new URLSearchParams(Object.entries(queryParameters));
  return { url: newUrl, encoding: 'binary', resolveWithFullResponse: true };
};

export const sendCatRequest = async (alias = 'cat-request', requestS) => {
  const { body, statusCode } = await request.get(requestS);
  console.log('Received response to ' + alias + ' with status : ' + statusCode);
  return body;
};
