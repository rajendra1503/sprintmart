# SprintMart

SprintMart is an e-commerce app built **incrementally, sprint by sprint**, to teach Git/GitHub, Agile delivery, CI/CD, and — most importantly — how to build and maintain a test automation suite as an application actually changes underneath it.

This is a separate project from TestMart. TestMart teaches manual testing by handing you a finished app with bugs to find by hand. SprintMart teaches the opposite skill: you write the automated tests yourself, phase by phase, and the app will occasionally change in ways that break them — sometimes because the app changed in a way your test needs to catch up to, sometimes because something in the app is genuinely broken. Telling those two apart is the whole exercise.

## What's in Phase 1

Just the product catalog: browse, search by name, filter by category, sort by price, and pagination. No cart, no accounts, no checkout yet — those arrive in later phases. See `docs/PHASE_1_USER_STORIES.md` for the full backlog with acceptance criteria.

## Running it locally

Requirements: **Node.js 22.5 or newer** (`node --version` to check). Like TestMart, this uses Node's built-in `node:sqlite` module, so there's nothing to compile on install — no Visual Studio Build Tools, no native modules.

```bash
npm install
npm run seed     # creates/resets db/sprintmart.sqlite with demo data
npm start        # starts the server on http://localhost:3000
```

## Running the automated tests

```bash
npx playwright install --with-deps chromium   # one-time, per machine
npx playwright test
```

You don't need to start the server yourself first — `playwright.config.js` seeds the database and starts the app automatically before running any test, both locally and in CI. If you already have `npm start` running in another terminal, Playwright reuses it instead of starting a second copy.

`tests/example.spec.js` is a single example test showing the project's convention (user-facing locators, relative URLs). It is not the graded automation suite — writing that suite from the user stories is the exercise.

## Pushing this to GitHub

This folder is already a Git repository with real commit history and a `phase-1` tag. To push it to your own GitHub repo:

```bash
git remote add origin <your-empty-github-repo-url>
git push -u origin main --tags
```

Pushing `--tags` carries the `phase-1` tag along, so the point-in-time snapshot is preserved even as you keep committing on top of it.

## Setting up CI

Two pipelines are included and both run the exact same command (`npx playwright test`), so you can use either or both:

**GitHub Actions** — zero setup. The moment you push to GitHub, `.github/workflows/ci.yml` runs automatically and uploads the HTML test report as a build artifact. This is the fastest way to see the pipeline work.

**Jenkins** — the `Jenkinsfile` in the repo root defines a declarative pipeline: checkout, install dependencies, install Playwright's browser, run the suite, publish the JUnit report. To wire it up:

1. Get a Jenkins instance running. The fastest way for a training environment is Docker:
   ```bash
   docker run -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts
   ```
2. In Jenkins, create a new **Pipeline** job, and under "Pipeline" choose "Pipeline script from SCM," pointing at your GitHub repo and the `Jenkinsfile` path (`Jenkinsfile` at the root).
3. Add a GitHub webhook (repo Settings → Webhooks) pointing at `http://<your-jenkins-host>/github-webhook/`, or use Jenkins' "Poll SCM" as a simpler alternative if your Jenkins instance isn't reachable from the internet.
4. Push a commit and confirm a build fires automatically.

If Jenkins access/setup is the bottleneck for your cohort, GitHub Actions alone is enough to run the exercise — add Jenkins once that's comfortable.

## How the exercise proceeds from here

1. Write manual test cases and a Playwright suite against Phase 1's user stories. Get both pipelines green.
2. Let your trainer know Phase 1 is done. Phase 2 (Shopping Cart) arrives as new commits on top of what you have — pull them in, and some of your Phase 1 tests may start failing. Some failures mean your locator needs updating because the app legitimately changed; others mean you found a real bug. `docs/ANSWER_KEY.md` (trainer copy only) documents which is which for grading.
3. Repeat through Phase 3 (Accounts & Checkout) and Phase 4 (Admin, Coupons & the pipeline going live), each time growing the suite and keeping the pipeline honest.

## Project layout

```
db/            SQLite schema, seed data, connection helper
src/app.js     Express app setup
src/routes/    One file per feature area (catalog for now; more arrive per phase)
src/views/     EJS templates
public/        Static CSS
tests/         Your Playwright automation suite (one example test included)
docs/          User stories per phase, and the trainer-only answer key
Jenkinsfile    Declarative Jenkins pipeline
.github/workflows/ci.yml   GitHub Actions equivalent
```
