require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT;

const main = async () => {
  await sequelize.authenticate();

  await sequelize.sync();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

main();
