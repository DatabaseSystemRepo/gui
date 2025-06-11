import { Link, useLocation } from "react-router-dom";

const links = [
  { path: "/patients", label: "Patients", icon: "👤" },
  { path: "/doctors", label: "Doctors", icon: "🩺" },
  { path: "/appointments", label: "Appointments", icon: "📅" },
  { path: "/notes", label: "Visit Notes", icon: "📝" },
  { path: "/stats", label: "Stats", icon: "📊" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <div className="flex items-center py-4 px-2">
              <span className="font-bold text-xl">MedicalApp</span>
            </div>
            <div className="flex items-center space-x-1">
              {links.map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`py-4 px-3 text-sm font-medium transition duration-300 hover:bg-blue-600 rounded-md ${
                    location.pathname === path
                      ? "bg-blue-700 text-white"
                      : "text-blue-50"
                  }`}
                >
                  <span className="mr-2">{icon}</span>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
