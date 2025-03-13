# Salesforce Webhooks Development Reference

## Build Commands
- `yarn build` - Build with webpack
- `yarn build:debug` - Build in development mode
- `yarn build:release` - Build in production mode
- `yarn clean` - Remove dist directory

## Test Commands
- `yarn test` - Run all tests with Mocha
- `yarn test:coverage` - Run tests with coverage (c8)
- Single test: `npx mocha test/unit/path/to/test.js`

## Lint Commands
- `yarn lint` - Run ESLint checks
- `yarn lint:format` - Run ESLint with auto-fix

## Code Style Guidelines
- **Indentation**: 2 spaces
- **Line length**: Max 100 characters
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Imports**: Group related imports, one line per import for > 1 imports
- **Error handling**: Detailed messages, proper logging with context
- **Testing**: Use describe/it BDD style with Mocha/Chai/Sinon
- **Formatting**: Object properties on separate lines, consistent spacing
- **Documentation**: JSDoc style for functions, especially public APIs