import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useDispatch, useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/bundle";
import { FaMapMarkerAlt, FaShare } from "react-icons/fa";
import {
  imageClickedPress,
  imageClickedRelease,
} from "../redux/user/userSlice";
import { FaHorseHead } from "react-icons/fa";
import { FaBirthdayCake } from "react-icons/fa";
import { FaRegHandPaper } from "react-icons/fa";
import { BsSpeedometer } from "react-icons/bs";
import { SlCallIn } from "react-icons/sl";
import { CgProfile } from "react-icons/cg";
import { GrHostMaintenance } from "react-icons/gr";
import { MdCalendarMonth } from "react-icons/md";
import { TbDisabled } from "react-icons/tb";
import { IoIosColorPalette } from "react-icons/io";
import { FaRoad } from "react-icons/fa";
import { BsFillFuelPumpFill } from "react-icons/bs";
import Contact from "../components/Contact";

export default function Vehicle() {
  const dispatch = useDispatch();
  const params = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const { currentUser, imageClicked } = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const vehicleId = params.vehicleId;
        setError(false);
        setLoading(true);
        const res = await fetch(`/api/vehicle/getVehicle/${vehicleId}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setVehicle(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [params.vehicleId]);
  const handleImageClick = (url) => {
    dispatch(imageClickedPress(url));
  };

  function generateRandomEnginePower() {
    // Generate a random number between 10 and 30 (inclusive)
    const randomNum = Math.floor(Math.random() * 21) + 10;
    // Convert the random number to a decimal number with one decimal place
    const enginePower = (randomNum / 10).toFixed(1);
    return enginePower;
  }
  

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    
    localStorage.setItem(vehicle._id,isLiked);
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
  const getLocalStorage=() => {
    if(localStorage.getItem(vehicle._id) === "true")
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
      {vehicle && !loading && !error && (
        <div>
          <Swiper navigation>
            {vehicle.imageUrls.map((url) => (
              <SwiperSlide className="flex justify-between " key={url}>
                <div className="sm:max-w-24 max-w-0 sm:min-w-24 min-w-0"></div>
                <img
                  onClick={() => {
                    return handleImageClick(url);
                  }}
                  className="mt-4 border-2 w-full object-cover  h-[500px] cursor-pointer rounded-lg"
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
          <div className="flex  max-w-6xl p-3  gap-4 mx-auto justify-between ">
          
            <div className="flex flex-col max-w-4xl mx-auto p-3 my-3 gap-4">
              <p className="text-3xl font-bold text-slate-700 ">
                {vehicle.manufacturer} {vehicle.model}
              </p>
              
              <div className="flex gap-3 text-md font-semibold text-slate-700 ">
                <span className="flex gap-1 items-center">
                  <FaHorseHead /> PH-
                  {vehicle.enginecapacity.toLocaleString("en-US")}
                </span>
                
                {"    "}
                {vehicle.vehicletype === "private" ? vehicle.transmission : ""}
                {"  "}
                {vehicle.vehicletype === "private"
                  ? generateRandomEnginePower()
                  : ""}
              </div>
              <div className="flex gap-3 text-md my-3 border-2 max-w-80 h-[50px] justify-between rounded-lg p-2">
                <div className="flex gap-1 items-center" dir="rtl">
                  {vehicle.year}
                  <FaBirthdayCake />
                </div>
                <div className="flex gap-1 items-center" dir="rtl">
                  {vehicle.hand} {"hand"}
                  <FaRegHandPaper />
                </div>
                <div className="flex gap-1 items-center" dir="rtl">
                  {vehicle.mileage.toLocaleString("en-US")}
                  {"KM"}
                  <BsSpeedometer />
                </div>
              </div>
              <p className="flex items-center gap-2 text-slate-600 text-sm mb-5">
                <FaMapMarkerAlt className="text-green-700" />
                {vehicle.areas} - {vehicle.city}
              </p>
              <div className="flex gap-4">
                <div className="flex flex-col justify-center items-center w-full max-w-[180px]">
                  <span className="text-xs">{"previous owner ship"}</span>
                  <div className="bg-red-900 w-full max-w-[180px] text-white text-center p-1 rounded-md">
                    {vehicle.previousownership}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center w-full max-w-[180px]">
                  <span className="text-xs">{"Current owner ship"}</span>
                  <div className="bg-green-900 w-full max-w-[180px] text-white text-center p-1 rounded-md">
                    {vehicle.currentownership}
                  </div>
                </div>
              </div>

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
              <p className="text-slate-800">
                <span className="font-semibold text-black">Description - </span>
                {vehicle.description}
              </p>
            </div>
            <div className="flex flex-col max-w-4xl mx-auto p-3 my-5 gap-4 border-2 rounded-xl h-[160px]">
              <div className="flex gap-3 text-xl font-bold text-slate-700  rounded-lg mx-auto p-2 items-center">
                <div className="flex items-center">
                  {(+vehicle.price).toLocaleString("en-US")}
                  <span className="text-3xl mb-2">₪</span>{" "}
                </div>
                {vehicle.flexible ? (
                  <span className="text-green-500">{"Flexible"}</span>
                ) : (
                  <span className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                    {"None Flexible"}
                  </span>
                )}
              </div>
              <hr className="text-black" />
              <div className="flex gap-3 text-xl font-bold text-slate-700 rounded-lg mx-auto p-2 items-center">
                <div className="flex flex-col items-center ">
                  <CgProfile />
                  <span className="gap-1 text-sm text-blue-500 flex-wrap">
                    {" "}
                    {vehicle.name}{" "}
                  </span>
                </div>
                <div className="flex flex-col items-center ">
                  <SlCallIn />{" "}
                  <span className="gap-1 text-sm text-green-500">
                    {" "}
                    {vehicle.phonenumber}{" "}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mx-auto mt-5 ml-10 w-64">
                {!imageClicked && !contact && (
                  <div className="flex flex-col">
                    <button
                      disabled={!currentUser}
                      onClick={() => {
                        return setContact(true);
                      }}
                      className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 p-3 disabled:opacity-40"
                    >
                      Contact landlord mail
                    </button>
                    {!currentUser ? (
                      <span className="ml-2 text-red-400 ">
                        {" "}
                        you have to login for make mail conversation
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                )}
                {!imageClicked && contact && <Contact listing={vehicle} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
