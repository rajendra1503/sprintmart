# Phase 1 — Product Catalog

**Sprint goal:** get a deployable, testable application live with the core browsing experience. This is the walking skeleton every later phase builds on.

Treat this the way a real sprint backlog would be treated: each story below is something a product owner could hand to a team, with acceptance criteria a tester would use to write both manual test cases and the first automated suite.

---

### US-1.1 — Browse the catalog

> As a shopper, I want to see a list of available products, so that I can browse what's for sale.

**Acceptance criteria**
- Visiting `/products` shows every product with its name, category, and price.
- If no products exist, the page shows a clear empty-state message instead of a blank grid.

### US-1.2 — Search by name

> As a shopper, I want to search products by name, so that I can quickly find something specific.

**Acceptance criteria**
- Typing a search term and submitting filters the list to products whose name contains that term (case-insensitive).
- Clearing the search term and submitting shows the full catalog again.
- A search with no matches shows the empty-state message, not an error.

### US-1.3 — Filter by category

> As a shopper, I want to filter products by category, so that I can narrow down what I'm browsing.

**Acceptance criteria**
- Choosing a category shows only products in that category.
- Choosing "All Categories" clears the filter.
- The category filter and a search term can be applied at the same time.

### US-1.4 — Sort by price

> As a shopper, I want to sort products by price, so that I can find the cheapest or priciest items.

**Acceptance criteria**
- "Price: Low to High" and "Price: High to Low" both sort correctly.
- Sorting doesn't reset any active search term or category filter.

### US-1.5 — Paginate the catalog

> As a shopper, I want the catalog paginated, so that the page stays usable as the store grows.

**Acceptance criteria**
- No more than 5 products are shown per page.
- Every product in the current filtered/sorted view is reachable by paging through.
- Page controls reflect the current filters and sort order, not just page number.

---

## What to do with this

Write manual test cases against these five stories first, the way you would for any sprint. Then write your Playwright automation suite against the same stories — `tests/example.spec.js` shows the project's convention (user-facing locators, relative paths, one assertion per idea) but is not itself the suite.

Once your suite is passing locally, push this repo to GitHub and confirm the GitHub Actions workflow goes green on its own. Then wire up Jenkins against the same repo so both pipelines are running the same suite. That's your baseline. Phase 2 arrives once this is done.
