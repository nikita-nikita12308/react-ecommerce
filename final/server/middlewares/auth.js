import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Order from "../models/order.js";
import Comment from "../models/comment.js";
import mongoose from "mongoose";

export const requireSignin = (req, res, next) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json(err);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send("Unauthorized");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

export const belongToUser = async (req, res, next) => {
  try {
    const query = {
      buyer: req.user._id,
      products: {
        $elemMatch: { product: mongoose.Types.ObjectId(req.params.productId) },
      },
    };
    const userOrders = await Order.findOne(query);
    if (!userOrders)
      return res.status(400).json({
        success: false,
        message: "Тільки для куплених продуктів можна зробити відгук",
      });
    next();
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const belongToUserInReplies = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }
    const query = {
      buyer: req.user._id,
      products: {
        $elemMatch: { product: mongoose.Types.ObjectId(comment.product) },
      },
    };
    const userOrders = await Order.findOne(query);
    if (!userOrders)
      return res.status(400).json({
        success: false,
        message:
          "Тільки для куплених продуктів можна зробити відповідь на відгук",
      });
    next();
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
