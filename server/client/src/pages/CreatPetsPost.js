import { useState } from "react";
import { GiParrotHead } from "react-icons/gi";
import { GiAnglerFish } from "react-icons/gi";
import { GiSittingDog } from "react-icons/gi";
import { FaCat } from "react-icons/fa6";
import { GiHorseHead } from "react-icons/gi";
import {
  TbCircleNumber1,
  TbCircleNumber3,
  TbCircleNumber4,
  TbCircleNumber5,
  TbCircleNumber6,
} from "react-icons/tb";
import { TbCircleNumber2 } from "react-icons/tb";

import {
  fishTypes,
  dogTypes,
  catTypes,
  horseTypes,
  sheepTypes,
  chickenTypes,
  parrotsTypes,
} from "../models/Pets";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineCheckCircle } from "react-icons/ai";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
export default function CreatPetsPost() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [pickPet, setPickPet] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFirst, setIsFirst] = useState(false);
  const [isSecond, setIsSecond] = useState(false);
  const [isThird, setIsThird] = useState(false);
  const [isForth, setIsForth] = useState(false);
  const [isFifth, setIsFifth] = useState(false);
  const [description, setDescription] = useState("");
  const [count, setCount] = useState(0);
  const [selectedArea, setSelectedArea] = useState("select an area");
  // eslint-disable-next-line no-unused-vars
  const [selectedCity, setSelectedCity] = useState("select an city");
  const [files, setFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorArea, setErrorArea] = useState(false);
  const [errorPrice, setErrorPrice] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorRegulation, setErrorRegulation] = useState(false);
  const [level, setLevel] = useState(0);

  const handleAreaChange = (e) => {
    setFormDataPet({ ...formDataPet, [e.target.id]: e.target.value });
    setSelectedArea(e.target.value);
    setErrorArea(false);
    setSelectedCity("select an city"); // Reset city when area changes
  };

  const handleCityChange = (e) => {
    setFormDataPet({ ...formDataPet, [e.target.id]: e.target.value });
    setSelectedCity(e.target.value);
    setErrorArea(false);
  };
  const toggleSize = () => {
    if (isFirst) {
      handleBackClick();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  ///

  const [formDataPet, setFormDataPet] = useState({
    imageUrls: [],
    regulations: false,
    age: "perday",
    disable: false,
    flexible: false,
    sex: "male",
  });

  const [selectedPetType, setSelectedPetType] = useState("choose pet");
  const [selectedAction, setSelectedAction] = useState("choose action");
  const [errorAge, setErrorAge] = useState(false);
  const [errorQuantity, setErrorQuantity] = useState(false);
  const handlePetTypeChange = (e) => {
    setSelectedPetType(e.target.value);
    setFormDataPet({ ...formDataPet, [e.target.id]: e.target.value });
    setSelectedAction("choose action");
  };

  const handleActionChange = (e) => {
    setSelectedAction(e.target.value);
    setFormDataPet({ ...formDataPet, [e.target.id]: e.target.value });
  };
  ///

  const handleBackClick = () => {
    setLevel(0);
    setIsFirst(false);
    setIsExpanded(true);
    setSelectedPetType("choose pet");
    setSelectedAction("choose action");
    setFormDataPet({
      imageUrls: [],
      regulations: false,
      age: "perday",
      disable: false,
      flexible: false,
      sex: "male",
    });
  };
  const [descriptionError, setDescriptionError] = useState(false);
  const handleDescription = (e) => {
    const newDescription = e.target.value;
    if (newDescription.length > 400) {
      setDescriptionError(true);
    } else {
      setDescription(newDescription);
      setCount(newDescription.length);
      setFormDataPet({
        ...formDataPet,
        [e.target.id]: newDescription,
      });
      setDescriptionError(false);
    }
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && formDataPet.imageUrls.length + files.length < 7) {
      const promises = [];
      setUploading(true);
      setImageUploadError(false);
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormDataPet({
            ...formDataPet,
            imageUrls: formDataPet.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setError(false);
          setUploading(false);
        })
        .catch((err) => {
          console.log(err);
          setUploading(false);
          setImageUploadError(
            "You can only upload 6 images with max size 2mb per image" + err
          );
        });
    } else {
      console.log("nothing");
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormDataPet({
      ...formDataPet,
      imageUrls: formDataPet.imageUrls.filter((_, i) => i !== index),
    });
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (err) => {
          reject(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const areas = [
    "Jerusalem District",
    "Northern District",
    "Haifa District",
    "Central District",
    "Tel Aviv District",
    "Southern District",
    "Judea and Samaria Area",
  ];
  const city = {
    "Jerusalem District": [
      "Jerusalem",
      "Abu Ghosh",
      "Mevaseret Zion",
      "Beit Shemesh",
      "Givat Zeev",
    ],
    "Northern District": [
      "Haifa",
      "Nazareth",
      "Acre (Akko)",
      "Tiberias",
      "Nahariya",
    ],
    "Haifa District": [
      "Haifa",
      "Hadera",
      "Nesher",
      "Tirat Carmel",
      "Zikhron Ya'akov",
    ],
    "Central District": [
      "Tel Aviv",
      "Petah Tikva",
      "Rishon LeZion",
      "Ramat Gan",
      "Herzliya",
    ],
    "Tel Aviv District": [
      "Tel Aviv",
      "Bat Yam",
      "Holon",
      "Ramat Hasharon",
      "Givatayim",
    ],
    "Southern District": [
      "Beersheba",
      "Ashdod",
      "Ashkelon",
      "Netivot",
      "Sderot",
    ],
    "Judea and Samaria Area": [
      "Ramallah",
      "Bethlehem",
      "Jericho",
      "Nablus",
      "Hebron",
    ],
  };

  function isNumberOrDouble(value) {
    if (value === "") {
      return false;
    }
    if (value.charAt(0) === "-") {
      return false;
    }
    // Regular expression to match numbers or double numbers
    const regex = /^[1-9]\d*(\.\d+)?$/;
    return regex.test(value);
  }

  const handleClickedButton = () => {
    if (
      formDataPet.descriptionError ||
      errorAge ||
      errorQuantity ||
      formDataPet.quantity === undefined ||
      formDataPet.ageper === undefined
    ) {
      if (formDataPet.ageper === undefined) {
        setErrorAge("you have to fill the age filed");
      }
      if (formDataPet.quantity === undefined) {
        setErrorQuantity("you have to fill the quantity filed");
      }
    } else {
      setIsFirst(false);
      setIsSecond(false);
      setIsThird(true);
      setLevel(3);
    }
  };

  function isValidName(name) {
    const regex = /^[A-Za-z][A-Za-z0-9]*$/;
    return regex.test(name);
  }
  function isValidPhoneNumber(phoneNumber) {
    const regex = /^(054|053|052|055|050)\d{7}$/;
    return regex.test(phoneNumber);
  }
  const [errorPhone, setErrorPhone] = useState(false);

  const handlePhoneNumber = (e) => {
    setFormDataPet({ ...formDataPet, [e.target.id]: e.target.value });
    if (isValidPhoneNumber(e.target.value)) {
      setErrorPhone(false);
    } else {
      setErrorPhone(true);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("http://localhost:3000/api/pet/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...formDataPet,
          pickPet: pickPet,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/pet/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto p-5 mt-10">
      <div
        className={` border-2 border-slate-300 shadow-lg bg-slate-200 h-14 flex justify-start p-2 cursor-pointer transition-all duration-500 mx-auto rounded-xl font-light ${
          isExpanded && !isSecond && !isThird && !isForth && !isFifth
            ? "max-w-3xl w-full h-[530px]"
            : "max-w-3xl w-full"
        }`}
        onClick={toggleSize}
      >
        {isExpanded && !isSecond && !isThird && !isForth && !isFifth ? (
          <div className="font-bold text-xl flex flex-col mx-auto gap-8">
            <h1 className="ml-3">What will we post today</h1>
            <div className=" flex flex-col gap-2 max-w-2xl mx-auto">
              <div className=" flex gap-8 p-4 max-w-2xl mx-auto">
                <div
                  onClick={() => {
                    setIsFirst("parrots");
                    //setPickVehicle("parrots");
                    setPickPet("parrots");
                    setLevel(1);
                  }}
                  className="h-36 w-56 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
                >
                  <div className="flex flex-col">
                    <GiParrotHead className=" size-20" />
                    <span className="text-sm font-semibold text-slate-500 ml-1">
                      Parrots
                    </span>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setIsFirst("fish");
                    //setPickVehicle("motorcycle");
                    setPickPet("fish");
                    setLevel(1);
                  }}
                  className="h-36 w-56 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
                >
                  <div className="flex flex-col">
                    <GiAnglerFish className=" size-20" />
                    <span className="text-sm font-semibold text-slate-500 ml-7">
                      Fish
                    </span>
                  </div>
                </div>
              </div>
              {/**/}

              <div className=" flex gap-8 p-4 max-w-2xl mx-auto">
                <div
                  onClick={() => {
                    setIsFirst("dogs");
                    //setPickVehicle("Dogs");
                    setPickPet("dogs");
                    setLevel(1);
                  }}
                  className="h-36 w-40 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
                >
                  <div className="flex flex-col">
                    <GiSittingDog className=" size-20" />
                    <span className="text-sm font-semibold text-slate-500 ml-4">
                      Dogs
                    </span>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setIsFirst("cats");
                    // setPickVehicle("Cats");
                    setPickPet("cats");
                    setLevel(1);
                  }}
                  className="h-36 w-40 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
                >
                  <div className="flex flex-col">
                    <FaCat className=" size-20" />
                    <span className="text-sm font-semibold text-slate-500 ml-4">
                      Cats
                    </span>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setIsFirst("horses");
                    setPickPet("horses");
                    //  setPickVehicle("Horses");
                    setLevel(1);
                  }}
                  className="h-36 w-40 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
                >
                  <div className="flex flex-col">
                    <GiHorseHead className=" size-20" />
                    <span className="text-sm font-semibold text-slate-500 ml-4">
                      Horses
                    </span>
                  </div>
                </div>
              </div>
              <div className=" flex gap-8 p-4 max-w-2xl mx-auto">
                <div
                  onClick={() => {
                    setIsFirst("sheeps");
                    setPickPet("sheeps");
                    //setPickVehicle("Farm");
                    setLevel(1);
                  }}
                  className="h-12 w-28 rounded-lg items-center flex justify-center border-2 p-1 border-slate-400 bg-slate-100 "
                >
                  <span className="text-sm text-nowrap font-semibold text-slate-500">
                    Sheeps
                  </span>
                </div>
                <div
                  onClick={() => {
                    setIsFirst("chickens");
                    setPickPet("chickens");
                    //setPickVehicle("Farm");
                    setLevel(1);
                  }}
                  className="h-12 w-28 rounded-lg items-center flex justify-center border-2 p-1 border-slate-400 bg-slate-100 "
                >
                  <span className="text-sm text-nowrap font-semibold text-slate-500">
                    Chickens
                  </span>
                </div>
                <div className=" opacity-30 h-12 w-28 rounded-lg items-center flex justify-center border-2 p-1 border-slate-400 bg-slate-100 ">
                  <span className="text-sm text-nowrap font-semibold text-slate-500">
                    reptiles
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              {level === 0 ? (
                <TbCircleNumber1 className="size-6 ml-3" />
              ) : (
                <AiOutlineCheckCircle className="size-6 text-green-500 ml-3" />
              )}
              <span>What will we post today</span>
            </div>
          </div>
        )}
      </div>
      {/*           isFirst is choosed               */}
      <div
        className={` border-2 border-slate-300 shadow-lg bg-slate-200 h-14 gap-16 flex justify-start flex-col p-5 cursor-pointer transition-all duration-500 mx-auto rounded-xl font-light ${
          isFirst ? "max-w-3xl w-full h-full" : "max-w-3xl w-full"
        }`}
      >
        {/*    xxxxxxxxxxxxxxxx      */}

        {isFirst ? (
          <div className="flex flex-col gap-14">
            <h1 className="text-2xl font-semibold">Ad details</h1>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col  justify-start gap-1">
                <label className="font-semibold">
                  <span className="text-red-500">* </span>Pet Type
                </label>
                <select
                  id="pettype"
                  className="border rounded-lg p-3 w-64 h-12 bg-slate-100 font-base"
                  onChange={handlePetTypeChange}
                  value={selectedPetType}
                >
                  <option key={"500"} value={"choose pet"}>
                    {"Choose pet"}
                  </option>
                  {pickPet === "parrots" && isFirst
                    ? parrotsTypes.map((pet, index) => (
                        <option key={index} value={pet}>
                          {pet}
                        </option>
                      ))
                    : pickPet === "fish" && isFirst
                    ? fishTypes.map((pet, index) => (
                        <option key={index} value={pet}>
                          {pet}
                        </option>
                      ))
                    : pickPet === "dogs" && isFirst
                    ? dogTypes.map((pet, index) => (
                        <option key={index} value={pet}>
                          {pet}
                        </option>
                      ))
                    : pickPet === "cats" && isFirst
                    ? catTypes.map((pet, index) => (
                        <option key={index} value={pet}>
                          {pet}
                        </option>
                      ))
                    : pickPet === "horses" && isFirst
                    ? horseTypes.map((pet, index) => (
                        <option key={index} value={pet}>
                          {pet}
                        </option>
                      ))
                    : pickPet === "sheeps" && isFirst
                    ? sheepTypes.map((pet, index) => (
                        <option key={index} value={pet}>
                          {pet}
                        </option>
                      ))
                    : pickPet === "chickens" && isFirst
                    ? chickenTypes.map((pet, index) => (
                        <option key={index} value={pet}>
                          {pet}
                        </option>
                      ))
                    : ""}
                </select>
              </div>
              {selectedPetType !== "choose pet" && (
                <div className="flex flex-col  justify-start gap-1">
                  <label className="font-semibold">
                    <span className="text-red-500">* </span>Action
                  </label>
                  <select
                    id="action"
                    className="border rounded-lg p-3 w-64 h-12 bg-slate-100 font-base"
                    onChange={handleActionChange}
                    value={selectedAction}
                  >
                    <option key={"500"} value={"choose action"}>
                      {"Choose action"}
                    </option>
                    <option value="sale">For Sale</option>
                    <option value="giveaway">Give Away</option>
                    <option value="babysitting">Babysitting</option>
                    <option value="waslost">Was Lost</option>
                    <option value="pension">Pension</option>
                    <option value="available">Available</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 ">
            {level <= 1 ? (
              <TbCircleNumber2 className="size-6 " />
            ) : (
              <AiOutlineCheckCircle className="size-6 text-green-500 " />
            )}
            <span>Ad details</span>
          </div>
        )}

        {selectedAction !== "choose action" && isFirst && (
          <div className="flex items-center justify-between w-full" dir="rtl">
            <button
              onClick={() => {
                setIsFirst(false);
                setIsSecond(true);
                setLevel(2);
              }}
              className="bg-slate-500 text-white p-3 m-5
              rounded-lg uppercase hover:opacity-80 disabled:opacity-50"
            >
              Continue
            </button>
            <button
              onClick={handleBackClick}
              className="bg-slate-500 text-white p-3 m-5
               rounded-lg uppercase hover:opacity-80 disabled:opacity-50"
            >
              Back
            </button>
          </div>
        )}
      </div>
      {/*                      isSecond is clicked                         */}
      <div
        className={` border-2 border-slate-300 shadow-lg bg-slate-200 h-14 gap-16 flex justify-start flex-col p-5 cursor-pointer transition-all duration-500 mx-auto rounded-xl font-light ${
          isSecond ? "max-w-3xl w-full h-full" : "max-w-3xl w-full"
        }`}
      >
        {/*    xxxxxxxxxxxxxxxx      */}
        {isSecond ? (
          <div className="flex flex-col gap-14 ">
            <h1 className="text-2xl font-semibold">More Details</h1>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col my-5  justify-start gap-1">
                <label className="font-semibold">
                  <span className="text-red-500">* </span>Age
                </label>
                <select
                  id="age"
                  className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                  value={formDataPet.age}
                  onChange={(e) => {
                    setFormDataPet({
                      ...formDataPet,
                      [e.target.id]: e.target.value,
                    });
                  }}
                >
                  <option value="perday">Age per day</option>
                  <option value="permonth">Age per month</option>
                  <option value="peryear">Age per year</option>
                </select>
                <input
                  id="ageper"
                  type="number"
                  placeholder="enter the age ..."
                  className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                  onChange={(e) => {
                    setFormDataPet({
                      ...formDataPet,
                      [e.target.id]: e.target.value,
                    });
                    if (
                      isNumberOrDouble(e.target.value) &&
                      e.target.value !== ""
                    ) {
                      setErrorAge(false);
                    } else {
                      setErrorAge(true);
                    }
                  }}
                  value={formDataPet.ageper}
                />
                {errorAge && (
                  <p className="text-red-700 text-lg font-semibold">
                    {"The age is not correct value"}
                  </p>
                )}

                <div className="flex flex-col justify-start gap-1 my-7">
                  <div className="flex flex-col justify-start gap-1 my-1">
                    <label className="font-semibold">
                      <span className="text-red-500">* </span> Sex
                    </label>
                    <div className="flex gap-3 items-center">
                      <select
                        onChange={(e) => {
                          setFormDataPet({
                            ...formDataPet,
                            [e.target.id]: e.target.value,
                          });
                        }}
                        id="sex"
                        value={formDataPet.sex}
                        className="border rounded-lg p-3 w-48 h-12 mt-2 bg-slate-100 font-base disabled:opacity-50"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female </option>
                        <option value="mix">Mix </option>
                      </select>
                    </div>
                    <div className="flex flex-col justify-start gap-1 my-1">
                      <label className="font-semibold">
                        <span className="text-red-500">* </span> Quantity
                      </label>
                      <input
                        id="quantity"
                        type="number"
                        placeholder="enter the quantity ..."
                        className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                        onChange={(e) => {
                          setFormDataPet({
                            ...formDataPet,
                            [e.target.id]: e.target.value,
                          });
                          if (
                            isNumberOrDouble(e.target.value) &&
                            e.target.value !== ""
                          ) {
                            setErrorQuantity(false);
                          } else {
                            setErrorQuantity(true);
                          }
                        }}
                        value={formDataPet.quantity}
                      />
                    </div>
                    {errorQuantity && (
                      <p className="text-red-700 text-lg font-semibold">
                        {"The quantity is not correct value"}
                      </p>
                    )}
                  </div>
                </div>

                <span className="font-bold text-2xl text-slate-700 my-2">
                  Pet characteristics
                </span>
                <div className="flex  justify-start gap-1">
                  <label className="font-semibold">
                    Adapted for the disabled
                  </label>
                  <input
                    type="checkbox"
                    id="disable"
                    className="w-4 mt-0.5"
                    onChange={(e) => {
                      setFormDataPet({
                        ...formDataPet,
                        [e.target.id]: e.target.checked,
                      });
                    }}
                    checked={formDataPet.disable}
                  />
                </div>
                <span className="font-base text-md text-slate-600 mt-12 ml-1">
                  Additional details (up to 400 characters)
                </span>
                <label className="font-semibold ml-1">{count}/400</label>
                <textarea
                  type="text"
                  placeholder="Additional details"
                  className="border p-3 rounded-lg"
                  id="description"
                  value={description}
                  onChange={handleDescription}
                />
                <span className="font-xs text-sm text-slate-500 ml-1">
                  Is no need to add a phone number as part of the description,
                  later in the process there is a designated area for that
                </span>
                {descriptionError && (
                  <p className="text-red-700 text-lg font-semibold">
                    {"You overload the 400 leters"}
                  </p>
                )}
              </div>
              <div className="flex justify-between" dir="rtl">
                <button
                  onClick={handleClickedButton}
                  className="bg-slate-500 text-white p-3 m-5
              rounded-lg uppercase hover:opacity-80 disabled:opacity-50"
                >
                  Continue
                </button>
                <button
                  onClick={() => {
                    setIsFirst(true);
                    setIsSecond(false);
                    setLevel(1);
                  }}
                  className="bg-slate-500 text-white p-3 m-5
               rounded-lg uppercase hover:opacity-80 disabled:opacity-50"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 ">
            {level <= 2 ? (
              <TbCircleNumber3 className="size-6" />
            ) : (
              <AiOutlineCheckCircle className="size-6 text-green-500" />
            )}
            <span>More Details</span>
          </div>
        )}
      </div>
      <div
        className={` border-2 border-slate-300 shadow-lg bg-slate-200 h-14 gap-16 flex justify-start flex-col p-5 cursor-pointer transition-all duration-500 mx-auto rounded-xl font-light ${
          isThird ? "max-w-3xl w-full h-full" : "max-w-3xl w-full"
        }`}
      >
        {isThird ? (
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">
              Pets Sale And Location Details
            </h1>

            <div className="flex  gap-6">
              {formDataPet.action && formDataPet.action === "sale" ? (
                <>
                  <div className="flex justify-start gap-2 items-center">
                    <label className="font-semibold">
                      <span className="text-red-500">* </span>Price
                    </label>
                    <input
                      id="price"
                      type="text"
                      placeholder="price in ₪..."
                      className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                      onChange={(e) => {
                        setFormDataPet({
                          ...formDataPet,
                          price: e.target.value,
                        });
                        if (
                          isNumberOrDouble(e.target.value) &&
                          e.target.value !== ""
                        ) {
                          setErrorPrice(false);
                        } else {
                          setErrorPrice(true);
                        }
                      }}
                      value={formDataPet.price}
                    />
                  </div>
                  <div className="flex my-12 justify-start gap-1">
                    <label className="font-semibold">
                      <span className="text-red-500"> </span> flexible
                    </label>
                    <input
                      type="checkbox"
                      id="flexible"
                      className="w-4 mt-0.5"
                      checked={formDataPet.flexible}
                      onChange={(e) => {
                        setFormDataPet({
                          ...formDataPet,
                          [e.target.id]: e.target.checked,
                        });
                      }}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            {errorPrice && (
              <p className="text-red-700 text-lg font-semibold">
                {"The price is not correct value"}
              </p>
            )}
            <div className="flex flex-col ml-1 gap-6">
              <div className="flex flex-col ml-1 gap-1">
                <label className="font-semibold" htmlFor="areas">
                  {" "}
                  <span className="text-red-500">* </span>Select an area:
                </label>
                <select
                  id="areas"
                  value={formDataPet.areas}
                  className="border rounded-lg p-3 w-64 h-12 bg-slate-100 font-base"
                  onChange={handleAreaChange}
                >
                  <option key={"500"} value={"select an area"}>
                    {"select an area"}
                  </option>
                  {areas.map((area, index) => (
                    <option key={index} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              {selectedArea !== "select an area" && (
                <div className="flex flex-col ml-1 gap-1">
                  <label className="font-semibold" htmlFor="city">
                    <span className="text-red-500">* </span>Select City:
                  </label>
                  <select
                    id="city"
                    className="border rounded-lg p-3 w-64 h-12 bg-slate-100 font-base"
                    value={formDataPet.city}
                    onChange={handleCityChange}
                  >
                    <option key={"500"} value={"select an city"}>
                      {"select an city"}
                    </option>
                    {city[selectedArea].map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {errorArea && (
                <p className="text-red-700 text-lg font-semibold">
                  {errorArea}
                </p>
              )}
            </div>
            <div className="flex justify-between" dir="rtl">
              <button
                onClick={() => {
                  if (
                    (!formDataPet.price ||
                      !isNumberOrDouble(formDataPet.price)) &&
                    formDataPet.action &&
                    formDataPet.action === "sale"
                  ) {
                    setErrorPrice("The price value is not valid");
                  }
                  if (
                    !formDataPet.areas ||
                    !formDataPet.city ||
                    formDataPet.areas === "select an area" ||
                    formDataPet.city === "select an city"
                  ) {
                    if (
                      !formDataPet.areas ||
                      formDataPet.areas === "select an area"
                    ) {
                      setErrorArea("Pick your area");
                    } else {
                      setErrorArea("Pick your city");
                    }
                  } else if (
                    !(
                      (!formDataPet.price ||
                        !isNumberOrDouble(formDataPet.price)) &&
                      formDataPet.action &&
                      formDataPet.action === "sale"
                    )
                  ) {
                    setErrorArea(false);
                    setErrorPrice(false);
                    setIsThird(false);
                    setIsForth(true);
                    setLevel(4);
                  }
                }}
                className="bg-slate-500 text-white p-3 m-5
              rounded-lg uppercase hover:opacity-80 disabled:opacity-50"
              >
                Continue
              </button>
              <button
                onClick={() => {
                  setIsThird(false);
                  setIsSecond(true);
                  setLevel(2);
                }}
                className="bg-slate-500 text-white p-3  ml-2 m-5
               rounded-lg uppercase hover:opacity-80 disabled:opacity-50 w-20"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 ">
            {level <= 3 ? (
              <TbCircleNumber4 className="size-6" />
            ) : (
              <AiOutlineCheckCircle className="size-6 text-green-500" />
            )}
            <span>Pet Sale And Location Details</span>
          </div>
        )}
      </div>
      <div
        className={` border-2 border-slate-300 shadow-lg bg-slate-200 h-14 gap-16 flex justify-start flex-col p-5 cursor-pointer transition-all duration-500 mx-auto rounded-xl font-light ${
          isForth ? "max-w-3xl w-full h-full" : "max-w-3xl w-full"
        }`}
      >
        {isForth ? (
          <div className="flex flex-col flex-1 gap-4">
            <h1 className="text-2xl font-semibold">Adding pictures</h1>

            <p className="font-semibold">
              Images:
              <span className="font-normal text-green-600 ml-2">
                First image will be the cover {"{max upload 6-image}"}
              </span>
            </p>
            <div className="flex gap-4">
              <input
                onChange={(e) => {
                  setFiles(e.target.files);
                }}
                className="p-3 border border-gray-300 rounded w-full"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                disabled={uploading}
                onClick={handleImageSubmit}
                className="p-3  text-green-700 border border-gray-700 rounded uppercase hover:shadow-lg disabled:opacity-50"
              >
                {uploading ? "uploading..." : "Upload"}
              </button>
            </div>
            <p className="text-red-700 text-md font-semibold">
              {imageUploadError && !uploading && imageUploadError}
            </p>
            <div className="flex flex-col ">
              {formDataPet.imageUrls.length > 0 &&
                formDataPet.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="flex justify-around p-3 border items-center"
                  >
                    <img
                      src={url}
                      alt="listing img"
                      className=" w-32 h-32 object-contain rounded-lg "
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => {
                        handleRemoveImage(index);
                      }}
                      className=" disabled:opacity-50 border border-slate-400 p-3 text-red-700 rounded-lg uppercase hover: opacity-80"
                    >
                      Delete
                    </button>
                  </div>
                ))}
            </div>
            <button
              disabled={uploading}
              onClick={() => {
                if (
                  !files.length ||
                  files.length === 0 ||
                  formDataPet.imageUrls.length === 0
                ) {
                  setImageUploadError("You have to pick one image at least and upload it.");
                } else {
                  setIsForth(false);
                  setIsFifth(true);
                  setLevel(5);
                }
              }}
              className="p-3 max-w-sm w-full mx-auto bg-slate-700 text-white rounded-lg uppercase hover: opacity-90 disabled:opacity-50"
            >
              {"Continue to create post"}
            </button>
            <button
              disabled={uploading}
              onClick={() => {
                setIsForth(false);
                setIsThird(true);
                setLevel(3);
              }}
              className="p-3 max-w-20 bg-slate-700 text-white rounded-xl uppercase hover: opacity-90 disabled:opacity-50 mx-auto"
            >
              Back
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 ">
            {level <= 4 ? (
              <TbCircleNumber5 className="size-6" />
            ) : (
              <AiOutlineCheckCircle className="size-6 text-green-500 " />
            )}
            <span>Adding pictures</span>
          </div>
        )}
      </div>
      <div
        className={` border-2 border-slate-300 shadow-lg bg-slate-200 h-14 gap-16 flex justify-start flex-col p-5 cursor-pointer transition-all duration-500 mx-auto rounded-xl font-light ${
          isFifth ? "max-w-3xl w-full h-full" : "max-w-3xl w-full"
        }`}
      >
        {isFifth ? (
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">Contact Information</h1>
            <p className="mt-3">
              Just before the ad is published, we would like to get to know you
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex flex-col my-4 justify-start gap-1">
                <label className="font-semibold">
                  <span className="text-red-500">* </span>Your name
                </label>
                <input
                  id="name"
                  value={formDataPet.name}
                  onChange={(e) => {
                    if (e.target.value === "" || !isValidName(e.target.value)) {
                      setErrorName(true);
                    } else {
                      setErrorName(false);
                    }
                    setFormDataPet({
                      ...formDataPet,
                      [e.target.id]: e.target.value,
                    });
                  }}
                  type="text"
                  placeholder="your name"
                  className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                />
                {errorName && (
                  <p className="text-red-700 text-md font-semibold">
                    {"Name is not valid"}
                  </p>
                )}
              </div>
              <div className="flex flex-col my-4 justify-start gap-1">
                <label className="font-semibold">
                  <span className="text-red-500">* </span>Phone Number
                </label>
                <input
                  id="phonenumber"
                  value={formDataPet.phonenumber}
                  onChange={handlePhoneNumber}
                  type="number"
                  placeholder="your name"
                  className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                />
              </div>
              {errorPhone && (
                <p className="text-red-700 text-md font-semibold">
                  {"Phone number is not valid"}
                </p>
              )}
            </div>
            <div className="flex my-12 justify-start gap-1">
              <label className="font-semibold">
                <span className="text-red-500">* </span> Just read and confirm
                the regulations
              </label>
              <input
                type="checkbox"
                id="regulations"
                className=" w-4 mt-0.5"
                onChange={(e) => {
                  if (e.target.checked) {
                    setErrorRegulation(false);
                  }
                  setFormDataPet({
                    ...formDataPet,
                    regulations: e.target.checked,
                  });
                }}
                checked={formDataPet.regulations}
              />
              {errorRegulation && (
                <p className="text-red-700 text-md font-semibold">
                  {"You have to accept the regulation"}
                </p>
              )}
            </div>
            <div className="flex justify-between" dir="rtl">
              <button
                disabled={loading}
                onClick={() => {
                  if (
                    !errorPhone &&
                    !errorName &&
                    formDataPet.name &&
                    formDataPet.phonenumber &&
                    formDataPet.regulations
                  ) {
                    handleSubmit();
                    //setIsFifth(false);
                  } else if (!formDataPet.name || !formDataPet.phonenumber) {
                    if (!formDataPet.name) {
                      setErrorName(true);
                    }
                    if (!formDataPet.phonenumber) {
                      setErrorPhone(true);
                    }
                  }
                  if (!formDataPet.regulations) {
                    setErrorRegulation(true);
                  }
                }}
                className="bg-slate-500 text-white p-3 mr-5 w-32 font-semibold
              rounded-lg uppercase hover:opacity-80 disabled:opacity-50"
              >
                {loading ? "Creating the post..." : "Post"}
              </button>
              <button
                onClick={() => {
                  setIsForth(true);
                  setIsFifth(false);
                }}
                className="bg-slate-500 text-white p-3 mr-3 h-12
               rounded-lg uppercase hover:opacity-80 disabled:opacity-50"
              >
                Back
              </button>
            </div>
            {error && !loading && (
              <p className="text-red-700 text-lg font-semibold">{error}</p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 ">
            {level <= 5 ? (
              <TbCircleNumber6 className="size-6" />
            ) : (
              <AiOutlineCheckCircle className="size-6 text-green-500 " />
            )}
            <span>Contact Information</span>
          </div>
        )}
      </div>
    </div>
  );
}
