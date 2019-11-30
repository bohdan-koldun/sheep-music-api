import axios from 'axios';
import { rejects } from 'assert';

export async function downloadFileFromUrl(url) {
    return new Promise(
      (resolve, reject) => axios
        .get(url, {
          responseType: 'arraybuffer',
        })
        .then(response => resolve(Buffer.from(response.data, 'binary')))
        .catch(e => {
          reject(e);
        }),
    );
  }
