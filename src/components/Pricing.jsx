import { useEffect, useState } from "react";
import { createOrder, doPayment, makeUserPro } from "../services/payment";
import { doLogin, getUser, isLoggedin } from "../auth";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserById } from "../services/user-service";

export default function Pricing() {
  const loggedIn = isLoggedin();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // track loading state

  const handleBuy = () => {
    if (!isLoggedin()) {
      navigate("/login");
      return;
    }

    setLoading(true); // 🟢 Set loading here

    const user = getUser();
    const userId = user.userId;
    const userEmail = user.email;
    setEmail(userEmail);

    createOrder(userEmail)
      .then((data) => {
        if (data.status === "created") {
          return doPayment({ ...data, username: userEmail });
        } else {
          throw new Error("Order creation failed");
        }
      })
      .then(() => {
        toast.success("Payment successful!");
        return makeUserPro(userId);
      })
      .then(() => getUserById(userId))
      .then((updatedUser) => {
        const existing = JSON.parse(localStorage.getItem("data"));
        doLogin({ token: existing.token, user: updatedUser }, () => {
          navigate("/private/ask-doubt");
        });
      })
      .catch((error) => {
        console.error("Error during payment:", error);
        toast.error(error?.error?.description || "Error during payment");
      })
      .finally(() => {
        setLoading(false); // 🔴 Always reset loading
      });
  };

  return (
    <section
      className={`${
        loggedIn
          ? "bg-white pt-20 pb-27"
          : "bg-gradient-to-r from-[#eaf0f9] via-[#d6e6f5] to-[#c4d7e8] pb-10"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          Simple, Transparent Pricing
        </h2>
        <p className="text-gray-600 mt-2">
          Start with a free trial, then choose the plan that works best for you.
        </p>

        <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-8">
          {/* Basic Plan */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between w-full max-w-xs">
            <div>
              <h3 className="text-xl font-semibold">Basic</h3>
              <p className="text-3xl font-bold mt-2">Free</p>
              <p className="text-gray-500 text-sm mb-4">3-month trial</p>
              <ul className="text-left space-y-2 text-sm text-gray-700">
                <li>✅ 20 questions per day</li>
                <li>✅ Peer communication</li>
                <li>✅ Text questions only</li>
              </ul>
            </div>
            <NavLink
              to={"/private/ask-doubt"}
              className="mt-6 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded hover:bg-gray-100 transition"
            >
              {loggedIn ? "Continue with free plan" : "Start Free Trial"}
            </NavLink>
          </div>

          {/* Standard Plan */}
          <div className="bg-white border-2 border-pink-500 rounded-xl shadow p-6 relative flex flex-col justify-between w-full max-w-xs">
            <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Most Popular
            </span>
            <div>
              <h3 className="text-xl font-semibold">Standard</h3>
              <p className="text-3xl font-bold mt-2">
                ₹99
                <span className="text-base font-medium"> one-time payment</span>
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Lifetime access — no recurring fees
              </p>
              <ul className="text-left space-y-2 text-sm text-gray-700">
                <li>✅ Unlimited questions</li>
                <li>✅ Peer communication</li>
                <li>✅ AI Powered Quiz</li>
              </ul>
            </div>
            <button
              onClick={handleBuy}
              className="mt-6 bg-pink-500 text-white font-medium py-2 px-4 rounded hover:bg-pink-600 transition"
              disabled={loading}
            >
              {loading ? "Processing..." : "Choose Plan"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
