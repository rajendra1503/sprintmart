# Continuous Deployment (staging)

Phase 1's pipeline was CI only: every push built the app and ran the automated
suite against a throwaway copy of it, then threw that copy away. Nothing was
ever actually *deployed* anywhere. This is the CD half: the pipeline now
packages the app into a Docker image, deploys it as a long-lived "staging"
container, and runs the automated suite against that real, running instance
instead of an ephemeral one.

## What changed

- **`Dockerfile`** — builds a small production image: installs only
  `dependencies` (not `devDependencies` like Playwright), copies in `db/`,
  `src/`, `public/`, and runs `npm run seed && npm start` on container start.
- **`playwright.config.js`** — now reads a `BASE_URL` environment variable.
  If it's set, Playwright points at that URL and does **not** try to start
  its own copy of the app (the `webServer` block is skipped). If it's unset
  — your laptop, GitHub Actions — nothing changes: Playwright still seeds and
  starts its own ephemeral instance on `localhost:3000`, exactly as before.
- **`Jenkinsfile`** — gained three stages after the existing install steps:
  1. **Build Docker image** — `docker build -t sprintmart:latest .`
  2. **Deploy to staging** — removes whatever staging container is already
     running (if any) and starts a new one from the image just built, on
     host port **3001** (`docker run -d --name sprintmart-staging -p
     3001:3000 sprintmart:latest`).
  3. **Wait for staging to be ready** — polls `http://localhost:3001/products`
     until it responds, instead of guessing with a fixed sleep. The
     container reseeds its own database on startup, so this can take a
     couple of seconds.
  The existing **Run automated tests** stage now sets `BASE_URL=
  http://localhost:3001` before running `npx playwright test`, so the suite
  is exercising the real deployed container, not a copy Playwright started
  itself.

Staging is left running after a successful build, on purpose — that's the
point of a persistent environment, so you (or a teammate) can open
`http://localhost:3001` in a browser at any time and see exactly what's
live. The next build's "Deploy to staging" stage replaces it with the new
version.

## Prerequisite: Docker must be available where Jenkins runs

Since your Jenkins runs on your own Windows machine, **Docker Desktop needs
to be installed and running there** before the new pipeline stages will
work — the Jenkinsfile now shells out to the `docker` command directly.

Two things commonly trip people up on Windows specifically:

1. **Docker Desktop isn't running.** It has to be open (check the whale icon
   in your system tray) whenever you trigger a build.
2. **Jenkins running as a Windows service can't see it.** If you installed
   Jenkins as a Windows service (rather than running it interactively),
   Windows services sometimes can't reach Docker Desktop's engine, because
   by default it's only exposed to your interactive desktop session. If the
   "Build Docker image" stage fails with something like `docker: command
   not found` or a connection error even though `docker --version` works
   fine in your own terminal, that's almost always what's happening. The
   fix: in Docker Desktop, go to **Settings → General** and enable "Expose
   daemon on tcp://localhost:2375 without TLS," then add an environment
   variable `DOCKER_HOST=tcp://localhost:2375` to the Jenkins service (or
   set it at the top of the Jenkinsfile with an `environment {}` block) so
   the `docker` CLI Jenkins invokes can reach the engine regardless of which
   session it's running under.

If you hit this, paste the failing stage's console output and I'll help you
sort out exactly which case it is.

## Why GitHub Actions still stops at CI

GitHub Actions runners are thrown away at the end of every job — there's no
persistent machine to leave a "staging" container running on between builds.
It could still build the Docker image and run a smoke test against it
*within the same job*, but that's not really deployment: nothing is left
running afterward for you to look at, so it wouldn't be meaningfully
different from what it already does. Real teams solve this by deploying to
an external, always-on target (a cloud VM, a container platform, etc.) —
worth knowing about, but more infrastructure than this training app needs
right now. Your local Jenkins, running on a machine that's actually still
there between builds, is what makes a real persistent staging environment
possible here.

## Verifying it yourself

1. Push these changes to your GitHub repo.
2. Trigger a Jenkins build (or let Poll SCM pick it up).
3. Watch the new stages run: image build, deploy, readiness wait, then
   tests running against port 3001.
4. Once it's green, open `http://localhost:3001/products` in your browser —
   that's the container the pipeline just deployed, still running.
5. Push again (even a trivial change) and confirm the old container is
   replaced with a new one and the site is still up on the same URL.