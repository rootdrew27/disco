# Hints

## Initial

- See README.md

## Formatter (Prettier)
0. [Resource](https://prettier.io/docs/install)
1. Install the appropriate packages (if not installed via package.json)
```
npm install --save-dev --save-exact prettier
```
2. Create a `.prettierrc` and `.prettierignore` if not already present.
3. To check what files are not formatted: `npx prettier --check <dir_or_file_here>`.
4. To view results of prettier in console: `npx prettier <dir_or_file_here>`.
5. To apply formatting: `npx prettier --write <dir_or_file_here>`.

## Linter
0. [Resource](https://eslint.org/docs/latest/use/getting-started)
1. Install requirements: `npm init @eslint/config@latest`.
2. To get linting results: `npx eslint <dir_or_file_here>`.
3. 