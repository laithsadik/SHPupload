import { FaSearch } from "react-icons/fa";
import { FaFirstOrderAlt } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import SideBar from "./SideBar";

export default function Header() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.search]);

  return (
    <header className="bg-slate-200 shadow-md p-1">
      <div className="flex justify-between items-center max-w-full mx-auto p-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <SideBar />
          <Link to="/">
            <div className="flex gap-1 sm:gap-2 items-center mt-1 sm:mt-0">
              <FaFirstOrderAlt className="hidden sm:inline text-slate-500 text-sm sm:text-4xl mt-0.5" />
              <h1 className="font-bold text-xs sm:text-xl flex flex-wrap">
                <span className="text-slate-500">2Hand</span>
                <span className="text-slate-700">Product</span>
              </h1>
            </div>
          </Link>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex flex-wrap items-center ml-3 sm:ml-0"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder=" Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-80"
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          {currentUser ? (
            <Link to="/create-post">
              <li className="hidden sm:inline text-green-700 hover:opacity-60">
                <span className=" border-green-700 font-medium rounded-lg p-1 py-2 border items-center ">
                  +CreatePost
                </span>
              </li>
            </Link>
          ) : (
            ""
          )}
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="sm:inline text-slate-700 hover:underline">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
