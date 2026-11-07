import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { requestLogger } from "./middleware/requestLogger.js";
import apiRouter from "./routes/api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

const app = express();

// 1) CORS — браузер с React (5173/5174) может ходить на API
app.use(cors({ origin: true }));

// 2) Разбор JSON в теле запроса (для POST /api/orders)
app.use(express.json());

// 3) Лог каждого запроса
app.use(requestLogger);

// 4) Статика для фото каталога (те же images, что у клиента)
app.use("/images", express.static(path.join(__dirname, "..", "public", "images")));

// 5) Маршруты REST API
app.use("/api", apiRouter);

// 6) Если маршрут не найден
app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден", path: req.originalUrl });
});

// 7) Ошибки
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`БазМет API: http://127.0.0.1:${PORT}`);
  console.log(`Пример:    http://127.0.0.1:${PORT}/api/products`);
});
