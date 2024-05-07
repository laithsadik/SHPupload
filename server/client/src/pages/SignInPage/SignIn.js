import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  signInStart,
  signInSucces,
  signInFailure,
} from "../../redux/user/userSlice";
import OAuth from "../../components/OAuth";

export default function SignIn() {
  const { error, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const postsArray = [];
  const postArrayString = JSON.stringify(postsArray);
  localStorage.setItem("posts", postArrayString);
  
  useEffect(() => {
    const userr = JSON.parse(localStorage.getItem("userr"));
if(userr){
    setFormData({ email: userr.email, password: userr.pass });
}
  }, []);

  const handleChangeEmail = (e) => {
    setFormData({
      ...formData,
      email: e.target.value,
    });
  };
  const handleChangePassword = (e) => {
    setFormData({
      ...formData,
      password: e.target.value,
    });
  };
  const handleSubmitSingin = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      const email = data.email;
      const pass = data.password;
      const obj = { email, pass };
      localStorage.setItem("userr", JSON.stringify(obj));
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSucces(data));
      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmitSingin} className="flex flex-col gap-4">
        <input
          type="email"
          value={formData.email}
          placeholder="email"
          className="border p-4 rounded-lg"
          id="email"
          onChange={handleChangeEmail}
        />
        <input
          type="password"
          value={formData.password}
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChangePassword}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3
        rounded-lg uppercase hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-4">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && !loading && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
