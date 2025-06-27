import { toast } from "react-toastify";
import { getUser } from "../auth";
import { myAxios, privateAxios } from "./helper";

export const createOrder = (email) => {
  const paymentDto = {
    username: email,
    amount: 99,
  };
  return myAxios
    .post("/api/payment/create-order", paymentDto)
    .then((response) => response.data);
};

export const doPayment = (data) => {
  return new Promise((resolve, reject) => {
    const options = {
      key: "rzp_test_Lo1FyHCZRtjfN5",
      amount: data.amount,
      currency: "INR",
      name: "DoubNest.Ai",
      description: "Standard subscription",
      order_id: data.id,
      handler: function (response) {
        resolve(response);
      },
      prefill: {
        name: "",
        email: data.username || "",
        contact: "",
      },
      theme: { color: "#3399cc" },
      modal: {
        // 👇 Add this
        ondismiss: function () {
          reject({ error: { description: "Payment cancelled by user" } });
        },
      },
    };

    const rzp = new Razorpay(options);

    rzp.on("payment.failed", (error) => {
      reject(error);
    });

    rzp.open();
  });
};


export const makeUserPro=(userId)=>{

  return privateAxios.put(`/api/payment/make-user-pro/${userId}`)
  .then((response)=>response.data);
}


