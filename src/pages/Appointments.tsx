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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Appointments</h1>
        <div className="text-sm text-gray-500">
          {appointments.length} scheduled appointments
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          New Appointment
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Date</label>
            <input
              type="date"
              className="p-2 w-full"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Time</label>
            <input
              type="time"
              className="p-2 w-full"
              required
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Patient</label>
            <select
              className="p-2 w-full"
              required
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            >
              <option value="">Select</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Doctor</label>
            <select
              className="p-2 w-full"
              required
              value={form.doctorId}
              onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            >
              <option value="">Select</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <button className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 rounded-md hover:from-indigo-700 hover:to-blue-600 mt-6 col-span-full md:col-auto">
            Add
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-700">
            Appointment List
          </h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {appointments.map((a, index) => (
            <li
              key={a.id}
              className="animate-item p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-indigo-100 text-indigo-800 font-semibold px-3 py-1 rounded-full text-sm mr-4">
                    {new Date(a.date).toLocaleDateString("en-US")} - {a.time}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">
                      {a.patient.name}
                    </span>
                    <span className="mx-2 text-gray-400">with</span>
                    <span className="font-medium text-indigo-600">
                      Dr. {a.doctor.name}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-indigo-600 p-1">
                    📝
                  </button>
                  <button className="text-gray-400 hover:text-red-600 p-1">
                    ❌
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
