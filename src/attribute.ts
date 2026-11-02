// The type of `text` comes from the `declare module "*.json" with { type: "text" }` declaration in types.d.ts,
// so the contents of big.json are never needed to type check this file.
import text from "./big.json" with { type: "text" };

// these would fail if the type of the parsed JSON was used instead of the declaration.
const content: string = text;
export const length: number = content.toUpperCase().length;
