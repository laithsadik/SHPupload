import { FaDog } from "react-icons/fa6";
import { GiCityCar } from "react-icons/gi";
import { BsFillBuildingsFill } from "react-icons/bs";
import { FaTools } from "react-icons/fa";
import { PiHandbagSimpleDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();

  const handleClick = (temp) => {
    navigate(`/${temp}`);
  };

  return (
    <div className="flex flex-wrap gap-10 max-w-6xl mx-auto p-5 mt-10 ">
      <div
        onClick={() => {
          handleClick("create-vehicle");
        }}
        className=" h-[250px] w-[320px] rounded-lg items-center shadow-xl hover:opacity-90 cursor-pointer flex justify-center border-2 border-slate-100 bg-slate-100 "
      >
        <div className="flex flex-col items-center justify-center ">
          <GiCityCar className=" text-slate-500   size-36" />
          <span className="text-xl font-bold text-slate-700  ">Vehicles</span>
          <span className="text-sm font-bold text-slate-300">
            Vehicles, Two wheelers, vessels
          </span>
        </div>
      </div>
      <div
        onClick={() => {
          handleClick("create-pet");
        }}
        className=" h-[250px] w-[320px] rounded-lg items-center shadow-xl hover:opacity-90 cursor-pointer flex justify-center border-2 border-slate-100 bg-slate-100 "
      >
        <div
          className="flex flex-col items-center justify-center"
        >
          <FaDog className=" text-slate-500 size-32" />
          <span className="text-xl font-bold text-slate-700  ">Pets</span>
          <span className="text-sm font-bold text-slate-300">
            Mammals, amphibians, reptiles, birds
          </span>
        </div>
      </div>
      <div
        onClick={() => {
          handleClick("create-listing");
        }}
        className=" h-[250px] w-[320px] rounded-lg items-center shadow-xl hover:opacity-90 cursor-pointer flex justify-center border-2 border-slate-100 bg-slate-100 "
      >
        <div className="flex flex-col items-center justify-center">
          <BsFillBuildingsFill className=" text-slate-500 size-28" />
          <span className="text-xl font-bold text-slate-700  ">Listings</span>
          <span className="text-sm font-bold text-slate-300">
            Hotels,Hostels,Houses,Villas,Builds
          </span>
        </div>
      </div>
      <div
        onClick={() => {
          handleClick("create-secondhand");
        }}
        className="ml-5 h-[200px] w-[280px] rounded-lg items-center shadow-xl flex justify-center hover:opacity-90 border-2 cursor-pointer border-slate-100 bg-slate-100 "
      >
        <div className="flex flex-col items-center justify-center p-2">
          <FaTools className=" text-slate-500 size-20" />
          <span className="text-xl font-bold text-slate-700  ">
            Second Hand
          </span>
          <span className="text-sm font-bold text-slate-300">
            For home garden and office, electricity, sport tools
          </span>
        </div>
      </div>
      <div className="ml-10 opacity-30 h-[200px] w-[280px] rounded-lg items-center shadow-xl   flex justify-center border-2 border-slate-100 bg-slate-100 ">
        <div className="flex flex-col items-center justify-center p-2">
          <PiHandbagSimpleDuotone className=" text-slate-700 size-20 " />
          <span className="text-xl font-bold text-slate-800  ">
            Professionals
          </span>
          <span className="text-sm font-bold text-slate-500">
            Transports, grages, renovations
          </span>
        </div>
      </div>
    </div>
  );
}
