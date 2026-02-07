import axios from 'redaxios';
import { getBaseUrl } from '~/base/utils/get-base-url';
import {
  checkResultAndThrowIfErrorIsSpecial,
  processAxiosOrSpecialException,
  validateStatus,
} from '../../base/client/server-response-error-handling';

export async function mutationFnPost<R, V>(queryStringApi: string, data: V): Promise<R> {
  const queryString = `${getBaseUrl()}${queryStringApi}${queryStringApi.includes('?') ? '&' : '?'}t=${Date.now()}`;

  try {
    const result = await axios.post<R>(queryString, data, {
      withCredentials: true,
      validateStatus,
    });

    checkResultAndThrowIfErrorIsSpecial<R>(result);

    return result.data;
  } catch (err) {
    let dataAsStr = '--';
    try {
      dataAsStr = JSON.stringify(data);
    } catch {
      // Ignore
    }

    processAxiosOrSpecialException('POST', err, queryString, dataAsStr);
  }

  throw new Error('placate ts');
}
