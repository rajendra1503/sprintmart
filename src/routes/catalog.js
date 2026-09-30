const express = require('express');
const { db } = require('../../db/database');

const router = express.Router();
const PAGE_SIZE = 5;

router.get('/products', (req, res) => {
  const { q, category, sort } = req.query;

  let where = [];
  let params = [];

  if (q) {
    where.push('name LIKE ?');
    params.push(`%${q}%`);
  }
  if (category) {
    where.push('category = ?');
    params.push(category);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  let orderSql = 'ORDER BY id ASC';
  if (sort === 'price_asc') orderSql = 'ORDER BY price_cents ASC';
  if (sort === 'price_desc') orderSql = 'ORDER BY price_cents DESC';
  if (sort === 'name_asc') orderSql = 'ORDER BY name ASC';

  const totalCount = db
    .prepare(`SELECT COUNT(*) AS c FROM products ${whereSql}`)
    .get(...params).c;

  const totalPages = Math.max(Math.ceil(totalCount / PAGE_SIZE), 1);

  let page = parseInt(req.query.page, 10) || 1;
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  const offset = (page - 1) * PAGE_SIZE;

  const products = db
    .prepare(`SELECT * FROM products ${whereSql} ${orderSql} LIMIT ? OFFSET ?`)
    .all(...params, PAGE_SIZE, offset);

  const categories = db
    .prepare('SELECT DISTINCT category FROM products ORDER BY category')
    .all()
    .map((r) => r.category);

  res.render('catalog/index', {
    title: 'Shop',
    products,
    categories,
    q: q || '',
    category: category || '',
    sort: sort || '',
    page,
    totalPages,
    totalCount,
  });
});

router.get('/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).render('404', { title: 'Not found' });
  res.render('catalog/product', { title: product.name, product });
});

router.get('/', (req, res) => res.redirect('/products'));

module.exports = router;
