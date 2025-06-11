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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Patients</h1>
        <div className="text-sm text-gray-500">
          {patients.length} registered patients
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Add a patient
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Name"
            required
            className="p-2 w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="p-2 w-full"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="date"
            className="p-2 w-full"
            value={form.birthdate}
            onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
          />
          <button className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 rounded-md hover:from-indigo-700 hover:to-blue-600">
            Add Patient
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-medium text-gray-700">Patient List</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {patients.map((p, index) => (
            <li
              key={p.id}
              className="animate-item p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium text-indigo-600">{p.name}</h3>
                <div className="text-sm text-gray-500 mt-1 flex space-x-4">
                  <span>{p.email}</span>
                  <span>
                    Birthdate:{" "}
                    {new Date(p.birthdate).toLocaleDateString("en-US")}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-indigo-600 p-1">
                  ✏️
                </button>
                <button className="text-gray-400 hover:text-red-600 p-1">
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
