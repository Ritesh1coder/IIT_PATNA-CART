import express from "express";
import {
  addToWishlist,
  getAllListingsForSeller,
  getChatHistory,
  getLatestProducts,
  getPastOrdersForBuyer,
  getPastSoldItemsForSeller,
  getWishlist,
  markProductAsSold,
  removeFromWishlist,
  createPaymentIntent,
  uploadProduct,
  searchQuery,
} from "../controllers/userController.js";
import upload from "../middlewares/upload.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
const userRouter = express.Router();

userRouter.get("/search-query", authenticateUser, searchQuery);
userRouter.post(
  "/upload-item",
  authenticateUser,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "qrImage", maxCount: 1 },
  ]),
  uploadProduct
);
userRouter.post("/transaction-success", authenticateUser, markProductAsSold);
userRouter.get("/buyer-history", authenticateUser, getPastOrdersForBuyer);
userRouter.get(
  "/seller-completed-history",
  authenticateUser,
  getPastSoldItemsForSeller
);
userRouter.get("/chat-history", authenticateUser, getChatHistory);
userRouter.get("/seller-lisitings", authenticateUser, getAllListingsForSeller);
userRouter.get("/products", authenticateUser, getLatestProducts);
userRouter.get("/wishlist", authenticateUser, getWishlist);
userRouter.post("/wishlistAdd", authenticateUser, addToWishlist);
userRouter.post("/wishlistDelete", authenticateUser, removeFromWishlist);
userRouter.post(
  "/create-payment-intent",
  authenticateUser,
  createPaymentIntent
);

export default userRouter;
