# MathAPI

- Node 24 matches Azure. Install with npm ci and run npm test -- --runInBand; API contracts are in postman/.
- Math is public and stateless. Frontend requests must not send Login cookies or tokens.
- Preserve structured validation errors, CORS on error responses and the endpoints used by Ceos. Do not add private frontend variables.
- Azure deployment uses the existing OIDC workflow; keep secrets outside artifacts and logs.
- Use rg and focused reads/tests; reuse findings, bound output and run full checks once before delivery. Avoid redundant docs and simple-task subagents.
