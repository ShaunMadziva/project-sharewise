require("dotenv").config();

const app = require("./app");
const port = process.env.PORT || 3000;

app.listen(port,'0.0.0.0', () => {
  console.log(`App up and running on port: ${port}`);
});
