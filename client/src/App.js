import './App.css';
import axios from "axios";
import { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL ||"http://localhost:5000";

function App() {

  const [people, setPeople] = useState([]);
  const [form, setForm] = useState({ name: "", age: "" });
  const [editId, setEditId] = useState(null);

  // 🔍 Search state
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = async () => {
    const res = await axios.get(API);
    setPeople(res.data);
  };

  const addPerson = async () => {
    if (!form.name || !form.age) {
      alert("Please enter name and age");
      return;
    }

    const res = await axios.post(API, {
      name: form.name,
      age: Number(form.age)
    });

    setPeople([...people, res.data]);
    setForm({ name: "", age: "" });
  };

  const startedit = (p) => {
    setEditId(p._id);
    setForm({ name: p.name, age: p.age });
  };

  const updatePerson = async () => {
    const res = await axios.put(`${API}/${editId}`, form);

    setPeople(people.map(p =>
      p._id === editId ? res.data : p
    ));

    setEditId(null);
    setForm({ name: "", age: "" });
  };

  const deletePerson = async (id) => {
    await axios.delete(`${API}/${id}`);
    setPeople(people.filter(p => p._id !== id));
  };

  // 🔍 Filter logic (Frontend Search)
  const filteredPeople = people.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4 text-primary">
        MERN Stack CRUD Application
      </h2>

      {/* Form Card */}
      <div className="card shadow p-4 mb-4">
        <h5 className="mb-3">
          {editId ? "Update Person" : "Add Person"}
        </h5>

        <div className="row g-3">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Enter Age"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
          </div>

          <div className="col-md-4">
            {editId ? (
              <button className="btn btn-warning me-2" onClick={updatePerson}>
                Update
              </button>
            ) : (
              <button className="btn btn-success me-2" onClick={addPerson}>
                Add
              </button>
            )}

            <button
              className="btn btn-secondary"
              onClick={() => {
                setEditId(null);
                setForm({ name: "", age: "" });
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* People List */}
      <div className="card shadow p-3">

        <h5 className="mb-3">People List</h5>

        {/* 🔍 Search Input */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table className="table table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPeople.length === 0 ? (
              <tr>
                <td colSpan="3">No matching results</td>
              </tr>
            ) : (
              filteredPeople.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.age}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => startedit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deletePerson(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default App;
