import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { IoMaleFemaleOutline } from "react-icons/io5";
import { TbDisabled } from "react-icons/tb";
import { GiTakeMyMoney } from "react-icons/gi";
import React, { useState } from "react";
export default function PetItem(prop) {
  const pet = prop.post;
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);

    localStorage.setItem(pet._id, isLiked);
    if (isLiked === true) {
      const storedPostsArrayString = localStorage.getItem("posts");
      const storedPostsArray = JSON.parse(storedPostsArrayString);
      if (storedPostsArray != null) {
        storedPostsArray.push(pet);
        const postArrayString = JSON.stringify(storedPostsArray);
        localStorage.setItem("posts", postArrayString);
      }
    } else {
      const storedPostsArrayString = localStorage.getItem("posts");
      const storedPostsArray = JSON.parse(storedPostsArrayString);
      if (storedPostsArray !== null) {
        const updatedPostsArray = storedPostsArray.filter(
          (post) => post._id !== pet._id
        );
        const updatedPostsArrayString = JSON.stringify(updatedPostsArray);
        localStorage.setItem("posts", updatedPostsArrayString);
      }
    }
  };
  const getLocalStorage = () => {
    if (localStorage.getItem(pet._id) === "true") return true;

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
      <Link to={`/pet/${pet._id}`}>
        <img
          src={pet.imageUrls[0]}
          alt="pet cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {pet.pickPet} {pet.pettype}
          </p>
          <p className="text-sm font-semibold text-slate-700 truncate">
            Quantity - {(+pet.quantity).toLocaleString("en-US")}
          </p>
          <div className="flex flex-col  gap-2">
            <div className="flex items-center gap-1">
              <MdLocationOn className="h-4 w-4 text-green-700" />
              <p className="turncate text-sm text-gray-600">
                {pet.areas}-{pet.city}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <GiTakeMyMoney className="h-4 w-4 text-green-700" />{" "}
              <p className="turncate text-sm text-gray-600">
                {"Price"}-
                {pet.price ? (+pet.price).toLocaleString("en-US") : "No Price"}
                ⟨₪⟩
              </p>
            </div>
          </div>
          <div>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center my-5 gap-5 sm:gap-5 max-w-60 border-2 rounded-xl p-2">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <TbDisabled className="text-2xl" />
                <div
                  className={` w-full max-w-[200px] text-white text-center p-1 rounded-md ${
                    !pet.disable ? "bg-green-900" : "bg-red-900"
                  }`}
                >
                  {pet.disable ? "Disabled" : "None Disable"}
                </div>
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <IoMaleFemaleOutline className="text-2xl" />
                <div
                  className={` w-full max-w-[200px] text-white text-center p-1 rounded-md ${
                    pet.sex === "male" ? "bg-green-900" : "bg-red-900"
                  }`}
                >
                  {pet.sex === "male"
                    ? "Male"
                    : pet.sex === "Female"
                    ? "Female "
                    : "Mix"}
                </div>
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {pet.description}
          </p>
        </div>
      </Link>
    </div>
  );
}
