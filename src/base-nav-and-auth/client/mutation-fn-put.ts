import axios from 'redaxios';
import { getBaseUrl } from '~/base/utils/get-base-url';
import { OuterError } from '~/base/utils/outer-error';

export async function mutationFnPut<R, V>(queryStringApi: string, data: V) {
  const queryString = `${getBaseUrl()}${queryStringApi}${queryStringApi.includes('?') ? '&' : '?'}t=${Date.now()}`;

  try {
    const result = await axios.put<R>(queryString, data, {
      withCredentials: true,
    });

    return result.data;
  } catch (err) {
    let dataAsStr = '--';
    try {
      dataAsStr = JSON.stringify(data);
    } catch {
      // Ignore
    }
    throw new OuterError(`Failed to PUT to [${queryString}] with [${dataAsStr}]`, err);
  }
}
