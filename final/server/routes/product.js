import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// middlewares
import {
  requireSignin,
  isAdmin,
  belongToUser,
  belongToUserInReplies,
} from "../middlewares/auth.js";
// controllers
import {
  create,
  list,
  read,
  photo,
  remove,
  update,
  filteredProducts,
  productsCount,
  listProducts,
  productsSearch,
  relatedProducts,
  getToken,
  processPayment,
  orderStatus,
  createOrder,
  paymentStatus,
} from "../controllers/product.js";

import {
  createComment,
  createReply,
  listComments,
  getAverageRating,
  deleteComment,
  updateComment,
} from "../controllers/comment.js";

router.post("/product", requireSignin, isAdmin, formidable(), create);
router.get("/products", list);
router.get("/product/:slug", read);
router.get("/product/photo/:productId", photo);
router.delete("/product/:productId", requireSignin, isAdmin, remove);
router.put("/product/:productId", requireSignin, isAdmin, formidable(), update);
router.post("/filtered-products", filteredProducts);
router.get("/products-count", productsCount);
router.get("/list-products/:page", listProducts);
router.get("/products/search/:keyword", productsSearch);
router.get("/related-products/:productId/:categoryId", relatedProducts);

router.get("/braintree/token", getToken);
router.post("/braintree/payment", requireSignin, processPayment);
router.put("/order-status/:orderId", requireSignin, isAdmin, orderStatus);
router.put("/payment-status/:orderId", requireSignin, isAdmin, paymentStatus);

// Comments
router.post(
  "/product/comment/:productId",
  requireSignin,
  belongToUser,
  createComment
);
router.delete("/comment/:id", requireSignin, deleteComment);
router.patch("/comment/:id", requireSignin, updateComment);

router.post(
  "/comment/:commentId/replies",
  requireSignin,
  belongToUserInReplies,
  createReply
);
router.get("/product/comment/:productId", listComments);
router.get("/product/average-rating/:productId", getAverageRating);

//Order
router.post("/order", requireSignin, createOrder);
export default router;
