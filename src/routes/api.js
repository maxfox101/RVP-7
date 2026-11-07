import { Router } from "express";
import {
  filterProducts,
  findProduct,
  getCatalog,
  getOrders,
  saveOrder
} from "../services/catalogService.js";

const router = Router();

/** GET /api/health — проверка, что сервер жив */
router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "bazmet-api" });
});

/** GET /api/categories */
router.get("/categories", (_req, res) => {
  const { categories } = getCatalog();
  res.json(categories);
});

/** GET /api/services */
router.get("/services", (_req, res) => {
  const { services } = getCatalog();
  res.json(services);
});

/** GET /api/filters — варианты для селектов каталога */
router.get("/filters", (_req, res) => {
  const { filters } = getCatalog();
  res.json(filters);
});

/**
 * GET /api/products
 * Query: q, type, standard, material, coating
 */
router.get("/products", (req, res) => {
  const list = filterProducts(req.query);
  res.json({ count: list.length, items: list });
});

/** GET /api/products/:id */
router.get("/products/:id", (req, res) => {
  const item = findProduct(req.params.id);
  if (!item) {
    return res.status(404).json({ error: "Изделие не найдено" });
  }
  res.json(item);
});

/** GET /api/orders — список заявок (для проверки на защите) */
router.get("/orders", (_req, res) => {
  res.json(getOrders());
});

/**
 * POST /api/orders
 * Body: { service, name, phone, email, description }
 */
router.post("/orders", (req, res) => {
  const { service = "", name = "", phone = "", email = "", description = "" } = req.body || {};

  if (!String(name).trim() || !String(phone).trim() || !String(email).trim()) {
    return res.status(400).json({
      error: "Укажите имя, телефон и e-mail"
    });
  }

  const saved = saveOrder({
    service: String(service).trim(),
    name: String(name).trim(),
    phone: String(phone).trim(),
    email: String(email).trim(),
    description: String(description).trim()
  });

  res.status(201).json(saved);
});

export default router;
