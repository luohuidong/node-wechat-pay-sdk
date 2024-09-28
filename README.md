# Node TypeScript Template

- [x] TypeScript
- [ ] CommitLint
- [x] Commitizen
- [x] ESLint
- [x] Prettier
- [x] TypeDoc

## Scaffolding your node project

With NPM:

```bash
npm create @app-template/app@latest my-node-project -- --template node
```

With PNPM:

```bash
pnpm create @app-template/app@latest my-node-project --template node
```

## How to use

### Development

```bash
pnpm dev
```

### Production

```bash
pnpm build
```

### Testing

Before running tests, make sure you have built the project.

```bash
pnpm dev # or pnpm build
pnpm test # or pnpm test:watch
```
