const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

function unique(prefix = "test") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function randomPhone() {
  return `0${Math.floor(100000000 + Math.random() * 900000000)}`;
}

function pickId(value) {
  if (!value) return undefined;

  if (typeof value === "string") {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
      ? value
      : undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const id = pickId(item);
      if (id) return id;
    }
    return undefined;
  }

  if (typeof value === "object") {
    for (const key of ["id", "tac_gia_id", "danh_muc_id", "khach_hang_id", "tranh_id", "don_hang_id"]) {
      if (value[key]) return value[key];
    }

    for (const key of ["data", "item", "result", "rows", "list", "items"]) {
      const id = pickId(value[key]);
      if (id) return id;
    }

    for (const child of Object.values(value)) {
      const id = pickId(child);
      if (id) return id;
    }
  }

  return undefined;
}

async function closeDb() {
  if (!sequelize?.close) return;
  try {
    await sequelize.close();
  } catch (error) {
    if (!/closed|connection/i.test(error?.message || "")) {
      throw error;
    }
  }
}

async function loginAs(email, mat_khau = "12345678") {
  const res = await request(app)
    .post("/api/auth/dang-nhap")
    .send({ email, mat_khau });

  if (res.statusCode !== 200 || !res.body?.data?.token) {
    throw new Error(`Không đăng nhập được ${email}: ${res.statusCode} ${JSON.stringify(res.body)}`);
  }

  return res.body.data.token;
}

async function loginAdmin() {
  return loginAs("admin@example.com", "12345678");
}

async function createCustomerAndLogin() {
  const email = `${unique("khach_test")}@example.com`;
  const mat_khau = "12345678";

  const res = await request(app)
    .post("/api/auth/dang-ky")
    .send({
      email,
      mat_khau,
      ho_ten: "Khách Test Tự Động",
      sdt: randomPhone(),
      dia_chi: "TP.HCM",
    });

  expect(res.statusCode).toBe(201);

  return {
    email,
    mat_khau,
    id: pickId(res.body),
    token: await loginAs(email, mat_khau),
  };
}

async function createDanhMuc(tokenQL) {
  const res = await request(app)
    .post("/api/danh-muc")
    .set("Authorization", `Bearer ${tokenQL}`)
    .send({ ten: `Danh mục test ${unique("dm")}` });

  expect([201, 400]).toContain(res.statusCode);

  let id = pickId(res.body);
  if (!id) {
    const listRes = await request(app).get("/api/danh-muc");
    id = pickId(listRes.body);
  }

  expect(id).toBeTruthy();
  return id;
}

async function createTacGia(tokenQL) {
  const res = await request(app)
    .post("/api/tac-gia")
    .set("Authorization", `Bearer ${tokenQL}`)
    .send({
      ho_ten: `Tác giả test ${unique("tg")}`,
      tieu_su: "Tạo tự động trong test để tránh lỗi khóa ngoại.",
    });

  expect([201, 400]).toContain(res.statusCode);

  let id = pickId(res.body);
  if (!id) {
    const listRes = await request(app).get("/api/tac-gia");
    id = pickId(listRes.body);
  }

  expect(id).toBeTruthy();
  return id;
}

module.exports = {
  request,
  app,
  unique,
  randomPhone,
  pickId,
  closeDb,
  loginAs,
  loginAdmin,
  createCustomerAndLogin,
  createDanhMuc,
  createTacGia,
};