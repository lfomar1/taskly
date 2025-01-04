import bcrypt from "bcryptjs";
import prisma from "../prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  //Verify if user exists
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    res.status(400).json({ msg: "User already exists" });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });
    res
      .status(201)
      .json({ msg: "User succesfully created", userId: newUser.id });
  } catch (error) {
    res.status(500).json({ msg: "Error creating user", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  //Check if email does exists
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    res.status(400).json({ msg: "Email does not exists" });
  }

  //Check if password is correct
  const passwordCorrect = await bcrypt.compare(password, user.password);
  if (!passwordCorrect) {
    res.status(400).json({ msg: "Invalid credentials" });
  }

  //Generate a token
  const token = jwt.sign({ userId: user.id, name: user.name }, JWT_SECRET, {
    expiresIn: "20m",
  });

  res.status(200).json({ msg: "Login successful", token });
};
