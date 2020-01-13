import axios from 'axios';

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

export async function getUrlHtml(url) {
    return new Promise(
      (resolve, reject) => axios
        .get(url)
        .then(response => resolve(response.data))
        .catch(e => {
          reject(e);
        }),
    );
  }
