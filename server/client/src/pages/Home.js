import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  

  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        return;
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        return;
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        return;
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top*/}
      <div className="flex flex-col gap-6 p-6 sm:p-20 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-5xl">
          Find your next <span className="text-slate-500">perfect</span> product
          <br /> with 2HandProduct website
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          2HandProduct is the best place to fined your seconed hand wanted
          product you can also contact with seller
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Lets get started...
        </Link>
      </div>

      <div className="flex flex-row gap-4 sm:gap-14 max-w-sm sm:max-w-3xl ml-60 ">
        <img
          onClick={() => {
            localStorage.setItem("from", "vehicles");
            navigate("search?searchTerm=");
          }}
          src={"/v.png"}
          alt="cars"
          className="ml-4 sm:ml-0 border mt-2 rounded-full h-14 sm:h-36 w-14 sm:w-36 object-cover cursor-pointer self-center bg-slate-200"
        />

        <img
          onClick={() => {
            localStorage.setItem("from", "pets");
            navigate("search?searchTerm=");
          }}
          src={"/p.png"}
          alt="animals"
          className="border mt-2 rounded-full h-14 sm:h-36 w-14 sm:w-36 object-cover cursor-pointer self-center bg-slate-200"
        />
        <img
          onClick={() => {
            localStorage.setItem("from", "listings");
            navigate("search?searchTerm=");
          }}
          src={"/l.png"}
          alt="listings"
          className="border mt-2 rounded-full h-14 sm:h-36 w-14 sm:w-36 object-cover cursor-pointer self-center bg-slate-200"
        />
        <img
          onClick={() => {
            localStorage.setItem("from", "secondhands");
            navigate("search?searchTerm=");
          }}
          src={"/t.png"}
          alt="secondhand"
          className="border mt-2 rounded-full h-14 sm:h-36 w-14 sm:w-36 object-cover cursor-pointer self-center bg-slate-200"
        />
        <img
          onClick={() => {}}
          src={"/parcel.png"}
          alt="proffesionals"
          className=" border opacity-10 mt-2 rounded-full h-14 sm:h-36 w-14 sm:w-36 object-cover self-center bg-slate-300"
        />
      </div>
      <div className="flex flex-row gap-4 sm:gap-32 max-w-sm sm:max-w-3xl ml-60 mb-10 sm:mb-20">
        <span className="text-sm font-medium text-slate-500 ml-9">
          Vehicles
        </span>
        <span className="text-sm font-medium text-slate-500 ml-11">Pets</span>
        <span className="text-sm font-medium text-slate-500 ml-11">
          Listings
        </span>
        <div className="flex flex-row flex-nowrap gap-28">
          <span className="text-sm font-medium text-slate-500 ">
            SecondHand
          </span>
          <span className="text-sm font-medium text-slate-300 ml-2 ">
            Proffesionals
          </span>
        </div>
      </div>
      {/* swiper*/}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <img
                className="border-2 h-[200px] sm:h-[500px] object-fill w-full cursor-pointer bg-slate-50 rounded-xl"
                src={listing.imageUrls[0]}
                alt="img-listing"
              />
            </SwiperSlide>
          ))}
      </Swiper>
      {/* listing offer result*/}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((post) => (
                <ListingItem post={post} key={post._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((post) => (
                <ListingItem post={post} key={post._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((post) => (
                <ListingItem post={post} key={post._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
