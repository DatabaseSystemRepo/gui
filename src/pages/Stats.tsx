import { useEffect, useState } from "react";
import api from "../api";

type Stat = {
  patient_id: number;
  name: string;
  total_appointments: number;
};

export default function Stats() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    api.get("/appointments/stored-procedure/stats").then((res) => {
      setStats(res.data[0]); // car MySQL retourne un tableau de résultats dans un array
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Appointment Stats</h1>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Patient ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Total Appointments</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s) => (
            <tr key={s.patient_id}>
              <td className="p-2 border">{s.patient_id}</td>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.total_appointments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
