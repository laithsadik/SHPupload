import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { GrHostMaintenance } from "react-icons/gr";
import { MdCalendarMonth } from "react-icons/md";
import { TbDisabled } from "react-icons/tb";
import { IoIosColorPalette } from "react-icons/io";
import { FaRoad } from "react-icons/fa";
import { BsFillFuelPumpFill } from "react-icons/bs";
import React, { useState } from "react";

export default function VehicleItem(prop) {
  const vehicle = prop.post;
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);

    localStorage.setItem(vehicle._id, isLiked);
    if (isLiked === true) {
      const storedPostsArrayString = localStorage.getItem("posts");
      const storedPostsArray = JSON.parse(storedPostsArrayString);
      if (storedPostsArray != null) {
        storedPostsArray.push(vehicle);
        const postArrayString = JSON.stringify(storedPostsArray);
        localStorage.setItem("posts", postArrayString);
      }
    } else {
      const storedPostsArrayString = localStorage.getItem("posts");
      const storedPostsArray = JSON.parse(storedPostsArrayString);
      if (storedPostsArray != null) {
        const updatedPostsArray = storedPostsArray.filter(
          (post) => post._id !== vehicle._id
        );
        const updatedPostsArrayString = JSON.stringify(updatedPostsArray);
        localStorage.setItem("posts", updatedPostsArrayString);
      }
    }
  };
  const getLocalStorage = () => {
    if (localStorage.getItem(vehicle._id) === "true") return true;

    return false;
  };
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[320px]">
      <div>
        <button
          onClick={handleLikeClick}
          className="text-2xl font-bold text-slate-700 "
        >
          {getLocalStorage() ? "❤️ Liked" : "🤍 Like"}
        </button>
      </div>
      <Link to={`/vehicle/${vehicle._id}`}>
        <img
          src={vehicle.imageUrls[0]}
          alt="vehicle cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105"
        />

        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {vehicle.manufacturer} {vehicle.model}
          </p>

          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />

            <p className="turncate text-sm text-gray-600">
              {vehicle.areas}-{vehicle.city}
            </p>
            <p className="turncate text-sm text-gray-600">
              {"Price"}-{+vehicle.price.toLocaleString("en-US")}
            </p>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {vehicle.description}
          </p>

          <div className=" text-slate-500 mt-2 font-semibold">
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center my-5 gap-5 sm:gap-5 max-w-60 border-2 rounded-xl p-2">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <GrHostMaintenance className="text-lg" />
                <span className="text-xs text-slate-700">
                  {" "}
                  {!vehicle.withOutCheck ? "Valid test" : "None test"}
                </span>
              </li>
              {!vehicle.withOutCheck ? (
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <MdCalendarMonth className="text-lg" />
                  <span className="text-xs text-slate-700">
                    {"Test -"} {vehicle.monthtest}/{vehicle.yeartest}
                  </span>
                </li>
              ) : (
                <div></div>
              )}
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <TbDisabled className="text-2xl" />
                <div
                  className={` w-full max-w-[200px] text-white text-center p-1 rounded-md ${
                    !vehicle.disable ? "bg-green-900" : "bg-red-900"
                  }`}
                >
                  {vehicle.disable ? "disabled" : "None disable"}
                </div>
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <IoIosColorPalette className="text-xl" />
                <span className="text-xs text-slate-700 ">
                  {" "}
                  {vehicle.color}
                </span>
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaRoad className="text-xl" />
                <span className="text-xs text-slate-700 ">
                  {"Vehicle Inception -"} {vehicle.monthgettingontheroad}
                </span>
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <BsFillFuelPumpFill className="text-xl" />
                <span className="text-xs text-slate-700 ">
                  {vehicle.enginetype}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Link>
    </div>
  );
}
