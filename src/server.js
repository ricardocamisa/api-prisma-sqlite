require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { create, readAll, readOne, update, deleteOne } = require("./models");
const { login, verify, isAdmin } = require("./auth");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login", async (req, res) => {
  try {
    const users = await login(req.body.email, req.body.password);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/users", verify, async (req, res) => {
  try {
    const users = await readAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await readOne(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = await create(req.body);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const user = await update(req.params.id, req.body);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const user = await deleteOne(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log("Servidor ligado na porta " + port);
});
