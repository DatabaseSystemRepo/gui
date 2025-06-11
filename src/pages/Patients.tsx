import { useEffect, useState } from "react";
import api from "../api";

type Patient = {
  id: number;
  name: string;
  email: string;
  birthdate: string;
};

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [form, setForm] = useState({ name: "", email: "", birthdate: "" });

  const fetchPatients = async () => {
    const res = await api.get("/patients");
    setPatients(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/patients", form);
    setForm({ name: "", email: "", birthdate: "" });
    fetchPatients();
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patients</h1>

      <form className="mb-6 flex gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          className="border p-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="date"
          className="border p-2"
          value={form.birthdate}
          onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
        />
        <button className="bg-blue-500 text-white px-4 py-2">Add</button>
      </form>

      <ul className="space-y-2">
        {patients.map((p) => (
          <li key={p.id} className="border p-2 rounded">
            <strong>{p.name}</strong> — {p.email} — {p.birthdate}
          </li>
        ))}
      </ul>
    </div>
  );
}
