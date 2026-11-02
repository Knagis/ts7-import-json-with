declare module "*.json" with { type: "text" } {
    const content: string;
    export default content;
}

// the same declaration using a query instead of the import attribute, used by query.ts for comparison
declare module "*.json?text" {
    const content: string;
    export default content;
}
