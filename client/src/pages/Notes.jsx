import { useEffect, useState } from "react";
import api from "../api/axios";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // axios auth header
  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes", authHeaders);
      setNotes(res.data || []); // ensure always an array
    } catch (err) {
      setMessage(err.response?.data?.message || "Error fetching notes");
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await api.post("/notes", { title, content }, authHeaders);
      setNotes([...notes, res.data]);
      setTitle("");
      setContent("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding note");
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`, authHeaders);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting note");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <h2>My Notes</h2>

      <form onSubmit={addNote}>
        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {message && <p>{message}</p>}

      <ul>
        {notes.map((note, index) => (
          <li key={index}>
            <strong>{note.title}</strong>: {note.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notes;
