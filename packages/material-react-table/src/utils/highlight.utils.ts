export interface HighlightChunk {
  key: string;
  match: boolean;
  text: string;
}

interface HighlightWordsArgs {
  matchExactly?: boolean;
  query: string;
  text: string;
}

const escapeRegExp = (term: string): string =>
  term.replace(/[|\\{}()[\]^$+*?.-]/g, (char) => `\\${char}`);

const termsToRegExpString = (terms: string): string =>
  terms.replace(/\s{2,}/g, ' ').split(' ').join('|');

const buildRegExp = (terms: string, matchExactly: boolean): RegExp => {
  const fromString = /^([/~@;%#'])(.*?)\1([gimsuy]*)$/.exec(terms);
  if (fromString) {
    return new RegExp(fromString[2], fromString[3]);
  }
  const escaped = escapeRegExp(terms.trim());
  const pattern = matchExactly ? escaped : termsToRegExpString(escaped);
  return new RegExp(`(${pattern})`, 'ig');
};

let uidCounter = 0;
const uid = (): string => `mrt-hl-${(uidCounter += 1).toString(36)}`;

export const highlightWords = ({
  matchExactly = false,
  query,
  text,
}: HighlightWordsArgs): HighlightChunk[] => {
  const safeQuery = typeof query === 'string' ? query.trim() : query;
  if (safeQuery === '') {
    return [{ key: uid(), match: false, text }];
  }
  const searchRegexp = buildRegExp(query, matchExactly);
  return text
    .split(searchRegexp)
    .filter((str) => str.length > 0)
    .map((str) => ({
      key: uid(),
      match: matchExactly
        ? str.toLowerCase() === safeQuery.toLowerCase()
        : searchRegexp.test(str),
      text: str,
    }));
};
