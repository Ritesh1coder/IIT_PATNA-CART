import prisma from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY);

export const searchQuery = async (req, res) => {
  try {
    const { query } = req.query; // Get the search query from the request

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Perform a search in the database using Prisma
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query.toLowerCase(), // Convert query to lowercase // Not supported in MySQL, but Prisma will ignore it
            },
          },
          {
            description: {
              contains: query.toLowerCase(), // Convert query to lowercase
              // Not supported in MySQL, but Prisma will ignore it
            },
          },
        ],
      },
      take: 10, // Limit the number of results
    });

    res.status(200).json({ data: products });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "inr",
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
export const getChatHistory = async (req, res) => {
  const { sender, receiver } = req.query;

  try {
    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { sender: sender, receiver: receiver },
          { sender: receiver, receiver: sender },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json({
      data: messages,
      message: "Chat history fetched successfully",
    });
  } catch (error) {
    throw error;
  }
};

export const markProductAsSold = async (req, res) => {
  const { productId } = req.body;
  const buyerRollNumber = req.user.id;

  try {
    const product = await prisma.product.findUnique({
      where: { productId: productId },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await prisma.product.update({
      where: { productId: productId },
      data: {
        status: "sold",
        buyer: buyerRollNumber,
      },
    });

    const order = await prisma.order.create({
      data: {
        productId: productId,
        buyer: buyerRollNumber,
        seller: product.seller,
      },
    });
    res.status(200).json({ message: "Product marked as sold", order });
  } catch (error) {
    throw error;
  }
};
export const getPastOrdersForBuyer = async (req, res) => {
  const buyerRollNumber = req.user.id;

  try {
    const pastOrders = await prisma.order.findMany({
      where: { buyer: buyerRollNumber },
      include: {
        product: true,
      },
    });

    res.status(200).json({
      data: pastOrders,
      message: "Past orders fetched successfully",
    });
  } catch (error) {
    throw error;
  }
};
export const getPastSoldItemsForSeller = async (req, res) => {
  const sellerRollNumber = req.user.id;

  try {
    const pastSoldItems = await prisma.order.findMany({
      where: { seller: sellerRollNumber },
      include: {
        product: true,
      },
    });

    res.status(200).json({
      data: pastSoldItems,
      message: "Past sold items fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching past sold items:", error);
    res.status(500).json({ error: "Error fetching past sold items" });
  }
};
export const getAllListingsForSeller = async (req, res) => {
  const sellerRollNumber = req.user.id;

  try {
    const listings = await prisma.product.findMany({
      where: { seller: sellerRollNumber },
    });

    res.status(200).json({
      data: listings,
      message: "All listings fetched successfully",
    });
  } catch (error) {
    throw error;
  }
};
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const rollNumber = req.user.id;

  try {
    const wishlistItem = await prisma.wishlist.create({
      data: {
        roll_number: rollNumber,
        productId: productId,
      },
    });

    res.status(201).json({ message: "Added to wishlist", wishlistItem });
  } catch (error) {
    res.status(400);
  }
};

export const removeFromWishlist = async (req, res) => {
  const { productId } = req.body;
  const rollNumber = req.user.id;

  try {
    await prisma.wishlist.delete({
      where: {
        roll_number_productId: {
          roll_number: rollNumber,
          productId: productId,
        },
      },
    });

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(400);
  }
};

export const getWishlist = async (req, res) => {
  const rollNumber = req.user.id;

  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { roll_number: rollNumber },
      include: {
        product: true,
      },
    });

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: "Error fetching wishlist" });
  }
};
export const getLatestProducts = async (req, res) => {
  const { category, size } = req.query;
  let userCategory = category;
  if (userCategory) {
    userCategory = category.toLowerCase();
  }
  try {
    const products = await prisma.product.findMany({
      where: {
        status: { not: "sold" },
        category: userCategory ? userCategory : undefined,
      },
      orderBy: { createdAt: "desc" },
      take: size ? parseInt(size) : undefined,
    });
    res.status(200).json({
      data: products,
      message: "data fetched successfully",
    });
  } catch (error) {
    throw error;
  }
};
export const uploadProduct = async (req, res) => {
  const { title, description, price, category, contact, upiId } = req.body;
  const images = req.files["images"]?.map((file) => file.path) || [];
  const qrImage = req.files["qrImage"]?.[0]?.path || "";
  const seller = req.user.id;

  if (
    !title ||
    !description ||
    !price ||
    // !seller ||
    !contact ||
    !category ||
    !images?.length
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        seller,
        category,
        contact,
        images,
        status: "available",
        buyer: "",
      },
    });

    res.status(200).json({ message: "Product uploaded successfully", product });
  } catch (error) {
    throw error;
  }
};
