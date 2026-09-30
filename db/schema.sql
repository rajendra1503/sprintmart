-- SprintMart schema - Phase 1: Product Catalog only.
-- Later phases add users, carts, orders, and coupons as those features land.

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  stock INTEGER NOT NULL,
  emoji TEXT NOT NULL DEFAULT '📦'
);
