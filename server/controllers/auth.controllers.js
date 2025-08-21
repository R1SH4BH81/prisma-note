// src/prisma.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "user exists" });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashPass,
      },
    });
    res.status(200).json({ message: `user created ${user}` });
  } catch (error) {
    res.status(500).json({ message: `error ${error.message}` });
  } finally {
    res.status(200).json({ message: `register ran` });
  }
};

const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "password is wrong" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "6hr",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: `error ${error.message}` });
  } finally {
    res.status(200).json({ message: `register ran` });
  }
};

module.exports = { register, login };
