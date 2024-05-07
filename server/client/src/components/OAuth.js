
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSucces } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { IoLogoGoogle } from "react-icons/io";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();

      dispatch(signInSucces(data));
      navigate("/");
    } catch (error) {
      console.log("could not Sign In to Google ", error);
    }
  };
  return (
    <div
      onClick={handleGoogleClick}
      className="flex bg-red-500 items-center justify-center p-3 rounded-xl h-12 cursor-pointer"
    >
      <IoLogoGoogle className="size-6 text-white" />
      <button
        type="button"
        className=" text-white uppercase p-3 rounded-lg hover:opacity-90 "
      >
        Continue with google
      </button>
    </div>
  );
}
