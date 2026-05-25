require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./models");

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    const PORT = process.env.DB_PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to database:", error);
  }
}

main();
