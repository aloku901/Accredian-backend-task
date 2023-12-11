  const express = require("express");
  const mysql = require("mysql");
  const cors = require("cors");
  const bcrypt = require("bcrypt");

  const app = express();
  app.use(cors());
  app.use(express.json());

  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1515",
    database: "signup",
  });

  app.post("/signup", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = "INSERT INTO login (username, email, password) VALUES (?, ?, ?)";
      const values = [username, email, hashedPassword];

      db.query(sql, values, (err, data) => {
        if (err) {
          console.error("Error:", err);
          return res.json("Error");
        }
        return res.json(data);
      });
    } catch (error) {
      console.error("Error:", error);
      return res.json("Error");
    }
  });


  app.post("/login", async (req, res) => {
  const sql = "SELECT * FROM login WHERE email = ?";
  db.query(sql, [req.body.email], async (err, data) => {
    if (err) {
      console.error("Error:", err);
      return res.json("Error");
    }

    if (data.length > 0) {
      const match = await bcrypt.compare(req.body.password, data[0].password);

      if (match) {
        return res.json("Success");
      } else {
        return res.json("Failed");
      }
    } else {
      return res.json("Failed");
    }
  });
});


  app.listen(3000, () => {
    console.log("App is running on port 3000");
  });
