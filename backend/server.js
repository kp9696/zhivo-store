const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_SECRET"
});

app.post("/api/create-order", async (req, res) => {
  const options = {
    amount: req.body.amount * 100,
    currency: "INR"
  };

  const order = await razorpay.orders.create(options);
  res.json(order);
});

app.post("/api/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", "YOUR_SECRET")
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ status: "success" });
  } else {
    res.status(400).json({ status: "failed" });
  }
});

app.listen(5000, () => console.log("Server running on 5000"));
