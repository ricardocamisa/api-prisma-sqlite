const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

module.exports = {
  create: async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });
    return user;
  },
  readAll: async () => {
    return await prisma.user.findMany();
  },
  readOne: async (id) => {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
  },
  update: async (id, data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });
    return user;
  },
  deleteOne: async (id) => {
    return await prisma.user.delete({
      where: { id: parseInt(id) },
    });
  },
};
