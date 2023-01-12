require("dotenv").config();
const express = require("express");
const colors = require("colors");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(cors());
// app.options("*", cors());
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "https://travelapp-front.vercel.app",
      //   "https://travelapp-back.up.railway.app",
      //   "https://travelapp-back.cyclic.app",
    ],
  })
);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const storeItems = new Map([
//   [
//     "6399d43f0cef9cc11b08c65e",
//     { priceInCents: 10000, name: "Learn React Today" },
//   ],
//   [
//     "6395c2eabd48c13ad434b892",
//     { priceInCents: 20000, name: "Learn CSS Today" },
//   ],
// ]);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: req.body.name,
              images: [req.body.image],
            },
            unit_amount: req.body.price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/tours`,
      //   line_items: req.body.items.map((item) => {
      //     const storeItem = storeItems.get(item.id);
      //     return {
      //       price_data: {
      //         currency: "usd",
      //         product_data: {
      //           name: storeItem.name,
      //         },
      //         unit_amount: storeItem.priceInCents,
      //       },
      //       quantity: item.quantity,
      //     };
      //   }),
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tours", require("./routes/tourRoutes"));
app.use("/api/booking", require("./routes/bookingRoutes"));

app.use(errorHandler);

app.listen(port, () => console.log(`App is running on port: ${port}`));
