import { Link, useLocation } from "react-router-dom";

const links = [
  { path: "/patients", label: "Patients" },
  { path: "/doctors", label: "Doctors" },
  { path: "/appointments", label: "Appointments" },
  { path: "/notes", label: "Visit Notes" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex gap-6">
      {links.map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          className={`hover:underline ${
            location.pathname === path ? "font-bold text-blue-300" : ""
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
