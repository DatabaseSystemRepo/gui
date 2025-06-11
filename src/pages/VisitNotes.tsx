import { useEffect, useState } from "react";
import api from "../api";

type Appointment = {
  id: number;
  date: string;
  time: string;
  patient: { name: string };
  doctor: { name: string };
};

type VisitNote = {
  id: number;
  note: string;
  prescription: string;
  appointment: Appointment;
};

export default function VisitNotes() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notes, setNotes] = useState<VisitNote[]>([]);
  const [form, setForm] = useState({
    appointmentId: "",
    note: "",
    prescription: "",
  });

  const fetchData = async () => {
    const [apptRes, notesRes] = await Promise.all([
      api.get("/appointments"),
      api.get("/visit-notes"),
    ]);
    setAppointments(apptRes.data);
    setNotes(notesRes.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/visit-notes", {
      ...form,
      appointmentId: Number(form.appointmentId),
    });
    setForm({ appointmentId: "", note: "", prescription: "" });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Visit Notes</h1>

      <form
        className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        onSubmit={handleSubmit}
      >
        <select
          className="border p-2"
          value={form.appointmentId}
          onChange={(e) => setForm({ ...form, appointmentId: e.target.value })}
        >
          <option value="">Select Appointment</option>
          {appointments.map((a) => (
            <option key={a.id} value={a.id}>
              {new Date(a.date).toLocaleDateString("de-DE")} {a.time} —{" "}
              {a.patient.name} / {a.doctor.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="border p-2"
          placeholder="Note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
        <input
          type="text"
          className="border p-2"
          placeholder="Prescription"
          value={form.prescription}
          onChange={(e) => setForm({ ...form, prescription: e.target.value })}
        />
        <button className="bg-purple-600 text-white px-4 py-2 col-span-full md:col-auto">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {notes.map((n) => (
          <li key={n.id} className="border p-3 rounded">
            <div>
              <strong>RDV :</strong>{" "}
              {new Date(n.appointment.date).toLocaleDateString("de-DE")}{" "}
              {n.appointment.time} – {n.appointment.patient.name} /{" "}
              {n.appointment.doctor.name}
            </div>
            <div>
              <strong>Note :</strong> {n.note}
            </div>
            <div>
              <strong>Prescription :</strong> {n.prescription}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
