# TypeScript 7 parses JSON files imported with attributes that an ambient module declaration already types

## Summary

```ts
// src/types.d.ts
declare module "*.json" with { type: "text" } {
    const content: string;
    export default content;
}

// src/attribute.ts
import text from "./big.json" with { type: "text" };
const content: string = text; // the type comes from the declaration above, not from the JSON
```

The type of the import comes from the ambient `declare module "*.json" with { type: "text" }` declaration.
Still, with `resolveJsonModule: true`, `tsc` resolves `./big.json`, adds it to the program and parses it, even
though its contents are never used. The JSON is only read at runtime by the bundler as text, a URL etc.

As a result:

- Large JSON files (spine animations, sprite sheets, …) imported this way cost parse time and memory.
- In composite projects every such JSON file must also be listed in `include`/`files`, otherwise
  `error TS6307: File '…/big.json' is not listed within the file list of project`.

The same import written with a query instead of an attribute (`import text from "./big.json?text"` with
`declare module "*.json?text"`) is typed from the declaration without touching the file.

## Expected

When an import matches an ambient module declaration whose attributes match the import attributes, the type comes
from the declaration and the resolved file is not loaded into the program, the same as for a query specifier that
only an ambient declaration matches.

## Reproduce

```sh
npm install
npm run generate      # writes src/big.json (~9 MB), similar to the asset JSON files in our games
npm run attribute:files
npm run attribute
npm run query
npm run composite
```

## Results (TypeScript 7.1.0-beta, Node 26)

`npm run attribute:files` lists `src/big.json` in the program:

```
D:/ts7-import-json-with/src/big.json
D:/ts7-import-json-with/src/attribute.ts
D:/ts7-import-json-with/src/types.d.ts
```

`--extendedDiagnostics`, the attribute import compared with the query import:

|                 | `with { type: "text" }` | `?text` query |
|-----------------|-------------------------|---------------|
| Files           | 66                      | 65            |
| Lines           | 457 088                 | 57 082        |
| Memory used     | 159 073K                | 20 381K       |
| Parse time      | 0.104s                  | 0.015s        |
| Total time      | 0.173s                  | 0.024s        |

`npm run composite` (same sources with `composite: true`):

```
src/attribute.ts(3,18): error TS6307: File 'D:/ts7-import-json-with/src/big.json' is not listed within the file list of project 'D:/ts7-import-json-with/tsconfig.composite.json'. Projects must list all files or use an 'include' pattern.
```

Both `attribute.ts` and `query.ts` type check without errors, so the JSON type is not used in either case.

## Note

With `resolveJsonModule: false` (`npx tsc -p tsconfig.attribute.json --resolveJsonModule false --extendedDiagnostics`)
the JSON file is not loaded (Files: 65, Memory used: ~20 MB) and the import is typed from the declaration without errors.
That is not usable as a workaround when the same project also imports JSON data `with { type: "json" }`.
