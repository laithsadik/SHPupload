import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import {
  homeGardenItems,
  computerItems,
  babyChildItems,
  sportItems,
  furnitureItems,
  cellularDevices,
  electricProducts,
} from "../models/SecondHands";
import {
  fishTypes,
  dogTypes,
  catTypes,
  horseTypes,
  sheepTypes,
  chickenTypes,
  parrotsTypes,
} from "../models/Pets";
import {
  carManufacturers,
  carModels,
  scooterManufacturers,
  scooterModels,
  motorcycleModels,
  motorcycleManufacturers,
} from "../models/Cars";
import VehicleItem from "../components/VehicleItem";
import PetItem from "../components/PetItem";
import SecondHandItem from "../components/SecondHandItem";
export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "create_at",
    order: "desc",
  });
  const [sidebarvehicle, setSidebarvehicle] = useState({
    searchTerm: "",
    pickVehicle: false,
    manufacturer: "choose manufacturer",
    model: "choose model",
    sort: "create_at",
    order: "desc",
  });
  const [sidebarPet, setSidebarPet] = useState({
    imageUrls: [],
    age: "perday",
    disable: false,
    flexible: false,
    pickPet: false,
    pettype: "choose pet",
    action: "choose action",
    sort: "create_at",
    order: "desc",
  });
  const [sidebarSecondHand, setSidebarSecondHand] = useState({
    imageUrls: [],
    flexible: false,
    status: "new",
    pickSecondHand: false,
    secondhandcategory: "choose secondhand",
    model: "choose model",
    sort: "create_at",
    order: "desc",
  });
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order1" || e.target.id === "sort_order2") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
      setSidebarvehicle({ ...sidebarvehicle, sort, order });
      setSidebarPet({ ...sidebarPet, sort, order });
      setSidebarSecondHand({ ...sidebarSecondHand, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    ///listings///
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    ///vehicles///
    urlParams.set("pickVehicle", sidebarvehicle.pickVehicle);
    urlParams.set("manufacturer", sidebarvehicle.manufacturer);
    urlParams.set("model", sidebarvehicle.model);
    ///pets///
    urlParams.set("pickPet", sidebarPet.pickPet);
    urlParams.set("pettype", sidebarPet.pettype);
    urlParams.set("action", sidebarPet.action);
    ///secondhands
    urlParams.set("pickSecondHand", sidebarSecondHand.pickSecondHand);
    urlParams.set("secondhandcategory", sidebarSecondHand.secondhandcategory);
    urlParams.set("modelSecondHand", sidebarSecondHand.model);
    ///
    if (pick === "listings") {
      urlParams.set("sort", sidebardata.sort);
      urlParams.set("order", sidebardata.order);
    } else if (pick === "vehicles") {
      urlParams.set("sort", sidebarvehicle.sort);
      urlParams.set("order", sidebarvehicle.order);
    } else if (pick === "pets") {
      urlParams.set("sort", sidebarPet.sort);
      urlParams.set("order", sidebarPet.order);
    } else if (pick === "secondhands") {
      urlParams.set("sort", sidebarSecondHand.sort);
      urlParams.set("order", sidebarSecondHand.order);
    }
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const [mergedList, setMergedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [pets, setPets] = useState([]);
  const [secondhands, setSecondHands] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState(
    "choose manufacturer"
  );
  const [selectedModel, setSelectedModel] = useState("choose model");
  const [pickVehicle, setPickVehicle] = useState(false);
  const [pick, setPick] = useState("categories");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    ///
    const manufacturerFromUrl = urlParams.get("manufacturer");
    const modelFromUrl = urlParams.get("model");
    const pickVehicleFromUrl = urlParams.get("pickVehicle");
    if (
      manufacturerFromUrl ||
      modelFromUrl ||
      pickVehicleFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarvehicle({
        searchTerm: searchTermFromUrl || "",
        pickVehicle: pickVehicleFromUrl || false,
        manufacturer: manufacturerFromUrl || "choose manufacturer",
        model: modelFromUrl || "choose model",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const pickPetFromUrl = urlParams.get("pickPet");
    const petTypeFromUrl = urlParams.get("pettype");
    const actionFromUrl = urlParams.get("action");

    if (
      searchTermFromUrl ||
      pickPetFromUrl ||
      petTypeFromUrl ||
      actionFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarPet({
        searchTerm: searchTermFromUrl || "",
        pickPet: pickPetFromUrl || false,
        pettype: petTypeFromUrl || "choose pet",
        action: actionFromUrl || "choose action",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    ///

    const pickSecondHandFromUrl = urlParams.get("pickSecondHand");
    const secondhandcategoryFromUrl = urlParams.get("secondhandcategory");
    const modelSecondHandFromUrl = urlParams.get("modelsecondhand");
    if (
      searchTermFromUrl ||
      pickSecondHandFromUrl ||
      secondhandcategoryFromUrl ||
      modelSecondHandFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarSecondHand({
        searchTerm: searchTermFromUrl || "",
        pickSecondHand: pickSecondHandFromUrl || false,
        secondhandcategory: secondhandcategoryFromUrl || "choose secondhand",
        model: modelSecondHandFromUrl || "choose model",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    ///local storage
    const fromString = localStorage.getItem("from");
    if (fromString === "vehicles") {
      localStorage.removeItem("from");
      return setPick("vehicles");
    } else if (fromString === "listings") {
      localStorage.removeItem("from");
      return setPick("listings");
    } else if (fromString === "pets") {
      localStorage.removeItem("from");
      return setPick("pets");
    } else if (fromString === "secondhands") {
      localStorage.removeItem("from");
      return setPick("secondhands");
    }

    ///local stotage

    let dataLength, dataVLength, dataPLength, dataSHLenght;

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("xxx");
      dataLength = data.length;
      if (data.length > 2 && pick === "listings") {
        console.log("xxx");
        setShowMore(true);
      } else if (data.length < 3 && pick === "listings") {
        setShowMore(false);
      }
      setListings(data);
    };

    const fetchVehicles = async () => {
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/vehicle/get?${searchQuery}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dataVLength = data.length;
      if (data.length > 2 && pick === "vehicles") {
        setShowMore(true);
      } else if (data.length < 3 && pick === "vehicles") {
        setShowMore(false);
      } else if (dataLength && data.length + dataLength < 3) {
        setShowMore(false);
      }
      setVehicles(data);
    };

    const fetchPets = async () => {
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/pet/get?${searchQuery}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      dataPLength = data.length;
      if (data.length > 2 && pick === "pets") {
        setShowMore(true);
      } else if (data.length < 3 && pick === "pets") {
        setShowMore(false);
      } else if (
        dataLength &&
        dataVLength &&
        data.length + dataLength + dataVLength < 3
      ) {
        setShowMore(false);
      }
      setPets(data);
    };

    const fetchSecondHands = async () => {
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/secondhand/get?${searchQuery}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      dataSHLenght = data.length;
      if (data.length > 2 && pick === "secondhands") {
        setShowMore(true);
      } else if (data.length < 3 && pick === "secondhands") {
        setShowMore(false);
      } else if (
        dataLength &&
        dataVLength &&
        dataPLength &&
        data.length + dataLength + dataVLength + dataPLength < 3
      ) {
        setShowMore(false);
      }
      setSecondHands(data);
      setLoading(false);
    };

    const getAllPosts = async () => {
      if (pick === "categories") {
        await fetchListings();
        await fetchVehicles();
        await fetchPets();
        await fetchSecondHands();
        if (pick === "categories") {
          if (
            dataLength > 0 ||
            dataVLength > 0 ||
            dataPLength > 0 ||
            dataSHLenght > 0
          ) {
            console.log("xxxx");
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } else if (pick === "listings") {
        setVehicles([]);
        setPets([]);
        setSecondHands([]);
        await fetchListings();
        setLoading(false);
      } else if (pick === "vehicles") {
        setLoading(true);
        setShowMore(false);
        setListings([]);
        setPets([]);
        setSecondHands([]);
        await fetchVehicles();
        setLoading(false);
      } else if (pick === "pets") {
        setShowMore(false);
        setLoading(true);
        setVehicles([]);
        setListings([]);
        setSecondHands([]);
        await fetchPets();
        setLoading(false);
      } else if (pick === "secondhands") {
        setShowMore(false);
        setLoading(true);
        setVehicles([]);
        setListings([]);
        setPets([]);
        await fetchSecondHands();
      }
    };

    getAllPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pick, window.location.search]);

  useEffect(() => {
    if (
      (vehicles.length > 0 &&
        listings.length > 0 &&
        pets.length > 0 &&
        secondhands.length > 0) ||
      (listings.length > 0 && pets.length > 0 && secondhands.length > 0) ||
      (vehicles.length > 0 && listings.length > 0 && pets.length > 0) ||
      (listings.length > 0 && vehicles.length > 0 && secondhands.length > 0) ||
      (pets.length > 0 && vehicles.length > 0 && secondhands.length > 0) ||
      (listings.length > 0 && pets.length > 0) ||
      (vehicles.length > 0 && pets.length > 0) ||
      (vehicles.length > 0 && listings.length > 0) ||
      (vehicles.length > 0 && secondhands.length > 0) ||
      (listings.length > 0 && secondhands.length > 0) ||
      (pets.length > 0 && secondhands.length > 0)
    ) {
      console.log(vehicles, "cccs");
      console.log(listings.length, vehicles.length, pets.length, "ccc");
      const tempMergedList = [
        ...vehicles,
        ...listings,
        ...pets,
        ...secondhands,
      ];
      //console.log(tempMergedList);
      tempMergedList.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setMergedList(tempMergedList);
    } else if (vehicles.length > 0) {
      console.log("xxx");
      setMergedList(vehicles);
    } else if (listings.length > 0) {
      console.log("xxx");
      setMergedList(listings);
    } else if (pets.length > 0) {
      console.log("xxx");
      setMergedList(pets);
    } else if (secondhands.length > 0) {
      console.log("xxx");
      setMergedList(secondhands);
    } else {
      setMergedList([]);
    }
  }, [vehicles, listings, pets, secondhands]);

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const numberOfVehicles = vehicles.length;
    const numberOfPets = pets.length;
    const numberOfSecondHand = secondhands.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(window.location.search);

    if (pick === "categories") {
      console.log("xxxxxxxxxxxxxxxxxxxxxxxx");
      if (
        startIndex >= numberOfVehicles &&
        startIndex >= numberOfPets &&
        startIndex >= numberOfSecondHand
      ) {
        console.log(startIndex);
        urlParams.set("startIndex", startIndex);
      } else if (
        startIndex < numberOfVehicles &&
        numberOfVehicles >= numberOfPets &&
        numberOfVehicles >= numberOfSecondHand
      ) {
        console.log(numberOfVehicles);
        urlParams.set("startIndex", numberOfVehicles);
      } else if (
        startIndex <= numberOfSecondHand &&
        numberOfSecondHand >= numberOfPets &&
        numberOfVehicles <= numberOfSecondHand
      ) {
        urlParams.set("startIndex", numberOfSecondHand);
      } else {
        console.log(numberOfPets);
        urlParams.set("startIndex", numberOfPets);
      }
      const searchQuery = urlParams.toString();
      const resp = await fetch(`/api/listing/get?${searchQuery}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const datal = await resp.json();

      setListings([...listings, ...datal]);
      ////////////////////////////////////////////////////////////////
      const res = await fetch(`/api/vehicle/get?${searchQuery}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      setVehicles([...vehicles, ...data]);
      ///////////////////////////////////////////////////////////////////////////////////
      const respet = await fetch(`/api/pet/get?${searchQuery}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const datap = await respet.json();

      setPets([...pets, ...datap]);
      /////////////////////////////////////////////////////////////////
      const resSH = await fetch(`/api/secondhand/get?${searchQuery}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const dataSH = await resSH.json();
      if (dataSH.length + datal.length + datap.length + data.length < 3) {
        console.log("Xxx");
        setShowMore(false);
      }
      setSecondHands([...secondhands, ...dataSH]);
      ////////////////////////////////////////////////////
    } else if (pick === "listings") {
      urlParams.set("startIndex", startIndex);
      const searchQuery = urlParams.toString();
      console.log(startIndex);
      const res = await fetch(`/api/listing/get?${searchQuery}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.length < 3) {
        setShowMore(false);
      }
      setListings([...listings, ...data]);
    } else if (pick === "vehicles") {
      urlParams.set("startIndex", numberOfVehicles);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/vehicle/get?${searchQuery}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.length < 3) {
        setShowMore(false);
      }
      setVehicles([...vehicles, ...data]);
    } else if (pick === "pets") {
      urlParams.set("startIndex", numberOfPets);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/pet/get?${searchQuery}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.length < 3) {
        setShowMore(false);
      }
      setPets([...pets, ...data]);
    } else if (pick === "secondhands") {
      urlParams.set("startIndex", numberOfSecondHand);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/secondhand/get?${searchQuery}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.length < 3) {
        setShowMore(false);
      }
      setSecondHands([...secondhands, ...data]);
    }
  };

  const handlePickVehicle = (e) => {
    setSidebarvehicle({
      ...sidebarvehicle,
      [e.target.id]: e.target.value,
      model: "choose model",
      manufacturer: "choose manufacturer",
    });
    setPickVehicle(e.target.value);
    setSelectedManufacturer("choose manufacturer");
    setSelectedModel("choose model");
  };
  const handleManufacturerChange = (e) => {
    setSidebarvehicle({
      ...sidebarvehicle,
      manufacturer: e.target.value,
      model: "choose model",
    });
    setSelectedManufacturer(e.target.value);
    setSelectedModel("choose model");
  };
  const handleModelChange = (e) => {
    setSidebarvehicle({ ...sidebarvehicle, [e.target.id]: e.target.value });
    setSelectedModel(e.target.value);
  };

  const [selectedModelSecondHand, setSelectedModelSecondHand] =
    useState("choose model");
  const handleModelChangeSecondHand = (e) => {
    setSidebarSecondHand({
      ...sidebarSecondHand,
      [e.target.id]: e.target.value,
    });
    console.log(selectedModelSecondHand, sidebarSecondHand.model);
    setSelectedModelSecondHand(e.target.value);
  };

  const handlePick = (e) => {
    if (e.target.value === "categories") {
      setPick(e.target.value);
      navigate(`/search?searchTerm=${sidebardata.searchTerm.toString()}`);
    } else {
      setPick(e.target.value);
    }
  };

  const [selectedPetType, setSelectedPetType] = useState("choose pet");
  const [selectedAction, setSelectedAction] = useState("choose action");
  const [pickPet, setPickPet] = useState(false);
  const handlePickPet = (e) => {
    setSidebarPet({
      ...sidebarPet,
      [e.target.id]: e.target.value,
      pettype: "choose pet",
      action: "choose action",
    });
    setSelectedPetType("choose pet");
    setSelectedAction("choose action");
    setPickPet(e.target.value);
  };
  const handlePetTypeChange = (e) => {
    setSelectedPetType(e.target.value);
    setSidebarPet({ ...sidebarPet, [e.target.id]: e.target.value });
    setSelectedAction("choose action");
  };
  const handleActionChange = (e) => {
    setSelectedAction(e.target.value);
    setSidebarPet({ ...sidebarPet, [e.target.id]: e.target.value });
  };
  const [pickSecondHand, setPickSecondHand] = useState(false);
  const [selectedSecondHandType, setSelectedSecondHandType] =
    useState("choose secondhand");

  const handlePickSecondHand = (e) => {
    setSidebarSecondHand({
      ...sidebarSecondHand,
      [e.target.id]: e.target.value,
      secondhandcategory: "choose secondhand",
      model: "choose model",
    });
    setSelectedSecondHandType("choose secondhand");
    setSelectedModelSecondHand("choose model");
    setPickSecondHand(e.target.value);
  };
  const handleSecondHandTypeChange = (e) => {
    setSelectedSecondHandType(e.target.value);
    setSidebarSecondHand({
      ...sidebarSecondHand,
      [e.target.id]: e.target.value,
    });
    setSelectedModelSecondHand("choose model");
  };
  return (
    <div className="flex flex-col md:flex-row ">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold text-lg">
              Search term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2 my-4">
            <label className="whitespace-nowrap font-bold text-slate-700 text-md">
              Pick To Search:
            </label>
            <select
              onChange={handlePick}
              value={pick}
              className="border rounded-lg p-3 w-64 h-12  font-base"
            >
              <option value="categories">Categories</option>
              <option value="listings">Listings</option>
              <option value="vehicles">Vehicles</option>
              <option value="pets">Pets</option>
              <option value="secondhands">Second-Hand Products</option>
            </select>
          </div>
          <span
            className={`${
              pick !== "listings" ? "hidden" : ""
            } text-xl font-bold text-slate-600`}
          >
            Listings:
          </span>
          <div
            className={`${
              pick !== "listings" ? "hidden" : "flex"
            } flex-col gap-8`}
          >
            <div className="flex gap-2 flex-wrap items-center">
              <label className="font-semibold">Type:</label>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="all"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.type === "all"}
                />
                <span>Rent & Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.type === "rent"}
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  onChange={handleChange}
                  checked={sidebardata.type === "sale"}
                  className="w-5"
                />
                <span>Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <label className="font-semibold">Amenities:</label>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.parking}
                />
                <span>Parking</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.furnished}
                />
                <span>furnished</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold">Sort</label>
              <select
                onChange={handleChange}
                id="sort_order1"
                className="border rounded-lg p-3"
                defaultValue={"created_at_desc"}
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
          </div>

          <span
            className={` ${
              pick !== "vehicles" ? "hidden" : ""
            } text-xl font-bold text-slate-600`}
          >
            Vehicles:
          </span>

          <div
            className={` ${
              pick !== "vehicles" ? "hidden" : "flex"
            }   gap-5 flex-col items-center `}
          >
            <div className="flex w-full justify-start gap-3.5 items-center">
              <label className="font-semibold">Type vehicle:</label>
              <select
                id="pickVehicle"
                onChange={handlePickVehicle}
                value={pickVehicle}
                className="border rounded-lg p-3 w-64 h-12  font-base"
              >
                <option value="choose vehicle">choose vehicle</option>
                <option value="private">Private</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="scooter">Scooter</option>
              </select>
            </div>
            <div className="flex items-center w-full justify-start gap-1">
              <label className="font-semibold">Manufacturer:</label>
              <select
                id="manufacturer"
                className="border rounded-lg p-3 w-64 h-12 font-base"
                onChange={handleManufacturerChange}
                value={selectedManufacturer}
              >
                <option key={"500"} value={"choose manufacturer"}>
                  {"Choose manufacturer"}
                </option>
                {pickVehicle === "private"
                  ? carManufacturers.map((manufacturer, index) => (
                      <option key={index} value={manufacturer}>
                        {manufacturer}
                      </option>
                    ))
                  : pickVehicle === "motorcycle"
                  ? motorcycleManufacturers.map((manufacturer, index) => (
                      <option key={index} value={manufacturer}>
                        {manufacturer}
                      </option>
                    ))
                  : pickVehicle === "scooter"
                  ? scooterManufacturers.map((manufacturer, index) => (
                      <option key={index} value={manufacturer}>
                        {manufacturer}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
            {/*xxxxxxxxxxxx*/}
            <div className="flex items-center gap-1 w-full justify-start">
              <label className="font-semibold">Model:</label>
              <select
                id="model"
                className="border rounded-lg p-3 w-64 h-12 font-base"
                onChange={handleModelChange}
                value={selectedModel}
              >
                <option key={"500"} value={"choose model"}>
                  {"Choose model"}
                </option>
                {pickVehicle === "private" &&
                selectedManufacturer !== "choose manufacturer"
                  ? carModels[selectedManufacturer].map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))
                  : pickVehicle === "motorcycle" &&
                    selectedManufacturer !== "choose manufacturer"
                  ? motorcycleModels[selectedManufacturer].map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))
                  : pickVehicle === "scooter" &&
                    selectedManufacturer !== "choose manufacturer"
                  ? scooterModels[selectedManufacturer].map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
            {/*xxxxxxxxx*/}

            <div className="flex items-center gap-5 w-full justify-start">
              <label className="font-semibold">Sort:</label>
              <select
                onChange={handleChange}
                id="sort_order2"
                className="border rounded-lg p-3  w-64 h-12"
                defaultValue={"created_at_desc"}
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
          </div>
          {/*                     */}
          <div
            className={` ${
              pick !== "pets" ? "hidden" : "flex"
            }   gap-5 flex-col items-center `}
          >
            <div className="flex w-full justify-start gap-3.5 items-center">
              <label className="font-semibold">Pick Animal:</label>
              <select
                id="pickPet"
                onChange={handlePickPet}
                value={pickPet}
                className="border rounded-lg p-3 w-64 h-12  font-base"
              >
                <option value="choose animal">choose animal type</option>
                <option value="parrots">Parrots</option>
                <option value="fish">Fish</option>
                <option value="dogs">Dogs</option>
                <option value="cats">Cats</option>
                <option value="horses">Horses</option>
                <option value="sheeps">Sheeps</option>
                <option value="chickens">Chickens</option>
              </select>
            </div>
            <div className="flex items-center w-full justify-start gap-1">
              <label className="font-semibold">Pet Type:</label>
              <select
                id="pettype"
                className="border rounded-lg p-3 w-64 h-12 font-base"
                onChange={handlePetTypeChange}
                value={selectedPetType}
              >
                <option key={"500"} value={"choose pet"}>
                  {"Choose pet"}
                </option>
                {pickPet === "parrots"
                  ? parrotsTypes.map((pet, index) => (
                      <option key={index} value={pet}>
                        {pet}
                      </option>
                    ))
                  : pickPet === "fish"
                  ? fishTypes.map((pet, index) => (
                      <option key={index} value={pet}>
                        {pet}
                      </option>
                    ))
                  : pickPet === "dogs"
                  ? dogTypes.map((pet, index) => (
                      <option key={index} value={pet}>
                        {pet}
                      </option>
                    ))
                  : pickPet === "cats"
                  ? catTypes.map((pet, index) => (
                      <option key={index} value={pet}>
                        {pet}
                      </option>
                    ))
                  : pickPet === "horses"
                  ? horseTypes.map((pet, index) => (
                      <option key={index} value={pet}>
                        {pet}
                      </option>
                    ))
                  : pickPet === "sheeps"
                  ? sheepTypes.map((pet, index) => (
                      <option key={index} value={pet}>
                        {pet}
                      </option>
                    ))
                  : pickPet === "chickens"
                  ? chickenTypes.map((pet, index) => (
                      <option key={index} value={pet}>
                        {pet}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
            {/*xxxxxxxxxxxx*/}
            <div className="flex items-center gap-1 w-full justify-start">
              <label className="font-semibold">Action:</label>
              <select
                id="action"
                className="border rounded-lg p-3 w-64 h-12 font-base"
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
            {/*xxxxxxxxx*/}

            <div className="flex items-center gap-5 w-full justify-start">
              <label className="font-semibold">Sort:</label>
              <select
                onChange={handleChange}
                id="sort_order2"
                className="border rounded-lg p-3  w-64 h-12"
                defaultValue={"created_at_desc"}
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
          </div>
          {/*                     */}
          <div
            className={` ${
              pick !== "secondhands" ? "hidden" : "flex"
            }   gap-5 flex-col items-center `}
          >
            <div className="flex w-full justify-start gap-3.5 items-center">
              <label className="font-semibold">SecondHand Category:</label>
              <select
                id="pickSecondHand"
                onChange={handlePickSecondHand}
                value={pickSecondHand}
                className="border rounded-lg p-3 w-48 h-12  font-base"
              >
                <option value="choose category">2Hand Product:</option>
                <option value="electric">electric</option>
                <option value="cellular">cellular</option>
                <option value="furniture">furniture</option>
                <option value="sport">sport</option>
                <option value="baby">baby</option>
                <option value="computer">computer</option>
                <option value="home">home</option>
                <option value="other">other</option>
              </select>
            </div>
            <div className="flex items-center w-full justify-start gap-1">
              <label className="font-semibold">Category:</label>
              {pickSecondHand !== "other" ? (
                <select
                  id="secondhandcategory"
                  className="border rounded-lg p-3 w-64 h-12 font-base"
                  onChange={handleSecondHandTypeChange}
                  value={selectedSecondHandType}
                >
                  <option key={"500"} value={"choose secondhand"}>
                    {"Choose secondhand"}
                  </option>
                  {pickSecondHand === "electric"
                    ? electricProducts.map((secondhand, index) => (
                        <option key={index} value={secondhand}>
                          {secondhand}
                        </option>
                      ))
                    : pickSecondHand === "cellular"
                    ? cellularDevices.map((secondhand, index) => (
                        <option key={index} value={secondhand}>
                          {secondhand}
                        </option>
                      ))
                    : pickSecondHand === "furniture"
                    ? furnitureItems.map((secondhand, index) => (
                        <option key={index} value={secondhand}>
                          {secondhand}
                        </option>
                      ))
                    : pickSecondHand === "sport"
                    ? sportItems.map((secondhand, index) => (
                        <option key={index} value={secondhand}>
                          {secondhand}
                        </option>
                      ))
                    : pickSecondHand === "baby"
                    ? babyChildItems.map((secondhand, index) => (
                        <option key={index} value={secondhand}>
                          {secondhand}
                        </option>
                      ))
                    : pickSecondHand === "computer"
                    ? computerItems.map((secondhand, index) => (
                        <option key={index} value={secondhand}>
                          {secondhand}
                        </option>
                      ))
                    : pickSecondHand === "home"
                    ? homeGardenItems.map((secondhand, index) => (
                        <option key={index} value={secondhand}>
                          {secondhand}
                        </option>
                      ))
                    : pickSecondHand === "other"
                    ? ""
                    : ""}
                </select>
              ) : (
                <input
                  id="secondhandcategory"
                  value={
                    sidebarSecondHand.secondhandcategory !== "choose secondhand"
                      ? sidebarSecondHand.secondhandcategory
                      : ""
                  }
                  onChange={handleSecondHandTypeChange}
                  type="text"
                  placeholder="enter the category item..."
                  className="border rounded-lg p-3 w-64 h-12 mt-2font-base"
                />
              )}
            </div>
            {/*xxxxxxxxxxxx*/}
            <div className="flex items-center gap-1 w-full justify-start">
              <label className="font-semibold">Sub Category:</label>
              <input
                id="model"
                type="text"
                placeholder="enter the subcategory (model)"
                className="border rounded-lg p-3 w-64 h-12 font-base"
                onChange={handleModelChangeSecondHand}
              />
            </div>
            {/*xxxxxxxxx*/}

            <div className="flex items-center gap-5 w-full justify-start">
              <label className="font-semibold">Sort:</label>
              <select
                onChange={handleChange}
                id="sort_order2"
                className="border rounded-lg p-3  w-64 h-12"
                defaultValue={"created_at_desc"}
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
          </div>
          <button
            className="bg-slate-700 text-white p-3 rounded-lg
            uppercase hover: opacity-95"
          >
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl mt-5 font-semibold border-b p-3 text-slate-700">
          Posts Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-5">
          {!loading &&
            listings.length === 0 &&
            vehicles.length === 0 &&
            pets.length === 0 &&
            secondhands.length === 0 && (
              <p className="text-xl text-red-700 font-bold">No Posts Found</p>
            )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            mergedList &&
            mergedList.length > 0 &&
            mergedList.map((post) =>
              post.vehicletype === undefined &&
              post.pickPet === undefined &&
              post.pickSecondHand === undefined ? (
                <ListingItem key={post._id} post={post} />
              ) : post.vehicletype ? (
                <VehicleItem key={post._id} post={post} />
              ) : post.pickPet ? (
                <PetItem key={post._id} post={post} />
              ) : (
                <SecondHandItem key={post._id} post={post} />
              )
            )}
          {showMore && !loading && (
            <div className="flex justify-center items-center p-1 max-w-xl w-full mx-auto">
              <button
                className=" font-semibold text-center text-green-700 p-3 hover:underline border-2 bg-slate-50 max-w-32 max-h-[50px] rounded-xl"
                onClick={onShowMoreClick}
              >
                Show more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
