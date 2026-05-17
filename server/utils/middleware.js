const errorHanlder = () => {
  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "Email này đã được sử dụng!" });
  }
  res.status(500).json({ message: "Lỗi server!" });
};

module.exports = { errorHanlder };
