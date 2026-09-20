import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="text-2xl uppercase font-bold text-gradient">
        ResuLens
      </Link>
      <Link to="/upload" className="primary-button w-fit">
        Upload Resume
      </Link>
    </nav>
  );
}
