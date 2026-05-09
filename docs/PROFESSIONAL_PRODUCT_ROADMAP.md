# ApplyTriage Professional Product Roadmap

This repo keeps the current finalist demo UI locked: glass panels, dark decision surfaces,
teal-blue accents, rounded metric tiles, pill chips, and serif display headings should remain the
design language for every product expansion.

## Implemented in this codebase

- Server analysis endpoint at `/api/analyze` with client fallback for static previews.
- Analysis confidence, confidence reasons, and evidence snippets.
- Improved seniority detection so "Product Manager" is not treated as senior by title alone.
- Saved-job pipeline stages, next steps, notes, source URLs, follow-up dates, and confidence data.
- JSON export/import for user data portability.
- Unit-style regression tests for the analysis engine.
- CI workflow for typecheck, tests, and production build.

## Production backend path

The next professional step is replacing local browser storage with authenticated persistence while
keeping the existing Saved Jobs UI.

Recommended backend surface:

- `users`: profile, school, target roles, work authorization status, privacy settings.
- `job_analyses`: pasted/imported job text, normalized job fields, score breakdown, evidence, action.
- `saved_jobs`: pipeline stage, notes, source URL, follow-up date, timestamps.
- `recruiter_contacts`: recruiter name, channel, company, messages, response status.
- `events`: applied, messaged, followed up, interview, rejected, offer.

Recommended API surface:

- `POST /api/analyze`
- `GET /api/saved-jobs`
- `POST /api/saved-jobs`
- `PATCH /api/saved-jobs/:id`
- `DELETE /api/saved-jobs/:id`
- `POST /api/import`
- `GET /api/export`

## Intelligence path

- Keep deterministic rules as the baseline so outputs remain explainable.
- Add structured parsers for work authorization, seniority, location, compensation, and job source.
- Add job-description fixture tests before changing scoring weights.
- Add optional AI assistance only after evidence snippets and rule outputs are computed.
- Store model/rule versions with each analysis so future score changes are auditable.

## Extension path

- Browser extension reads job text from LinkedIn, Handshake, Indeed, and company ATS pages.
- Extension sends normalized title, company, location, URL, and description to `/api/analyze`.
- Existing analyzer screen remains the canonical full-detail view.
