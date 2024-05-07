import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact(prop) {
  const listing = prop.listing;
  const [landLord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        console.log(data[0].email);
        setLandLord(data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing, listing.userRef]);

  return (
    <>
      {landLord && (
        <div
        className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landLord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">
              {listing.manufacturer
                ? listing.manufacturer + "- " + listing.model
                : listing.pickSecondHand
                ? listing.pickSecondHand + "- " + listing.secondhandcategory
                : listing.pickPet
                ? listing.pickPet + "- " + listing.pettype
                : listing.name}
            </span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="3"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${landLord.email}?subject=Regarding to ${
              listing.manufacturer
                ? listing.manufacturer + "- " + listing.model
                : listing.pickSecondHand
                ? listing.pickSecondHand + "- " + listing.secondhandcategory
                : listing.pickPet
                ? listing.pickPet + "- " + listing.pettype
                : listing.name
            }&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-90"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
