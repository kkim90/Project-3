import Tone from 'tone';
import { unstable_createResource as createResource } from 'react-cache';

export const bufferResource = createResource(
  url =>
    new Promise(resolve => {
      const buffer = new Tone.Player(url, () => {
        resolve(buffer);
      }).toMaster();
    })
);