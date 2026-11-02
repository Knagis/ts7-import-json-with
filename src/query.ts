// Same as attribute.ts, but using a query in the specifier: big.json is not resolved, so it is not parsed either.
import text from "./big.json?text";

const content: string = text;
export const length: number = content.toUpperCase().length;
