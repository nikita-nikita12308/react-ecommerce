import { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Badge } from "antd";
import {
  FaDollarSign,
  FaProjectDiagram,
  FaRegClock,
  FaCheck,
  FaTimes,
  FaStar,
  FaRegStar,
  FaTruckMoving,
  FaWarehouse,
  FaRocket,
  FaMoneyBillAlt,
} from "react-icons/fa";
import ProductCard from "../components/cards/ProductCard";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import CommentsList from "../components/cards/CommentsSection";

export default function ProductView() {
  // context
  const [cart, setCart] = useCart();

  // state
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [commentsData, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // hooks
  const params = useParams();
  const isInCart = cart.some((p) => p._id === product._id);
  useEffect(() => {
    if (params?.slug) loadProduct();
    const fetchAverageRating = async () => {
      try {
        const { data } = await axios.get(
          `/product/average-rating/${product._id}`
        );
        setAverageRating(data.averageRating);
        setTotalRating(data.totalRating); // Set the average rating state
      } catch (err) {
        console.log(err);
      }
    };
    fetchAverageRating();
  }, [params?.slug, product._id]);

  const loadProduct = async (req, res) => {
    try {
      const { data } = await axios.get(`/product/${params.slug}`);
      setProduct(data);
      loadRelated(data._id, data.category._id);
      loadComments(data._id);
    } catch (err) {
      console.log(err);
    }
  };
  const loadRelated = async (productId, categoryId) => {
    try {
      const { data } = await axios.get(
        `/related-products/${productId}/${categoryId}`
      );
      setRelated(data);
    } catch (err) {
      console.log(err);
    }
  };
  const loadComments = async (productId) => {
    try {
      const { data } = await axios.get(`/product/comment/${productId}`);
      setComments(data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleAddComment = async () => {
    try {
      setIsLoading(true);
      const { commentData } = await axios.post(
        `/product/comment/${product._id}`,
        {
          text: newComment,
          rating: newRating,
        }
      );
      if (commentData?.error) {
        toast.error(commentData.error);
      } else {
        toast.success(`Коментарій створено`);
        loadComments(product._id);
      }
      setNewComment("");
      setNewRating(0);
    } catch (err) {
      console.error(err.response.data.message);
      toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleReply = async (commentId, replyText) => {
    try {
      const { replyData } = await axios.post(`/comment/${commentId}/replies`, {
        text: replyText,
      });
      if (replyData?.error) {
        toast.error(replyData.error);
      } else {
        toast.success(`Відповідь на коментар створено`);
        loadComments(product._id);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
    }
  };
  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<FaStar key={i} style={{ color: "#FFD700" }} />);
      } else {
        stars.push(<FaRegStar key={i} style={{ color: "#FFD700" }} />);
      }
    }

    return stars;
  };

  const stars = renderStarRating(averageRating);
  const totalRatings = `(${totalRating})`;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-9">
          <div className="card mb-3">
            <Badge.Ribbon text="" color="red">
              <Badge.Ribbon
                text={`${
                  product?.quantity >= 1
                    ? `${product?.quantity - product?.sold} В наявності`
                    : "Немає в наявності"
                }`}
                placement="start"
                color="green"
              >
                <img
                  className="card-img-top"
                  src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
                  alt={product.name}
                  style={{ height: "500px", width: "100%", objectFit: "cover" }}
                />
              </Badge.Ribbon>
            </Badge.Ribbon>

            <div className="card-body">
              <h1 className="fw-bold">{product?.name}</h1>
              <p className="card-text lead">{product?.description}</p>
            </div>

            <div className="d-flex justify-content-between lead p-5 bg-light fw-bold">
              <div>
                <p>
                  <FaMoneyBillAlt /> Ціна:{" "}
                  {product?.price?.toLocaleString("uk-UA", {
                    style: "currency",
                    currency: "UAH",
                  })}
                </p>

                <p>
                  <FaProjectDiagram /> Категорія: {product?.category?.name}
                </p>

                <p>
                  <FaRegClock /> Доданий: {moment(product.createdAt).fromNow()}
                </p>

                <p>
                  {product?.quantity > 0 ? <FaCheck /> : <FaCheck />}{" "}
                  {product?.quantity > 0 ? "В наявності" : "Під замовлення"}
                </p>

                <p>
                  <FaWarehouse /> В наявності{" "}
                  {product?.quantity - product?.sold}
                </p>

                <p>
                  <FaRocket /> Рейтинг {stars} {totalRatings}
                </p>
              </div>
            </div>
            {isInCart ? (
              <Link
                to="/cart"
                className="btn btn-outline-warning col card-button"
                style={{ fontSize: "0.9rem" }}
              >
                Перейти в кошик
              </Link>
            ) : (
              <button
                className="btn btn-outline-primary col card-button"
                style={{
                  borderBottomRightRadius: "5px",
                  borderBottomLeftRadius: "5px",
                }}
                onClick={() => {
                  const updatedProduct = { ...product, cart_quantity: 1 };
                  setCart([...cart, updatedProduct]);
                  toast.success("Added to cart");
                }}
              >
                Додати в кошик
              </button>
            )}
          </div>
          <h4>Коментарі</h4>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Новий коментар"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="input-group-append">
              {/* Випадаючий список для вибору рейтингу */}
              <select
                className="form-select"
                value={newRating}
                onChange={(e) => setNewRating(e.target.value)}
              >
                <option value={5}>⭐⭐⭐⭐⭐</option>
                <option value={4}>⭐⭐⭐⭐</option>
                <option value={3}>⭐⭐⭐</option>
                <option value={2}>⭐⭐</option>
                <option value={1}>⭐</option>
              </select>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleAddComment}
              disabled={isLoading}
            >
              {isLoading ? "Додаємо..." : "Додати"}
            </button>
          </div>
          <CommentsList
            comments={commentsData}
            handleReply={handleReply}
            commentsPerPage={2}
          />
        </div>

        <div className="col-md-3">
          <h2>Related Products</h2>
          <hr />
          {related?.length < 1 && <p>Nothing found</p>}
          {related?.map((p) => (
            <ProductCard p={p} key={p._id} />
          ))}
        </div>
      </div>
    </div>
  );
}
