import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "..", "data");
const CATALOG_PATH = path.join(DATA_DIR, "catalog.json");
const ORDERS_PATH = path.join(DATA_DIR, "orders.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

export function getCatalog() {
  return readJson(CATALOG_PATH);
}

export function filterProducts(query) {
  const { products } = getCatalog();
  const q = (query.q || "").toLowerCase().replace(/ё/g, "е").trim();
  const type = query.type || "";
  const standard = query.standard || "";
  const material = query.material || "";
  const coating = query.coating || "";

  return products.filter((item) => {
    if (q) {
      const hay = (item.title + " " + (item.keywords || "")).toLowerCase().replace(/ё/g, "е");
      if (!hay.includes(q)) return false;
    }
    if (type && item.type !== type) return false;
    if (standard && item.standard !== standard) return false;
    if (material && !(item.materials || []).includes(material)) return false;
    if (coating && !(item.coatings || []).includes(coating)) return false;
    return true;
  });
}

export function findProduct(id) {
  const { products } = getCatalog();
  return products.find((item) => item.id === id) || null;
}

export function getOrders() {
  return readJson(ORDERS_PATH);
}

export function saveOrder(order) {
  const orders = getOrders();
  const record = {
    id: "ord-" + Date.now(),
    ...order,
    createdAt: new Date().toISOString()
  };
  orders.push(record);
  writeJson(ORDERS_PATH, orders);
  return record;
}
