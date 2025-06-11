import { useEffect, useState } from "react";
import api from "../api";

type Stat = {
  patient_id: number;
  name: string;
  total_appointments: number;
};

export default function Stats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api
      .get("/appointments/stored-procedure/stats")
      .then((res) => {
        setStats(res.data[0]); // because MySQL returns results in an array
      })
      .catch((err) => console.error("Error fetching stats:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Find the max appointments to scale the visualization
  const maxAppointments =
    stats.length > 0 ? Math.max(...stats.map((s) => s.total_appointments)) : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1>Appointment Statistics</h1>
        <div className="text-sm text-gray-500">
          {stats.length} patients analyzed
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Overview</h2>
            <div className="text-gray-600 mb-6">
              This table shows the total number of appointments per patient.
              Patients with more appointments may require special follow-up.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((s) => (
                <div
                  key={s.patient_id}
                  className="animate-item bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-indigo-700">
                        {s.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: {s.patient_id}
                      </p>
                    </div>
                    <div
                      className={`text-white text-sm font-medium px-2 py-1 rounded-full ${
                        s.total_appointments > maxAppointments * 0.7
                          ? "bg-red-500"
                          : s.total_appointments > maxAppointments * 0.4
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      {s.total_appointments}
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">
                      Visit frequency
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          s.total_appointments > maxAppointments * 0.7
                            ? "bg-red-500"
                            : s.total_appointments > maxAppointments * 0.4
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${
                            (s.total_appointments / maxAppointments) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium text-gray-700 mb-4">
              Detailed Data
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700">
                  <tr>
                    <th className="p-3 text-left rounded-tl-lg">Patient ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left rounded-tr-lg">
                      Number of appointments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s) => (
                    <tr
                      key={s.patient_id}
                      className="animate-item border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-3">{s.patient_id}</td>
                      <td className="p-3 font-medium">{s.name}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            s.total_appointments > maxAppointments * 0.7
                              ? "bg-red-100 text-red-800"
                              : s.total_appointments > maxAppointments * 0.4
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {s.total_appointments}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
