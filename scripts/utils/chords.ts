/* eslint-disable no-useless-escape */
export const chordRegexp = /^[A-H][b\#]?(2|5|6|7|9|11|13|6\/9|7\-5|7\-9|7\#5|7\#9|7\+5|7\+9|7b5|7b9|7sus2|7sus4|sus4|add2|add4|add9|aug|dim|dim7|m\/maj7|m6|m7|m7b5|m9|m11|m13|maj7|maj9|maj11|maj13|mb5|m|sus|sus2|sus4|m7add11|add11|b5|-5|4)*(\/[A-H][b\#]*)*$/;

export function isChordLine(input) {
    const tokens = input.replace(/\s+|\)|\(|-|\||\+/g, ' ').split(' ');

    return tokens.every(token => chordRegexp.test(token));
}

export function haveTextChordsLine(text) {
    if (!text) { return false; }

    return text.split(/\r\n|\n/g).some(line => isChordLine(line));
}
