import { useEffect, useState } from "react";
import { LiaCarSideSolid } from "react-icons/lia";
import { PiMotorcycleFill } from "react-icons/pi";
import { GiScooter } from "react-icons/gi";
import {
  TbCircleNumber1,
  TbCircleNumber3,
  TbCircleNumber4,
  TbCircleNumber5,
  TbCircleNumber6,
} from "react-icons/tb";
import { TbCircleNumber2 } from "react-icons/tb";
import {
  carManufacturers,
  carModels,
  carYearModels,
  scooterManufacturers,
  scooterYearModels,
  scooterModels,
  motorcycleModels,
  motorcycleManufacturers,
  motorcycleYearModels,
} from "../models/Cars";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ColorSwitcher from "../components/ColorSwitcher";
import { AiOutlineCheckCircle } from "react-icons/ai";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function UpdateVehicle() {
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [pickVehicle, setPickVehicle] = useState(false);
  const [isFirst, setIsFirst] = useState(false);
  const [isSecond, setIsSecond] = useState(false);
  const [isThird, setIsThird] = useState(false);
  const [isForth, setIsForth] = useState(false);
  const [isFifth, setIsFifth] = useState(false);
  const [selectedModel, setSelectedModel] = useState("choose model");
  const [selectedYear, setSelectedYear] = useState("choose year");
  const [description, setDescription] = useState("");
  const [count, setCount] = useState(0);
  const [selectedArea, setSelectedArea] = useState("select an area");
  const [selectedCity, setSelectedCity] = useState("select an city");
  const [files, setFiles] = useState({});
  const [selectedColors, setSelectedColors] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorArea, setErrorArea] = useState(false);
  const [errorEngineCapacity, setErrorEngineCapacity] = useState(false);
  const [errorMileage, setErrorMileage] = useState(false);
  const [errorColor, setErrorColor] = useState(false);
  const [errorPrice, setErrorPrice] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorRegulation, setErrorRegulation] = useState(false);
  const [level, setLevel] = useState(1);
  const [formData, setFormData] = useState({
    imageUrls: [],
    withOutCheck: false,
    monthgettingontheroad: "January",
    monthtest: "January",
    yeartest: "2000",
    hand: "1",
    currentownership: "company",
    previousownership: "company",
    regulations: false,
    transmission: "automatic",
    enginetype: "gazoline",
    disable: false,
  });

  useEffect(() => {
    setIsFirst(true);
    const fetchVehicle = async () => {
      const vehicleId = params.vehicleId;

      const res = await fetch(
        `/api/vehicle/getVehicle/${vehicleId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        console.log(data.message);
      } else {
        setFormData(data);
        setCount(0);
        setDescription(data.description);
        setPickVehicle(data.vehicletype);
        setSelectedManufacturer(data.manufacturer);
        setSelectedYear(data.year);
        setSelectedModel(data.model);
        setSelectedColors(data.color);
        setSelectedArea(data.areas);
        setSelectedCity(data.city);
        setFiles(data.imageUrls);
      }
    };
    fetchVehicle();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetColor = (color) => {
    setFormData({ ...formData, color: color });
    setErrorColor(false);
  };
  const handleAreaChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setSelectedArea(e.target.value);
    setErrorArea(false);
    setSelectedCity("select an city"); // Reset city when area changes
  };

  const handleCityChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setSelectedCity(e.target.value);
    setErrorArea(false);
    console.log(selectedCity);
  };
  const toggleSize = () => {
    if (isFirst) {
      handleBackClick();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const [selectedManufacturer, setSelectedManufacturer] = useState(
    "choose manufacturer"
  );

  const handleManufacturerChange = (e) => {
    setSelectedManufacturer(e.target.value);
    setSelectedModel("choose model");
    setSelectedYear("choose year");
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    setSelectedYear("choose year");
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleBackClick = () => {
    setLevel(0);
    setIsFirst(false);
    setIsExpanded(true);
    setErrorEngineCapacity(false);
    setSelectedManufacturer("choose manufacturer");
    setSelectedModel("choose model");
    setSelectedYear("choose year");
    setSelectedColors([]);
    setFormData({ imageUrls: [], withOutCheck: false });
  };
  const [descriptionError, setDescriptionError] = useState(false);
  const handleDescription = (e) => {
    const newDescription = e.target.value;
    if (newDescription.length > 400) {
      setDescriptionError(true);
    } else {
      setDescription(newDescription);
      setCount(newDescription.length);
      setFormData({
        ...formData,
        [e.target.id]: newDescription,
      });
      setDescriptionError(false);
    }
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && formData.imageUrls.length + files.length < 7) {
      const promises = [];
      setUploading(true);
      setImageUploadError(false);
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
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
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
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

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
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
  const doorOptions = [
    { value: "1", label: "1 door" },
    { value: "2", label: "2 doors" },
    { value: "3", label: "3 doors" },
    { value: "4", label: "4 doors" },
    { value: "5", label: "5 doors" },
    { value: "6", label: "6 doors" },
    { value: "7", label: "7 doors" },
    { value: "8", label: "8 doors" },
    { value: "9", label: "9 doors" },
    { value: "10", label: "10 doors" },
    { value: "more", label: "More than 10 doors" },
  ];
  const ownershipOptions = [
    { value: "company", label: "Company" },
    { value: "private", label: "Private" },
    { value: "license", label: "License" },
  ];
  const startYear = 2000; // Start year for the range
  const currentYear = new Date().getFullYear(); // Current year

  // Generate an array of years from startYear to currentYear
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index
  );

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
      !formData.color ||
      formData.descriptionError ||
      !formData.mileage ||
      errorMileage
    ) {
      if (!formData.color) {
        setErrorColor(true);
      }
      if (!formData.mileage) {
        setErrorMileage(true);
      }
    } else {
      setIsFirst(false);
      setIsSecond(false);
      setIsThird(true);
      setLevel(3);
    }
  };

  const changeColor = (colorValue) => {
    setSelectedColors(colorValue);
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
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
      const res = await fetch(
        `/api/vehicle/update/${params.vehicleId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...formData,
            vehicletype: pickVehicle,
            userRef: currentUser._id,
          }),
        }
      );

      const data = await res.json();

      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/vehicle/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto p-5 mt-10">
      <div
        className={`hidden border-2 border-slate-300 shadow-lg bg-slate-200 h-14 justify-start p-2 cursor-pointer transition-all duration-500 mx-auto rounded-xl font-light ${
          isExpanded && !isSecond && !isThird && !isForth && !isFifth
            ? "max-w-3xl w-full h-80"
            : "max-w-3xl w-full"
        }`}
        onClick={toggleSize}
      >
        {isExpanded && !isSecond && !isThird && !isForth && !isFifth ? (
          <div className="font-bold text-xl flex flex-col mx-auto gap-8">
            <h1 className="ml-3">What will we post today</h1>
            <div className=" flex gap-8 p-4 max-w-2xl mx-auto">
              <div
                onClick={() => {
                  setIsFirst("private");
                  setPickVehicle("private");
                  setLevel(1);
                }}
                className="h-36 w-56 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
              >
                <div className="flex flex-col">
                  <LiaCarSideSolid className=" size-20" />
                  <span className="text-sm font-semibold text-slate-500 ml-4">
                    Private
                  </span>
                </div>
              </div>
              <div
                onClick={() => {
                  setIsFirst("motorcycle");
                  setPickVehicle("motorcycle");
                  setLevel(1);
                }}
                className="h-36 w-56 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
              >
                <div className="flex flex-col">
                  <PiMotorcycleFill className=" size-20" />
                  <span className="text-sm font-semibold text-slate-500 ml-1">
                    Motorcycle
                  </span>
                </div>
              </div>
              <div
                onClick={() => {
                  setIsFirst("scooter");
                  setPickVehicle("scooter");
                  setLevel(1);
                }}
                className="h-36 w-56 rounded-lg items-center flex justify-center border-2 border-slate-400 bg-slate-100 "
              >
                <div className="flex flex-col">
                  <GiScooter className=" size-20" />
                  <span className="text-sm font-semibold text-slate-500 ml-4">
                    Scooter
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
            <h1 className="text-2xl font-semibold">Type of vehicle</h1>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col  justify-start gap-1">
                <label className="font-semibold">
                  <span className="text-red-500">* </span>manufacturer
                </label>
                <select
                  id="manufacturer"
                  className="border rounded-lg p-3 w-64 h-12 bg-slate-100 font-base"
                  onChange={handleManufacturerChange}
                  value={selectedManufacturer}
                >
                  <option key={"500"} value={"choose manufacturer"}>
                    {"Choose manufacturer"}
                  </option>
                  {pickVehicle === "private" && isFirst
                    ? carManufacturers.map((manufacturer, index) => (
                        <option key={index} value={manufacturer}>
                          {manufacturer}
                        </option>
                      ))
                    : pickVehicle === "motorcycle" && isFirst
                    ? motorcycleManufacturers.map((manufacturer, index) => (
                        <option key={index} value={manufacturer}>
                          {manufacturer}
                        </option>
                      ))
                    : pickVehicle === "scooter" && isFirst
                    ? scooterManufacturers.map((manufacturer, index) => (
                        <option key={index} value={manufacturer}>
                          {manufacturer}
                        </option>
                      ))
                    : ""}
                </select>
              </div>
              {selectedManufacturer !== "choose manufacturer" && (
                <div className="flex flex-col  justify-start gap-1">
                  <label className="font-semibold">
                    <span className="text-red-500">* </span>model
                  </label>
                  <select
                    id="model"
                    className="border rounded-lg p-3 w-64 h-12 bg-slate-100 font-base"
                    onChange={handleModelChange}
                    value={selectedModel}
                  >
                    <option key={"500"} value={"choose model"}>
                      {"Choose model"}
                    </option>
                    {pickVehicle === "private"
                      ? carModels[selectedManufacturer].map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))
                      : pickVehicle === "motorcycle"
                      ? motorcycleModels[selectedManufacturer].map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))
                      : pickVehicle === "scooter"
                      ? scooterModels[selectedManufacturer].map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))
                      : ""}
                  </select>
                </div>
              )}
              {selectedModel !== "choose model" && (
                <div className="flex flex-col justify-start gap-1">
                  <label className="font-semibold">
                    <span className="text-red-500">*</span> Year
                  </label>
                  <select
                    id="year"
                    className="border rounded-lg p-3 w-64 h-12 bg-slate-100 font-base"
                    value={selectedYear}
                    onChange={handleYearChange}
                  >
                    <option key={"500"} value={"choose year"}>
                      {"Choose year"}
                    </option>
                    {pickVehicle === "private"
                      ? carYearModels[selectedManufacturer][selectedModel].map(
                          (year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          )
                        )
                      : pickVehicle === "motorcycle"
                      ? motorcycleYearModels[selectedManufacturer][
                          selectedModel
                        ].map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))
                      : pickVehicle === "scooter"
                      ? scooterYearModels[selectedManufacturer][
                          selectedModel
                        ].map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))
                      : ""}
                  </select>
                </div>
              )}
              {(pickVehicle === "scooter" ||
                pickVehicle === "motorcycle" ||
                pickVehicle === "private") &&
              isFirst ? (
                <div className="flex flex-col justify-start gap-1">
                  <label className="font-semibold">
                    <span className="text-red-500">*</span> Engine capacity
                  </label>
                  <input
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        [e.target.id]: e.target.value,
                      });

                      if (isNumberOrDouble(e.target.value)) {
                        setErrorEngineCapacity(false);
                      } else {
                        setErrorEngineCapacity(true);
                      }
                    }}
                    type="number"
                    id="enginecapacity"
                    placeholder="PH..."
                    className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                    value={formData.enginecapacity}
                  />
                  {errorEngineCapacity && (
                    <p className="text-red-700 text-lg font-semibold">
                      {"You have to fill the Engine capacity field"}
                    </p>
                  )}
                </div>
              ) : (
                ""
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
            <span>Type of vehicle</span>
          </div>
        )}

        {selectedYear !== "choose year" && isFirst && (
          <div className="flex items-center justify-between w-full" dir="rtl">
            <button
              onClick={() => {
                if (!formData.enginecapacity) {
                  setErrorEngineCapacity(true);
                } else if (!errorEngineCapacity) {
                  setIsFirst(false);
                  setIsSecond(true);
                  setLevel(2);
                }
              }}
              className="bg-slate-500 text-white p-3 m-5
              rounded-lg uppercase hover:opacity-80 disabled:opacity-50"
            >
              Continue
            </button>
            <button
              onClick={handleBackClick}
              className="hidden bg-slate-500 text-white p-3 m-5
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
            <h1 className="text-2xl font-semibold">Vehicle Details</h1>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col  justify-start gap-1">
                <label className="font-semibold">
                  <span className="text-red-500">* </span>Color Vehicle
                </label>
                <ColorSwitcher
                  handleSetColor={handleSetColor}
                  changeColor={changeColor}
                  colorValues={selectedColors}
                />
              </div>
              {errorColor && (
                <p className="text-red-700 text-lg font-semibold">
                  {"You have to pick a color"}
                </p>
              )}
              <div className="flex flex-col my-5  justify-start gap-1">
                <label className="font-semibold">
                  <span className="text-red-500">* </span> A month of getting on
                  the road
                </label>
                <select
                  id="monthgettingontheroad"
                  className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                  value={formData.monthgettingontheroad}
                  onChange={(e) => {
                    setFormData({ ...formData, [e.target.id]: e.target.value });
                  }}
                >
                  {months.map((month, index) => (
                    <option key={index} value={month}>
                      {index + 1}-{month}
                    </option>
                  ))}
                </select>
                <div className="flex my-12 justify-start gap-1">
                  <label className="font-semibold">
                    <span className="text-red-500">* </span> Without test
                  </label>
                  <input
                    type="checkbox"
                    id="withouttest"
                    className="w-4 mt-0.5"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        withOutCheck: e.target.checked,
                      });
                    }}
                    checked={formData.withOutCheck}
                  />
                </div>
                <div className="flex flex-col justify-start gap-1">
                  <label className="font-semibold">
                    <span className="text-red-500">* </span> test until
                  </label>
                  <div className="flex gap-3 items-center">
                    <select
                      disabled={formData.withOutCheck}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          [e.target.id]: e.target.value,
                        });
                      }}
                      id="monthtest"
                      value={formData.monthtest}
                      className="border rounded-lg p-3 w-48 h-12 mt-2 bg-slate-100 font-base disabled:opacity-50"
                    >
                      {months.map((month, index) => (
                        <option key={index} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      disabled={formData.withOutCheck}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          [e.target.id]: e.target.value,
                        });
                      }}
                      value={formData.yeartest}
                      id="yeartest"
                      className="border rounded-lg p-3 w-48 h-12 mt-2 bg-slate-100 font-base disabled:opacity-50"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col my-10 justify-start gap-1">
                  <label className="font-semibold">
                    <span className="text-red-500">* </span> Hand
                  </label>
                  <select
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        [e.target.id]: e.target.value,
                      });
                    }}
                    value={formData.hand || "1"}
                    id="hand"
                    className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                  >
                    {doorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col my-4 justify-start gap-1">
                  <label className="font-semibold">
                    <span className="text-red-500">* </span>Current Ownership
                  </label>
                  <select
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        [e.target.id]: e.target.value,
                      });
                    }}
                    value={formData.currentownership}
                    id="currentownership"
                    className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                  >
                    {ownershipOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col my-4 justify-start gap-1">
                  <label className="font-semibold">
                    <span className="text-red-500">* </span>Previous ownership
                  </label>
                  <select
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        [e.target.id]: e.target.value,
                      });
                    }}
                    value={formData.previousownership}
                    id="previousownership"
                    className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                  >
                    {ownershipOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col my-4 justify-start gap-1">
                  <label className="font-semibold">
                    <span className="text-red-500">* </span>Mileage
                  </label>
                  <input
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        [e.target.id]: e.target.value,
                      });
                      if (isNumberOrDouble(e.target.value)) {
                        setErrorMileage(false);
                      } else {
                        setErrorMileage(true);
                      }
                    }}
                    value={formData.mileage}
                    id="mileage"
                    type="number"
                    placeholder="KM..."
                    className="border rounded-lg p-3 w-64 h-12 mt-2 bg-slate-100 font-base"
                  />
                  {errorMileage && (
                    <p className="text-red-700 text-lg font-semibold">
                      {"You have to put the KM"}
                    </p>
                  )}
                </div>
                {pickVehicle === "private" && (
                  <div className="flex flex-col my-4 justify-start gap-1">
                    <label htmlFor="transmission" className="font-semibold">
                      <span className="text-red-500">* </span> Transmission:
                    </label>
                    <select
                      id="transmission"
                      value={formData.transmission}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          [e.target.id]: e.target.value,
                        });
                      }}
                      className="border rounded-lg p-3 w-64 h-12 bg-slate-100 font-base"
                    >
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                )}
                {pickVehicle === "private" && (
                  <div className="flex flex-col my-4 justify-start gap-1">
                    <label className="font-semibold">
                      <span className="text-red-500">* </span> Engine type:
                    </label>
                    <select
                      id="enginetype"
                      value={formData.enginetype}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          [e.target.id]: e.target.value,
                        });
                      }}
                      className="border rounded-lg p-3 w-64 h-12 bg-slate-100 font-base"
                    >
                      <option value="gazoline">Gazoline</option>
                      <option value="diesel">Diesel</option>
                    </select>
                  </div>
                )}
                <span className="font-bold text-2xl text-slate-700 my-8">
                  Vehicle characteristics
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
                      setFormData({
                        ...formData,
                        [e.target.id]: e.target.checked,
                      });
                    }}
                    checked={formData.disable}
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
            <span>Vehicle Details</span>
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
            <h1 className="text-2xl font-semibold">Private car sale details</h1>

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
                    setFormData({ ...formData, price: e.target.value });
                    if (
                      isNumberOrDouble(e.target.value) &&
                      e.target.value !== ""
                    ) {
                      setErrorPrice(false);
                    }
                  }}
                  value={formData.price}
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
                  checked={formData.flexible}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
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
                  value={formData.areas}
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
                    value={formData.city}
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
                  if (!formData.price || !isNumberOrDouble(formData.price)) {
                    setErrorPrice("The price value is not valid");
                  } else if (
                    !formData.areas ||
                    !formData.city ||
                    formData.areas === "select an area" ||
                    formData.city === "select an city"
                  ) {
                    if (
                      !formData.areas ||
                      formData.areas === "select an area"
                    ) {
                      setErrorArea("Pick your area");
                    } else {
                      setErrorArea("Pick your city");
                    }
                  } else {
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
            <span>Private car sale details</span>
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
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
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
                if (!files.length || files.length === 0) {
                  setImageUploadError("You have to pick one image at least");
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
                  value={formData.name}
                  onChange={(e) => {
                    if (e.target.value === "" || !isValidName(e.target.value)) {
                      setErrorName(true);
                    } else {
                      setErrorName(false);
                    }
                    setFormData({
                      ...formData,
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
                  value={formData.phonenumber}
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
                  setFormData({
                    ...formData,
                    regulations: e.target.checked,
                  });
                }}
                checked={formData.regulations}
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
                    formData.name &&
                    formData.phonenumber &&
                    formData.regulations
                  ) {
                    handleSubmit();
                    //setIsFifth(false);
                  }
                  if (!formData.name || !formData.phonenumber) {
                    if (!formData.name) {
                      setErrorPhone(true);
                    }
                    if (!formData.phonenumber) {
                      setErrorName(true);
                    }
                  }
                  if (!formData.regulations) {
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
              <p className="text-red-700 text-sm">{error}</p>
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
