import { useEffect, useState } from "react";
import api from "../api";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
};

// Common specialties for filtering
const SPECIALTIES = [
  "General Practitioner",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Surgeon",
  "Neurologist",
  "Psychiatrist",
  "Radiologist",
  "Ophthalmologist",
  "Other",
];

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({ name: "", specialty: "" });
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [specialtyFilter, setSpecialtyFilter] = useState("");

  const fetchDoctors = async () => {
    const res = await api.get("/doctors");
    setDoctors(res.data);
    setFilteredDoctors(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/doctors", form);
    setForm({ name: "", specialty: "" });
    fetchDoctors();
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...doctors];

    // Filter by name
    if (filter) {
      result = result.filter((d) =>
        d.name.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Filter by specialty
    if (specialtyFilter) {
      result = result.filter(
        (d) => d.specialty.toLowerCase() === specialtyFilter.toLowerCase()
      );
    }

    // Sort by name
    result.sort((a, b) => {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });

    setFilteredDoctors(result);
  }, [doctors, filter, sortOrder, specialtyFilter]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Get unique specialties from doctors
  const uniqueSpecialties = Array.from(
    new Set(doctors.map((d) => d.specialty))
  ).filter(Boolean);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Doctors</h1>
        <div className="text-sm text-gray-500 bg-white py-1 px-3 rounded-full shadow-sm">
          {doctors.length} registered doctors
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-medium text-gray-700 mb-4">Add a doctor</h2>
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Doctor's name</label>
            <input
              type="text"
              placeholder="Dr. Smith"
              required
              className="p-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-green-300 focus:border-green-500"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Specialty</label>
            <input
              type="text"
              list="specialties"
              placeholder="Medical specialty"
              required
              className="p-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-green-300 focus:border-green-500"
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
            />
            <datalist id="specialties">
              {SPECIALTIES.map((specialty) => (
                <option key={specialty} value={specialty} />
              ))}
            </datalist>
          </div>

          <div className="flex items-end">
            <button className="bg-gradient-to-r from-green-600 to-teal-500 text-white px-4 py-2 rounded-md hover:from-green-700 hover:to-teal-600 w-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-medium text-gray-700">Medical Staff</h2>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="pl-10 p-2 w-full rounded-md border border-gray-300"
                  placeholder="Search for a doctor..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>

              <select
                className="p-2 rounded-md border border-gray-300"
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
              >
                <option value="">All specialties</option>
                {uniqueSpecialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>

              <button
                className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 text-gray-500 transform ${
                    sortOrder === "desc" ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No doctors match your search
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredDoctors.map((d) => (
              <li
                key={d.id}
                className="list-item bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-gradient-to-r from-green-500 to-teal-400 h-2"></div>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg text-gray-800">
                      Dr. {d.name}
                    </h3>
                    <div className="flex mt-1">
                      <button className="text-gray-400 hover:text-green-600 p-1 rounded-full hover:bg-green-50 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors ml-1">
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

                  <div className="mt-3 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {d.specialty}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-400 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs text-gray-500">
                          ID: {d.id}
                        </span>
                      </div>
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline">
                        View Appointments
                      </button>
                    </div>
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
