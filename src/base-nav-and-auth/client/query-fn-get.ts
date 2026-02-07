import axios from 'redaxios';
import { getBaseUrl } from '~/base/utils/get-base-url';
import {
  checkResultAndThrowIfErrorIsSpecial,
  processAxiosOrSpecialException,
  validateStatus,
} from '../../base/client/server-response-error-handling';

export async function queryFnGet<T>(queryStringApi: string): Promise<T> {
  const queryString = `${getBaseUrl()}${queryStringApi}${queryStringApi.includes('?') ? '&' : '?'}t=${Date.now()}`;

  try {
    const result = await axios.get<T>(queryString, {
      withCredentials: true,
      validateStatus,
    });

    checkResultAndThrowIfErrorIsSpecial<T>(result);

    return result.data;
  } catch (err) {
    processAxiosOrSpecialException('GET', err, queryString, null);
  }

  throw new Error('placate ts');
}
