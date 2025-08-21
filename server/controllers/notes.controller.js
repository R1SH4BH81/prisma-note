const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId: req.user.userId,
      },
    });
    res.status(201).json({ message: "Note created", note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
    });
    res.status(201).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = await prisma.note.findUnique({ where: { id: Number(id) } });

    if (!note || note.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this note" });
    }

    const updatedNote = await prisma.note.update({
      where: { id: Number(id) },
      data: { title, content },
    });

    res.json({ message: "Note updated", updatedNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating note" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({ where: { id: Number(id) } });

    if (!note || note.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this note" });
    }

    await prisma.note.delete({ where: { id: Number(id) } });

    res.json({ message: "Note deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting note" });
  }
};

module.exports = { createNote, getNotes, updateNote, deleteNote };
