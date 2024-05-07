import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useDispatch, useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";
import {
  imageClickedPress,
  imageClickedRelease,
} from "../redux/user/userSlice";

export default function Listing() {
  const dispatch = useDispatch();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser, imageClicked } = useSelector((state) => state.user);
  const [isLiked, setIsLiked] = useState(false);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.listingId;
        setError(false);
        setLoading(true);
        const res = await fetch(`/api/listing/getListing/${listingId}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handleImageClick = (url) => {
    dispatch(imageClickedPress(url));
  };
  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    localStorage.setItem(listing._id,isLiked);
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
  
  const getLocalStorage=() => {
    if(localStorage.getItem(listing._id) === "true")
      return true;
   
    return false ;
  }
  return (
    <main>
      {imageClicked && (
        <div
          onClick={() => {
            return dispatch(imageClickedRelease());
          }}
          className="flex justify-start z-10 bg-black  bg-opacity-85 absolute "
        >
          <img
            className="object-contain mt-3 w-screen h-screen"
            src={imageClicked}
            alt="img clicked"
          />
        </div>
      )}
      {loading && (
        <p className="text-center my-7 text-3xl text-slate-700">Loading...</p>
      )}
      {error && (
        <p className="text-center my-7 text-3xl text-red-700">
          Somthing went wrong
        </p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide className="flex justify-between" key={url}>
                <div className="sm:max-w-24 max-w-0 sm:min-w-24 min-w-0"></div>
                <img
                  onClick={() => {
                    return handleImageClick(url);
                  }}
                  className="mt-4 border-2 w-full  h-[500px] object-cover  cursor-pointer rounded-lg"
                  src={url}
                  alt="img-listing"
                />

                <div className="sm:max-w-24 max-w-0 sm:min-w-24 min-w-0"></div>
              </SwiperSlide>
            ))}
          </Swiper>
          {!imageClicked && (
            <div className="fixed top-[13%] right-[7%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
              <FaShare
                className="text-slate-500 "
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
              />
            </div>
          )}
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
              <div>
      <button onClick={handleLikeClick} className="text-2xl font-bold text-slate-700 ">  
        {getLocalStorage()? '❤️ Liked' : '🤍 Like'}
      </button>
      
    </div> 
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ₪{" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center  gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[180px] text-white text-center p-1 rounded-md">
                  ₪{+listing.regularPrice - +listing.discountPrice} discount
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>

            {!imageClicked && !contact && (
              <button
                disabled={!currentUser}
                onClick={() => {
                  return setContact(true);
                }}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 p-3 disabled:opacity-40"
              >
                Contact landlord
              </button>
            )}
            {!currentUser ? (
              <span className="ml-2 text-red-400 ">
                {" "}
                you have to login for make mail conversation
              </span>
            ) : (
              ""
            )}
            {!imageClicked && contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
