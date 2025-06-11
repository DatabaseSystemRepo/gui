import { useEffect, useState } from "react";
import api from "../api";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
};

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({ name: "", specialty: "" });

  const fetchDoctors = async () => {
    const res = await api.get("/doctors");
    setDoctors(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/doctors", form);
    setForm({ name: "", specialty: "" });
    fetchDoctors();
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Doctors</h1>

      <form className="mb-6 flex gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          className="border p-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Specialty"
          className="border p-2"
          value={form.specialty}
          onChange={(e) => setForm({ ...form, specialty: e.target.value })}
        />
        <button className="bg-green-600 text-white px-4 py-2">Add</button>
      </form>

      <ul className="space-y-2">
        {doctors.map((d) => (
          <li key={d.id} className="border p-2 rounded">
            <strong>{d.name}</strong> — {d.specialty}
          </li>
        ))}
      </ul>
    </div>
  );
}
