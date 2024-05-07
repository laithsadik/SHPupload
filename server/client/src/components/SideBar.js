import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaHouseChimney } from "react-icons/fa6";
import { FaCar } from "react-icons/fa";
import { BsTools } from "react-icons/bs";
import { SiPetsathome } from "react-icons/si";
import { IoChatboxEllipses } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FaFirstOrderAlt } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
export default function SideBar() {
  const { currentUser } = useSelector((state) => state.user);
  const [nav, setNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const menu = [
    {
      title: "Ads I liked",
      link: "/Posted-Liked",
      icon: FaHeart,
      margin: true,
    },
    { title: "Chat", link: "/Contact-Form", icon: IoChatboxEllipses },
    {
      title: "Listing",
      link: "/search?searchTerm=",
      icon: FaHouseChimney,
      margin: true,
      categories:"listings" 
    },
    { title: "Vehicles", link: "/search?searchTerm=", icon: FaCar,categories:"vehicles" },
    { title: "Second-Hand", link: "/search?searchTerm=", icon: BsTools, categories:"secondhands"},
    { title: "pets", link: "/search?searchTerm=", icon: SiPetsathome,categories:"pets"  },
  ];
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Set breakpoint as needed
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleSignOutUser = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };
  return (
    <div className="max-w-[1640px] mx-auto flex justify-between items-center mt-1 shadow-sm">
      {/* Left side */}
      <div className="flex items-center">
        <div onClick={() => setNav(!nav)} className="cursor-pointer">
          <AiOutlineMenu size={isMobile ? 20 : 30} />
        </div>
      </div>

      {nav ? (
        <div
          onClick={() => setNav(!nav)}
          className="bg-black/20 fixed w-full h-screen z-10 top-0 left-0"
        ></div>
      ) : (
        ""
      )}

      {/* Side drawer menu */}
      <div
        className={
          nav
            ? "fixed top-0 left-0 w-[220px] sm:w-[380px] h-screen bg-white z-10 duration-300"
            : "fixed top-0 left-[-100%] w-[220px] sm:w-[380px] h-screen bg-white z-10 duration-300"
        }
      >
        <AiOutlineClose
          onClick={() => setNav(!nav)}
          size={30}
          className="absolute right-2 top-2 cursor-pointer"
        />
        <Link to="/">
          <div className="flex gap-1 sm:gap-2 items-center mt-1 sm:mt-0">
            <FaFirstOrderAlt className="hidden sm:inline text-slate-500 text-sm sm:text-4xl mt-0.5" />
            <h1 className="font-bold text-xs sm:text-xl flex flex-wrap">
              <span className="text-slate-500">2Hand</span>
              <span className="text-slate-700">Product</span>
            </h1>
          </div>
        </Link>
        <div>
          <Link to="/profile">
            {currentUser ? (
              <h2 className="flex items-center text-10xl gap-3.5 font-normal p-2 hover:bg-gray-700 rounded-md">
                {" "}
                <img
                  className="rounded-full h-20 w-20 object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />{" "}
                <h2 className="flex items-center text-2xl gap-3.5 font-bold p-2 hover:bg-gray-700 rounded-md whitespace-pre duration-500 ">{currentUser.username}</h2>
              </h2>
            ) : (
              <br/>
            )}
          </Link>
          {menu.map((member, i) => (
            <Link
              to={member.link}
              key={i}
              className={` ${
                member.margin && "mt-10"
              } ${localStorage.setItem("from","listings")} flex items-center text-2xl gap-3.5 font-bold p-2 hover:bg-gray-700 rounded-md`}
            >
              
              <div>{React.createElement(member.icon, { size: "20" })}</div>
              <h2 className="whitespace-pre duration-500">{member.title}</h2>
              <hr />
            </Link>
            
          ))}
          <Link to="/profile">
            {currentUser ? (
              <span
                onClick={handleSignOutUser}
                className="text-red-700   flex items-center text-2xl gap-3.5 font-bold p-2 hover:bg-gray-700 rounded-md whitespace-pre duration-500 mt-10"
              >
                Sign Out
              </span>
            ) : (
              <h2 className=" text-green-700  flex items-center text-2xl gap-3.5 font-bold p-2 hover:bg-gray-700 rounded-md whitespace-pre duration-500 mt-10">
                Sign in
              </h2>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
