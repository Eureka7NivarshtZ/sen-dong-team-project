const { HinhAnhTranh, Tranh } = require("../models");

const themHinhAnhTranh = async (req, res) => {
  const { tranhId } = req.params;
  const { url, la_chinh = false, thu_tu = 0 } = req.body;

  if (!url) {
    return res.status(400).json({
      error: "URL hinh anh la bat buoc",
    });
  }

  const tranh = await Tranh.findByPk(tranhId);

  if (!tranh) {
    return res.status(404).json({
      error: "Khong tim thay tranh",
    });
  }

  if (la_chinh) {
    await HinhAnhTranh.update(
      { la_chinh: false },
      { where: { tranh_id: tranhId } },
    );
  }

  const hinhAnh = await HinhAnhTranh.create({
    tranh_id: tranhId,
    url,
    la_chinh,
    thu_tu,
  });

  res.status(201).json(hinhAnh);
};

const xoaHinhAnhTranh = async (req, res) => {
  const { id } = req.params;
  const hinhAnh = await HinhAnhTranh.findByPk(id);

  if (!hinhAnh) {
    return res.status(404).json({
      error: "Khong tim thay hinh anh",
    });
  }

  await hinhAnh.destroy();

  res.status(204).end();
};

const datAnhChinh = async (req, res) => {
  const { id } = req.params;

  const hinhAnh = await HinhAnhTranh.findByPk(id);

  if (!hinhAnh) {
    return res.status(404).json({
      error: "Khong tim thay hinh anh",
    });
  }

  await HinhAnhTranh.update(
    { la_chinh: false },
    {
      where: {
        tranh_id: hinhAnh.tranh_id,
      },
    },
  );

  await hinhAnh.update({ la_chinh: true });

  res.json(hinhAnh);
};

const capNhatHinhAnhTranh = async (req, res) => {
  const { id } = req.params;
  const { url, la_chinh, thu_tu } = req.body;

  if (!url) {
    return res.status(400).json({
      error: "URL hinh anh la bat buoc",
    });
  }

  if (la_chinh) {
    await HinhAnhTranh.update(
      { la_chinh: false },
      {
        where: {
          tranh_id: hinhAnh.tranh_id,
        },
      },
    );
  }

  const hinhAnh = await HinhAnhTranh.findByPk(id);

  if (!hinhAnh) {
    return res.status(404).json({
      error: "Khong tim thay hinh anh",
    });
  }

  await hinhAnh.update({ url, la_chinh, thu_tu });

  res.json(hinhAnh);
};

module.exports = {
  themHinhAnhTranh,
  capNhatHinhAnhTranh,
  datAnhChinh,
  xoaHinhAnhTranh,
};
