import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import SignIn from "./pages/SignInPage/SignIn";
import Signup from "./pages/Signup";
import About from "./pages/About";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import CreateCarPost from "./pages/CreateCarPost";
import CreateListing from "./pages/CreateListing";
import CreatSecondHandPost from "./pages/CreateSecondHandPost";
import CreatPetsPost from "./pages/CreatPetsPost";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import Listing from "./pages/Listing";
import Pet from "./pages/Pet";
import Vehicle from "./pages/Vehicle";
import SecondHand from "./pages/SecondHand";
import UpdateSecondHand from "./pages/UpdateSecondHand";
import UpdateVehicle from "./pages/UpdateVehicle";
import UpdateListing from "./pages/UpdateListing";
import UpdatePet from "./pages/UpdatePet";
import { useSelector } from "react-redux";
import Accessibilik from "accessibility-react-widget";
import ContactForm from "./pages/ContactForm";
import ContactFormAnswers from "./pages/ContactFormAnswers";
import PostedLiked from "./pages/PosteLiked";
function App() {
  const { imageClicked } = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      {!imageClicked && <Header />}
      <Accessibilik />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/vehicle/:vehicleId" element={<Vehicle />} />
        <Route path="/pet/:petId" element={<Pet />} />
        <Route path="/secondhand/:secondHandId" element={<SecondHand />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/create-vehicle" element={<CreateCarPost />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/create-secondhand" element={<CreatSecondHandPost />} />
          <Route path="/create-pet" element={<CreatPetsPost />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
          <Route
            path="/update-vehicle/:vehicleId"
            element={<UpdateVehicle />}
          />
          <Route path="/update-pet/:petId" element={<UpdatePet />} />
          <Route
            path="/update-secondhand/:secondHandId"
            element={<UpdateSecondHand />}
          />
          <Route path="/Contact-Form" element={<ContactForm />} />
          <Route path="/Posted-Liked" element={<PostedLiked />} />
          <Route path="/Contact-Form-Answers" element={<ContactFormAnswers />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
