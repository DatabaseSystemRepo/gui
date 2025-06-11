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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Visit Notes</h1>
        <div className="text-sm text-gray-500">
          {notes.length} recorded notes
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-medium text-gray-700 mb-4">New Note</h2>
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Appointment</label>
            <select
              className="p-2 w-full"
              required
              value={form.appointmentId}
              onChange={(e) =>
                setForm({ ...form, appointmentId: e.target.value })
              }
            >
              <option value="">Select an appointment</option>
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>
                  {new Date(a.date).toLocaleDateString("en-US")} {a.time} —{" "}
                  {a.patient.name} / Dr. {a.doctor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Observations</label>
            <textarea
              className="p-2 w-full h-24"
              placeholder="Observation notes"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Prescription</label>
            <textarea
              className="p-2 w-full h-24"
              placeholder="Prescription details"
              value={form.prescription}
              onChange={(e) =>
                setForm({ ...form, prescription: e.target.value })
              }
            />
          </div>

          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-purple-700 hover:to-indigo-700 mt-2">
            Save Note
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-700">Notes History</h2>
        </div>

        {notes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No visit notes recorded
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notes.map((n, index) => (
              <li
                key={n.id}
                className="animate-item p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-purple-100 text-purple-800 font-semibold px-3 py-1 rounded-full text-sm mr-3">
                      {new Date(n.appointment.date).toLocaleDateString("en-US")}
                    </div>
                    <div className="font-medium text-gray-800">
                      {n.appointment.patient.name}
                      <span className="mx-2 text-gray-400">with</span>
                      <span className="text-indigo-600">
                        Dr. {n.appointment.doctor.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {n.appointment.time}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Observations
                    </h4>
                    <p className="text-gray-700">
                      {n.note || "No observations"}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Prescription
                    </h4>
                    <p className="text-gray-700">
                      {n.prescription || "No prescription"}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
