import React from "react";
import ListingItem from "../components/ListingItem";
import VehicleItem from "../components/VehicleItem";
import PetItem from "../components/PetItem";
import SecondHandItem from "../components/SecondHandItem";

export default function PosteLiked() {
    const LikedPostString = localStorage.getItem("posts");
    const LikedPost = JSON.parse(LikedPostString);
  const emptyPost = () => {
    
    if (LikedPost.length===0) {
      return true;
    }
    return false;
  };

  return (
    <div>
      
      <div className="flex-1">
        <h1 className="text-3xl mt-5 font-semibold border-b p-3 text-slate-700">
          Posts Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-5">
        {
            emptyPost()===true && (
              <p className="text-xl text-red-700 font-bold">No Posts Found</p>
            )
            }

          {
            LikedPost.map((post) =>
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
          
        </div>
      </div>
    </div>
  );
}
