import * as NodeID3 from 'node-id3';

export function setMetadata(buffer, metadata): Buffer {
    const { title, artist, album, commentText } = metadata;

    const songTags = {
        title,
        artist,
        album,
        comment:
        {
          language: '',
          shortText: '',
          text: commentText || '',
        },
      };

    return NodeID3.write(songTags, buffer);
}
