// Convert a CamelCase string to kebab-case
export default (string = ""): string =>
  string
    .replace(/\s(.)/g, ($1) => $1.toUpperCase())
    .replace(/\s/g, "")
    .replace(/^(.)/, ($1) => $1.toLowerCase());
