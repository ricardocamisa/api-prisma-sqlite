require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const { JWT_SECRET } = process.env;

module.exports = {
  login: async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user);
    if (!user) {
      return { message: "Invalid email or password" };
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return { message: "Invalid email or password" };
    }
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return { token, user };
  },
  verify: (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).send("Unauthorized");
      return;
    }
    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      res.status(401).send("Unauthorized");
      return;
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).send("Unauthorized");
    }
  },
  isAdmin: (req, res, next) => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  },
};
