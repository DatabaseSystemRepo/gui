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

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this note?")) {
      await api.delete(`/visit-notes/${id}`);
      fetchData();
    }
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
                  {a.patient.name} / {a.doctor.name}
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
            {notes.map((n) => (
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
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500 mr-3">
                      {n.appointment.time}
                    </div>
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete note"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
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
