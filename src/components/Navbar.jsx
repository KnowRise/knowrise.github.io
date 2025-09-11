import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <>
      <nav className="flex justify-between items-end">
        <div className="flex flex-col">
          <Link to="/">
            <h1 className="text-[24px] font-bold">KnowRise</h1>
            <p className="text-[12px]">Stay Positive and Be Yourself</p>
          </Link>
        </div>
        <div className="flex gap-[24px]">
          <Link
            to="/"
            className={`hover:hover:border-b-2 ${
              location.pathname === "/" ? "font-bold border-b-2" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/experience"
            className={`hover:hover:border-b-2 ${
              location.pathname === "/experience" ? "font-bold border-b-2" : ""
            }`}
          >
            Experience
          </Link>
          <Link
            to="/work"
            className={`hover:hover:border-b-2 ${
              location.pathname === "/work" ? "font-bold border-b-2" : ""
            }`}
          >
            Work
          </Link>
        </div>
      </nav>
    </>
  );
}
