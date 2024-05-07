import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const { error, loading } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListing, setShowListing] = useState(false);
  const [showVehiclesError, setShowVehclesError] = useState(false);
  const [userVehicles, setUserVehicles] = useState([]);
  const [showVehicle, setShowVehicle] = useState(false);
  const [showPetError, setShowPetError] = useState(false);
  const [showPet, setShowPet] = useState(false);
  const [userPets, setUserPets] = useState([]);
  const [showSecondHandError, setShowSecondHandError] = useState(false);
  const [showSecondHand, setShowSecondHand] = useState(false);
  const [userSecondHands, setUserSecondHands] = useState([]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //console.log(file, "yyyyyy");
  // console.log(filePerc, "yyyyyy");
  //console.log(fileUploadError, "yyyyyy");
  //console.log(formData, "yyyyyy");
  //console.log(formData, "xxxxxxxxxx");
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log("error: " + error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...FormData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        handleClose();
        return;
      }
      dispatch(deleteUserSuccess());
      handleClose();
    } catch (error) {
      dispatch(deleteUserFailure(error));
      handleClose();
    }
  };

  const handleSignOutUser = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      setShowListing(true);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        setShowListing(false);
        return;
      }
      if (data.length === 0) {
        setShowListingsError(true);
        setShowListing(false);
      }
      setUserListings(data);
      setShowListing(false);
    } catch (error) {
      setShowListingsError(true);
      setShowListing(false);
    }
  };
  const handleShowVehicles = async () => {
    try {
      setShowVehclesError(false);
      setShowVehicle(true);
      const res = await fetch(`/api/user/vehicles/${currentUser._id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        setShowVehclesError(true);
        setShowVehicle(false);
        return;
      }
      if (data.length === 0) {
        setShowVehclesError(true);
        setShowVehicle(false);
      }
      setUserVehicles(data);
      setShowVehicle(false);
    } catch (error) {
      setShowVehclesError(true);
      setShowVehicle(false);
    }
  };

  const handleShowPets = async () => {
    try {
      setShowPetError(false);
      setShowPet(true);
      const res = await fetch(`/api/user/pets/${currentUser._id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        setShowPetError(true);
        setShowPet(false);
        return;
      }
      if (data.length === 0) {
        setShowPetError(true);
        setShowPet(false);
      }
      setUserPets(data);
      setShowPet(false);
    } catch (error) {
      setShowPetError(true);
      setShowPet(false);
    }
  };

  const handleShowSecondHands = async () => {
    try {
      setShowSecondHandError(false);
      setShowSecondHand(true);
      const res = await fetch(`/api/user/secondhands/${currentUser._id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        setShowSecondHandError(true);
        setShowSecondHand(false);
        return;
      }
      if (data.length === 0) {
        setShowSecondHandError(true);
        setShowSecondHand(false);
      }
      setUserSecondHands(data);
      setShowSecondHand(false);
    } catch (error) {
      setShowSecondHandError(true);
      setShowSecondHand(false);
    }
  };

  const handleShowPosts = async () => {
    try {
      await handleShowListings();
      await handleShowVehicles();
      await handleShowPets();
      await handleShowSecondHands();
    } catch (error) {
      console.log("error");
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log("delete");
      }
      const prev = userListings.filter((listing) => listing._id !== listingId);
      setUserListings(prev);
    } catch (error) {
      return;
    }
  };
  const handleVehicleDelete = async (vehicleId) => {
    try {
      const res = await fetch(`/api/vehicle/delete/${vehicleId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log("Delete");
      }
      const prev = userVehicles.filter((vehicle) => vehicle._id !== vehicleId);
      setUserVehicles(prev);
    } catch (error) {
      return;
    }
  };
  const handlePetDelete = async (petId) => {
    try {
      const res = await fetch(`/api/pet/delete/${petId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log("Delete");
      }
      const prev = userPets.filter((pet) => pet._id !== petId);
      setUserPets(prev);
    } catch (error) {
      return;
    }
  };

  const handleSecondHandDelete = async (secondhandId) => {
    try {
      const res = await fetch(`/api/secondhand/delete/${secondhandId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log("Delete");
      }
      const prev = userSecondHands.filter(
        (secondhand) => secondhand._id !== secondhandId
      );
      setUserSecondHands(prev);
    } catch (error) {
      return;
    }
  };
  //firebase storage
  //allow read;
  //allow write: if
  //request.resource.size < 3*1024*1024 && request.resource.contentType.matches('image/.*')
  return (
    <>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center my-">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="border mt-2 rounded-full h-24 w-24 object-cover cursor-pointer self-center"
          />
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Image must be less than 2-mega
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-700">successfully uploaded</span>
            ) : (
              ""
            )}
          </p>
          <input
            disabled={true}
            type="email"
            defaultValue={currentUser.email}
            id="email"
            placeholder="email"
            className="border p-3 rounded-lg mt-1 font-thin"
            onChange={handleChange}
          />
          <input
            type="text"
            defaultValue={currentUser.username}
            id="username"
            placeholder="username"
            className="border p-3 rounded-lg mt-1"
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="password"
            className="border p-3 rounded-lg mt-1"
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="bg-slate-700 text-white rounded-lg
        p-3 uppercase hover:opacity-80 disabled:opacity-50"
          >
            {loading ? "loading..." : "Update"}
          </button>
          <Link
            className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90"
            to={"/create-post"}
          >
            Create Post
          </Link>
        </form>

        <div className="flex justify-between mt-5">
          <span
            onClick={handleClickOpen}
            className="text-red-700 cursor-pointer"
          >
            Delete Account
          </span>
          <span
            onClick={handleSignOutUser}
            className="text-red-700 cursor-pointer"
          >
            Sign Out
          </span>
        </div>
        {error && !loading && <p className="text-red-500 mt-5">{error}</p>}
        {updateSuccess && !loading && (
          <p className="text-green-500 mt-5">{"User Updated Successfully"}</p>
        )}
        <button
          onClick={handleShowPosts}
          className="text-green-700 max-w-32 sm:max-w-36 sm:border p-2 rounded-xl w-full ml-28 sm:ml-44"
        >
          {showListing || showVehicle || showPet || showSecondHand
            ? "Get Posts..."
            : "Show Posts"}
        </button>
        <p className="text-red-400 mt-5">
          {showListingsError &&
          showVehiclesError &&
          showPetError &&
          showSecondHandError
            ? "Error showing posts maybe you dont have any post"
            : ""}
        </p>
        {((userListings && userListings.length > 0) ||
          (userVehicles && userVehicles.length > 0) ||
          (userSecondHands && userSecondHands.length > 0) ||
          (userPets && userPets.length > 0)) && (
          <div className="flex flex-col gap-4 rounded-xl">
            <h1 className="text-center mt-7 text-2xl font-semibold">
              Your Posts
            </h1>
            {userListings
              ? userListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="gap-3 border rounded-lg p-3 flex justify-between items-center"
                  >
                    <Link to={`/listing/${listing._id}`}>
                      <img
                        className="h-16 w-16 object-contain rounded-lg border bg-slate-200"
                        src={listing.imageUrls}
                        alt="listing cover"
                      />
                    </Link>
                    <Link
                      className=" text-slate-700 font-semibold hover:underline truncate flex-1"
                      to={`/listing/${listing._id}`}
                    >
                      <p>{listing.name}</p>
                    </Link>
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleListingDelete(listing._id)}
                        className="border  font-medium bg-slate-200 p-1 rounded-xl text-red-700 uppercase"
                      >
                        Delete
                      </button>
                      <Link to={`/update-listing/${listing._id}`}>
                        <button className="border p-1 rounded-xl bg-slate-200 font-medium text-green-700 uppercase">
                          {" "}
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              : ""}
            {userVehicles
              ? userVehicles.map((vehicle) => (
                  <div
                    key={vehicle._id}
                    className="gap-3 border rounded-lg p-3 flex justify-between items-center"
                  >
                    <Link to={`/vehicle/${vehicle._id}`}>
                      <img
                        className="h-16 w-16 object-contain rounded-lg border bg-slate-200"
                        src={vehicle.imageUrls}
                        alt="vehicle cover"
                      />
                    </Link>
                    <Link
                      className=" text-slate-700 font-semibold hover:underline truncate flex-1"
                      to={`/vehicle/${vehicle._id}`}
                    >
                      <p>
                        {vehicle.manufacturer} {vehicle.model}
                      </p>
                    </Link>
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleVehicleDelete(vehicle._id)}
                        className="border text-red-700 uppercase rounded-xl bg-slate-200 font-medium p-2"
                      >
                        Delete
                      </button>
                      <Link to={`/update-vehicle/${vehicle._id}`}>
                        <button className="border text-green-700 uppercase rounded-xl bg-slate-200 font-medium p-2">
                          {" "}
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              : ""}
            {userPets
              ? userPets.map((pet) => (
                  <div
                    key={pet._id}
                    className="gap-3 border rounded-lg p-3 flex justify-between items-center"
                  >
                    <Link to={`/pet/${pet._id}`}>
                      <img
                        className="h-16 w-16 object-contain rounded-lg border bg-slate-200"
                        src={pet.imageUrls}
                        alt="pet cover"
                      />
                    </Link>
                    <Link
                      className=" text-slate-700 font-semibold hover:underline truncate flex-1"
                      to={`/pet/${pet._id}`}
                    >
                      <p>
                        {pet.pickPet} {pet.pettype}
                      </p>
                    </Link>
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handlePetDelete(pet._id)}
                        className="border text-red-700 uppercase rounded-xl bg-slate-200 font-medium p-2"
                      >
                        Delete
                      </button>
                      <Link to={`/update-pet/${pet._id}`}>
                        <button className="border text-green-700 uppercase rounded-xl bg-slate-200 font-medium p-2">
                          {" "}
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              : ""}
            {userSecondHands
              ? userSecondHands.map((secondhand) => (
                  <div
                    key={secondhand._id}
                    className="gap-3 border rounded-lg p-3 flex justify-between items-center"
                  >
                    <Link to={`/secondhand/${secondhand._id}`}>
                      <img
                        className="h-16 w-16 object-contain rounded-lg border bg-slate-200"
                        src={secondhand.imageUrls}
                        alt="secondhand cover"
                      />
                    </Link>
                    <Link
                      className=" text-slate-700 font-semibold hover:underline truncate flex-1"
                      to={`/secondhand/${secondhand._id}`}
                    >
                      <p>
                        {secondhand.pickSecondHand}{" "}
                        {secondhand.secondhandcategory}
                      </p>
                    </Link>
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleSecondHandDelete(secondhand._id)}
                        className="border text-red-700 uppercase rounded-xl bg-slate-200 font-medium p-2"
                      >
                        Delete
                      </button>
                      <Link to={`/update-secondhand/${secondhand._id}`}>
                        <button className="border text-green-700 uppercase rounded-xl bg-slate-200 font-medium p-2">
                          {" "}
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              : ""}
          </div>
        )}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete the task?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deletion cannot be undone after it is complete.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleDeleteUser} autoFocus>
            Agree and delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Profile;
