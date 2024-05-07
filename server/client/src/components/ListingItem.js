import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import React, { useState } from "react";

export default function ListingItem(prop) {
  const listing = prop.post;
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);

    localStorage.setItem(listing._id, isLiked);
    if (isLiked === true) {
      const storedPostsArrayString = localStorage.getItem("posts");
      const storedPostsArray = JSON.parse(storedPostsArrayString);
      if (storedPostsArray != null) {
        storedPostsArray.push(listing);
        const postArrayString = JSON.stringify(storedPostsArray);
        localStorage.setItem("posts", postArrayString);
      }
    } else {
      const storedPostsArrayString = localStorage.getItem("posts");
      const storedPostsArray = JSON.parse(storedPostsArrayString);
      if (storedPostsArray != null) {
        const updatedPostsArray = storedPostsArray.filter(
          (post) => post._id !== listing._id
        );
        const updatedPostsArrayString = JSON.stringify(updatedPostsArray);
        localStorage.setItem("posts", updatedPostsArrayString);
      }
    }
  };
  const getLocalStorage = () => {
    if (localStorage.getItem(listing._id) === "true") return true;

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
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="turncate text-sm text-gray-600">{listing.address}</p>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className=" text-slate-500 mt-2 font-semibold">
            ₪{" "}
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bedrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
