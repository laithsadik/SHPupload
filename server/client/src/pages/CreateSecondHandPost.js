import { useState } from "react";
import { MdOutlineElectricalServices } from "react-icons/md";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { GiSofa } from "react-icons/gi";
import { MdOutlineSportsTennis } from "react-icons/md";
import { FaComputer } from "react-icons/fa6";
import { FaBabyCarriage } from "react-icons/fa";
import { RiHomeGearFill } from "react-icons/ri";
import { SiSmartthings } from "react-icons/si";
import {
  TbCircleNumber1,
  TbCircleNumber3,
  TbCircleNumber4,
  TbCircleNumber5,
  TbCircleNumber6,
} from "react-icons/tb";
import { TbCircleNumber2 } from "react-icons/tb";

import {
  homeGardenItems,
  computerItems,
  babyChildItems,
  sportItems,
  furnitureItems,
  cellularDevices,
  electricProducts,
} from "../models/SecondHands";

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
export default function CreatSecondHandPost() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [pickSecondHand, setPickSecondHand] = useState(false);
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
    setFormDataSecondHand({
      ...formDataSecondHand,
      [e.target.id]: e.target.value,
    });
    setSelectedArea(e.target.value);
    setErrorArea(false);
    setSelectedCity("select an city"); // Reset city when area changes
  };

  const handleCityChange = (e) => {
    setFormDataSecondHand({
      ...formDataSecondHand,
      [e.target.id]: e.target.value,
    });
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

  const [formDataSecondHand, setFormDataSecondHand] = useState({
    imageUrls: [],
    regulations: false,
    status: "new",
    flexible: false,
  });

  const [selectedSecondHandType, setSelectedSecondHandType] =
    useState("choose secondhand");
  const [selectedModel, setSelectedModel] = useState("choose model");
  const [errorQuantity, setErrorQuantity] = useState(false);
  const [errorProductName, setErrorProductName] = useState(false);
  const handleSecondHandTypeChange = (e) => {
    setSelectedSecondHandType(e.target.value);
    setFormDataSecondHand({
      ...formDataSecondHand,
      [e.target.id]: e.target.value,
    });
    setSelectedModel("choose model");
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    setFormDataSecondHand({
      ...formDataSecondHand,
      [e.target.id]: e.target.value,
    });
  };

  const handleProductNameChange = (e) => {
    if (e.target.value === "") {
      setErrorProductName("The product name is empty");
    } else if (e.target.value.length > 30) {
      setErrorProductName("The product name is more than 30 letters");
    } else {
      setErrorProductName(false);
    }
    setFormDataSecondHand({
      ...formDataSecondHand,
      [e.target.id]: e.target.value,
    });
  };
  ///

  const handleBackClick = () => {
    setLevel(0);
    setIsFirst(false);
    setIsExpanded(true);
    setSelectedSecondHandType("choose secondhand");
    setSelectedModel("choose model");
    setFormDataSecondHand({
      imageUrls: [],
      regulations: false,
      status: "new",
      flexible: false,
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
      setFormDataSecondHand({
        ...formDataSecondHand,
        [e.target.id]: newDescription,
      });
      setDescriptionError(false);
    }
  };

  const handleImageSubmit = () => {
    if (
      files.length > 0 &&
      formDataSecondHand.imageUrls.length + files.length < 7
    ) {
      const promises = [];
      setUploading(true);
      setImageUploadError(false);
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormDataSecondHand({
            ...formDataSecondHand,
            imageUrls: formDataSecondHand.imageUrls.concat(urls),
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
    setFormDataSecondHand({
      ...formDataSecondHand,
      imageUrls: formDataSecondHand.imageUrls.filter((_, i) => i !== index),
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
      formDataSecondHand.descriptionError ||
      errorProductName ||
      errorQuantity ||
      formDataSecondHand.quantity === undefined ||
      formDataSecondHand.productname === undefined
    ) {
      if (formDataSecondHand.productname === undefined) {
        setErrorProductName("you have to fill the product name filed");
      }
      if (formDataSecondHand.quantity === undefined) {
        setErrorQuantity("you have to fill the quantity filed");
      }
      if (formDataSecondHand.productname.length > 30) {
        setErrorProductName("you have to fill less than 30 letters");
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
    setFormDataSecondHand({
      ...formDataSecondHand,
      [e.target.id]: e.target.value,
    });
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
      const res = await fetch("/api/secondhand/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...formDataSecondHand,
          pickSecondHand: pickSecondHand,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/secondhand/${data._id}`);
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
            ? "max-w-3xl w-full h-[620px]"
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
                    setIsFirst("electric");
                    //setPickVehicle("parrots");
                    setPickSecondHand("electric");
                    setLevel(1);
                  }}
                  className="h-36 w-56 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
                >
                  <div className="flex flex-col">
                    <MdOutlineElectricalServices className=" size-20" />
                    <span className="text-sm font-semibold text-slate-500 ml-5">
                      Electric
                    </span>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setIsFirst("cellular");
                    //setPickVehicle("motorcycle");
                    setPickSecondHand("cellular");
                    setLevel(1);
                  }}
                  className="h-36 w-56 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
                >
                  <div className="flex flex-col">
                    <MdOutlinePhoneIphone className=" size-20" />
                    <span className="text-sm font-semibold text-slate-500 ml-4">
                      Cellular
                    </span>
                  </div>
                </div>
              </div>
              {/**/}

              <div className=" flex gap-8 p-4 max-w-2xl mx-auto">
                <div
                  onClick={() => {
                    setIsFirst("furniture");
                    //setPickVehicle("Dogs");
                    setPickSecondHand("furniture");
                    setLevel(1);
                  }}
                  className="h-36 w-40 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
                >
                  <div className="flex flex-col">
                    <GiSofa className=" size-20" />
                    <span className="text-sm font-semibold text-slate-500 ml-3">
                      Furniture
                    </span>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setIsFirst("sport");
                    // setPickVehicle("Cats");
                    setPickSecondHand("sport");
                    setLevel(1);
                  }}
                  className="h-36 w-40 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
                >
                  <div className="flex flex-col">
                    <MdOutlineSportsTennis className=" size-20" />
                    <span className="text-sm font-semibold text-slate-500 ml-4">
                      Sport
                    </span>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setIsFirst("baby");
                    setPickSecondHand("baby");
                    //  setPickVehicle("Horses");
                    setLevel(1);
                  }}
                  className="h-36 w-40 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
                >
                  <div className="flex flex-col">
                    <FaBabyCarriage className=" size-20" />
                    <span className="text-sm font-semibold text-slate-500 ml-2 mt-1">
                      For baby
                    </span>
                  </div>
                </div>
              </div>
              <div className=" flex gap-8 p-4 max-w-2xl mx-auto">
                <div
                  onClick={() => {
                    setIsFirst("computer");
                    setPickSecondHand("computer");
                    //  setPickVehicle("Horses");
                    setLevel(1);
                  }}
                  className="h-36 w-40 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
                >
                  <div className="flex flex-col">
                    <FaComputer className=" size-20" />
                    <span className="text-sm font-semibold text-slate-500 mt-1">
                      Computers
                    </span>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setIsFirst("home");
                    setPickSecondHand("home");
                    //  setPickVehicle("Horses");
                    setLevel(1);
                  }}
                  className="h-36 w-40 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
                >
                  <div className="flex flex-col">
                    <RiHomeGearFill className=" size-20" />
                    <span className="text-sm font-semibold text-slate-500  mt-1">
                      Home, garden
                    </span>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setIsFirst("other");
                    setPickSecondHand("other");
                    //  setPickVehicle("Horses");
                    setLevel(1);
                  }}
                  className="h-36 w-40 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
                >
                  <div className="flex flex-col">
                    <SiSmartthings className=" size-20" />
                    <span className="text-sm font-semibold text-slate-500 ml-4 mt-1 ">
                      Others
                    </span>
                  </div>
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
            <h1 className="text-2xl font-semibold">
              The product I want to sell
            </h1>

            <div className="flex flex-col gap-6">
              {pickSecondHand !== "other" ? (
                <div className="flex flex-col  justify-start gap-1">
                  <label className="font-semibold">
                    <span className="text-red-500">* </span>Category
                  </label>
                  <select
                    id="secondhandcategory"
                    className="border rounded-lg p-3 w-64 h-12 bg-slate-100 font-base"
                    onChange={handleSecondHandTypeChange}
                    value={selectedSecondHandType}
                  >
                    <option key={"500"} value={"choose secondhand"}>
                      {"Choose SecondHand"}
                    </option>
                    {pickSecondHand === "electric" && isFirst
                      ? electricProducts.map((SecondHand, index) => (
                          <option key={index} value={SecondHand}>
                            {SecondHand}
                          </option>
                        ))
                      : pickSecondHand === "cellular" && isFirst
                      ? cellularDevices.map((SecondHand, index) => (
                          <option key={index} value={SecondHand}>
                            {SecondHand}
                          </option>
                        ))
                      : pickSecondHand === "furniture" && isFirst
                      ? furnitureItems.map((SecondHand, index) => (
                          <option key={index} value={SecondHand}>
                            {SecondHand}
                          </option>
                        ))
                      : pickSecondHand === "sport" && isFirst
                      ? sportItems.map((SecondHand, index) => (
                          <option key={index} value={SecondHand}>
                            {SecondHand}
                          </option>
                        ))
                      : pickSecondHand === "baby" && isFirst
                      ? babyChildItems.map((SecondHand, index) => (
                          <option key={index} value={SecondHand}>
                            {SecondHand}
                          </option>
                        ))
                      : pickSecondHand === "computer" && isFirst
                      ? computerItems.map((SecondHand, index) => (
                          <option key={index} value={SecondHand}>
                            {SecondHand}
                          </option>
                        ))
                      : pickSecondHand === "home" && isFirst
                      ? homeGardenItems.map((SecondHand, index) => (
                          <option key={index} value={SecondHand}>
                            {SecondHand}
                          </option>
                        ))
                      : pickSecondHand === "other" && isFirst
                      ? ""
                      : ""}
                  </select>
                </div>
              ) : (
                <div className="flex flex-col  justify-start gap-1">
                  <label className="font-semibold">
                    <span className="text-red-500">* </span>Category
                  </label>
                  <input
                    id="secondhandcategory"
                    value={formDataSecondHand.secondhandcategory}
                    onChange={handleSecondHandTypeChange}
                    type="text"
                    placeholder="enter the category item ..."
                    className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                  />
                </div>
              )}

              {selectedSecondHandType !== "" &&
                selectedSecondHandType !== "choose secondhand" && (
                  <div className="flex flex-col  justify-start gap-1">
                    <label className="font-semibold">
                      <span className="text-red-500">* </span>Sub Category
                    </label>

                    <input
                      id="model"
                      onChange={handleModelChange}
                      value={formDataSecondHand.model}
                      type="text"
                      placeholder="enter the sub category ..."
                      className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                    />
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
            <span>The product I want to sell</span>
          </div>
        )}

        {selectedModel !== "choose model" &&
          selectedModel !== "" &&
          isFirst && (
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
            <h1 className="text-2xl font-semibold">Ad Details</h1>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col my-5  justify-start gap-1">
                <label className="font-semibold">
                  <span className="text-red-500">* </span>Product status
                </label>
                <select
                  id="status"
                  className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                  value={formDataSecondHand.status}
                  onChange={(e) => {
                    setFormDataSecondHand({
                      ...formDataSecondHand,
                      [e.target.id]: e.target.value,
                    });
                  }}
                >
                  <option value="new">New in a Box</option>
                  <option value="likenew">Like New</option>
                  <option value="user">Used</option>
                  <option value="renovation">Renovation</option>
                </select>

                <div className="flex flex-col justify-start gap-1 my-7">
                  <div className="flex flex-col justify-start gap-1 my-1">
                    <label className="font-semibold">
                      <span className="text-red-500">* </span> Product Name
                    </label>
                    <div className="flex flex-col gap-3">
                      <input
                        id="productname"
                        onChange={handleProductNameChange}
                        value={formDataSecondHand.productname}
                        type="text"
                        placeholder="enter maximum 30 letters ..."
                        className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                      />
                      {errorProductName && (
                        <p className="text-red-700 text-lg font-semibold">
                          {errorProductName}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col justify-start gap-1 my-7">
                      <label className="font-semibold">
                        <span className="text-red-500">* </span> Quantity
                      </label>
                      <input
                        id="quantity"
                        type="number"
                        placeholder="enter the quantity ..."
                        className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                        onChange={(e) => {
                          setFormDataSecondHand({
                            ...formDataSecondHand,
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
                        value={formDataSecondHand.quantity}
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
                  Product characteristics
                </span>
                <span className="font-base text-md text-slate-600 ml-1">
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
              SecondHands Sale And Location Details
            </h1>

            <div className="flex  gap-6">
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
                    setFormDataSecondHand({
                      ...formDataSecondHand,
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
                  value={formDataSecondHand.price}
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
                  checked={formDataSecondHand.flexible}
                  onChange={(e) => {
                    setFormDataSecondHand({
                      ...formDataSecondHand,
                      [e.target.id]: e.target.checked,
                    });
                  }}
                />
              </div>
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
                  value={formDataSecondHand.areas}
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
                    value={formDataSecondHand.city}
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
                    !formDataSecondHand.price ||
                    !isNumberOrDouble(formDataSecondHand.price)
                  ) {
                    setErrorPrice("The price value is not valid");
                  }
                  if (
                    !formDataSecondHand.areas ||
                    !formDataSecondHand.city ||
                    formDataSecondHand.areas === "select an area" ||
                    formDataSecondHand.city === "select an city"
                  ) {
                    if (
                      !formDataSecondHand.areas ||
                      formDataSecondHand.areas === "select an area"
                    ) {
                      setErrorArea("Pick your area");
                    } else {
                      setErrorArea("Pick your city");
                    }
                  } else if (
                    !(
                      !formDataSecondHand.price ||
                      !isNumberOrDouble(formDataSecondHand.price)
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
            <span>SecondHand Sale And Location Details</span>
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
              {formDataSecondHand.imageUrls.length > 0 &&
                formDataSecondHand.imageUrls.map((url, index) => (
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
                  formDataSecondHand.imageUrls.length === 0
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
                  value={formDataSecondHand.name}
                  onChange={(e) => {
                    if (e.target.value === "" || !isValidName(e.target.value)) {
                      setErrorName(true);
                    } else {
                      setErrorName(false);
                    }
                    setFormDataSecondHand({
                      ...formDataSecondHand,
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
                  value={formDataSecondHand.phonenumber}
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
                  setFormDataSecondHand({
                    ...formDataSecondHand,
                    regulations: e.target.checked,
                  });
                }}
                checked={formDataSecondHand.regulations}
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
                    formDataSecondHand.name &&
                    formDataSecondHand.phonenumber &&
                    formDataSecondHand.regulations
                  ) {
                    handleSubmit();
                    //setIsFifth(false);
                  } else if (
                    !formDataSecondHand.name ||
                    !formDataSecondHand.phonenumber
                  ) {
                    if (!formDataSecondHand.name) {
                      setErrorName(true);
                    }
                    if (!formDataSecondHand.phonenumber) {
                      setErrorPhone(true);
                    }
                  }
                  if (!formDataSecondHand.regulations) {
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
