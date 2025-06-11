import { useEffect, useState } from "react";
import api from "../api";

type Patient = { id: number; name: string };
type Doctor = { id: number; name: string };
type Appointment = {
  id: number;
  date: string;
  time: string;
  patient: Patient;
  doctor: Doctor;
};

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({
    date: "",
    time: "",
    patientId: "",
    doctorId: "",
  });

  const fetchAll = async () => {
    const [aRes, pRes, dRes] = await Promise.all([
      api.get("/appointments"),
      api.get("/patients"),
      api.get("/doctors"),
    ]);
    setAppointments(aRes.data);
    setPatients(pRes.data);
    setDoctors(dRes.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/appointments", {
      ...form,
      patientId: Number(form.patientId),
      doctorId: Number(form.doctorId),
    });
    setForm({ date: "", time: "", patientId: "", doctorId: "" });
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>

      <form
        className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        onSubmit={handleSubmit}
      >
        <input
          type="date"
          className="border p-2"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          type="time"
          className="border p-2"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />

        <select
          className="border p-2"
          value={form.patientId}
          onChange={(e) => setForm({ ...form, patientId: e.target.value })}
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2"
          value={form.doctorId}
          onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 col-span-full md:col-auto">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {appointments.map((a) => (
          <li key={a.id} className="border p-2 rounded">
            <strong>
              {a.date} {a.time}
            </strong>{" "}
            – Patient: {a.patient.name}, Doctor: {a.doctor.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
