const serverless = require("serverless-http");
const app = require("../../server/app");

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // When redirected via /api/* → /.netlify/functions/api/:splat,
  // the path loses the /api prefix. Add it back so Express routes match.
  if (event.path && !event.path.startsWith("/api")) {
    event.path = "/api" + event.path;
  }
  return handler(event, context);
};
