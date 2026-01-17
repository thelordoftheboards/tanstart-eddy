import axios from 'redaxios';
import { getBaseUrl } from '~/base/utils/get-base-url';
import { OuterError } from '~/base/utils/outer-error';

export async function queryFnGet<T>(queryStringApi: string) {
  const queryString = `${getBaseUrl()}${queryStringApi}${queryStringApi.includes('?') ? '&' : '?'}t=${Date.now()}`;

  try {
    const result = await axios.get<T[]>(queryString, {
      withCredentials: true,
    });

    return result.data;
  } catch (err) {
    throw new OuterError(`Failed to GET from [${queryString}]`, err);
  }
}
