import React, { useState } from "react";
import { FaStarOfLife } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    subject: "Need recommendation for which bank is most worthwhile for me",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    const phoneNumberRegex = /^(053|054|050|055|052)\d{7}$/;
    if (!phoneNumberRegex.test(formData.phonenumber)) {
      setError("Incorrect phone number");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact/contactus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setError(false);
      setLoading(false);
      navigate("/Contact-Form-Answers");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div>
      <main className="">
        <div className="flex flex-col lg:flex-row lg:justify-around gap-2">
          <div className="max-w-sm lg:max-w-5xl w-full mt-8 lg:mt-16 flex flex-col gap-3 lg:gap-6">
            <span className="text-lg lg:text-3xl font-semibold text-left text-slate-700">
              Chat Form
            </span>
            <div className="max-w-sm lg:max-w-4xl w-full mt-5 ml-3">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-8 lg:gap-12"
                dir="ltr"
              >
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-44 mx-auto lg:mx-0 ">
                  <div className="flex flex-col gap-2 max-w-xs w-full">
                    <div className="flex gap-1">
                      <FaStarOfLife className="text-red-700 size-2 mt-1" />
                      <label className="font-semibold">First Name</label>
                    </div>
                    <input
                      type="text"
                      className="border p-2 rounded-lg bg-slate-200 "
                      id="firstname"
                      placeholder="First Name"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 max-w-xs w-full">
                    <div className="flex gap-1">
                      <FaStarOfLife className="text-red-700 size-2 mt-1" />
                      <label className="font-semibold">Last Name</label>
                    </div>
                    <input
                      type="text"
                      className="border p-2 rounded-lg bg-slate-200"
                      id="lastname"
                      placeholder="Last Name"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-44 mx-auto lg:mx-0 ">
                  <div className="flex flex-col gap-2 max-w-xs w-full">
                    <div className="flex gap-1">
                      <FaStarOfLife className="text-red-700 size-2 mt-1" />
                      <label className="font-semibold">Phone Number</label>
                    </div>
                    <input
                      type="text"
                      className="border p-2 rounded-lg bg-slate-200 "
                      id="phonenumber"
                      placeholder="Phone Number"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 max-w-xs w-full">
                    <div className="flex gap-1">
                      <FaStarOfLife className="text-red-700 size-2 mt-1" />
                      <label className="font-semibold">Email</label>
                    </div>
                    <input
                      type="email"
                      className="border p-2 rounded-lg bg-slate-200"
                      id="email"
                      placeholder="Email"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-10">
                  <div className="flex flex-col gap-2 mr-8 lg:mr-0 max-w-xs lg:max-w-4xl w-full">
                    <div className="flex gap-1">
                      <FaStarOfLife className="text-red-700 size-2 mt-1" />
                      <label className="font-semibold ">Subject</label>
                    </div>
                    <select
                      required
                      onChange={handleChange}
                      id="subject"
                      className="border-1 border-current rounded-lg p-1 items-center bg-slate-200 font-medium text-slate-600 max-w-3xl w-full"
                    >
                      <option value="Technical issues while browsing the website.">
                        Technical Issues
                      </option>
                      <option value="complaints or suggestions to improve the website's services.">
                        Complaints or Suggestions
                      </option>
                      <option value="Provide positive feedback about their experience with the website">Feedback</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-4 mr-8 lg:mr-0">
                    <textarea
                      type="text"
                      placeholder="Additional Details"
                      className="border-1 border-current p-3 rounded-lg max-w-3xl w-full bg-slate-200 font-semibold"
                      id="message"
                      onChange={handleChange}
                      value={formData.message}
                    />

                    <div className="flex justify-end">
                      <button
                        disabled={loading}
                        type="submit"
                        className=" font-semibold py-2 px-4 rounded-lg disabled:opacity-60 border h-12 text-white text-lg w-20 mx-auto lg:mx-0 lg:w-36 bg-slate-600 hover:opacity-90"
                      >
                        {loading ? "Loading..." : "Send"}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-red-700 text-lg">{error}</p>}
                </div>
              </form>
            </div>
          </div>
          <div
            className="w-[350px] border-l-4 mt-20 mr-5 hidden flex-col lg:block"
            dir="ltr"
          >
            {/* Any additional content */}
          </div>
        </div>
      </main>
    </div>
  );
}
