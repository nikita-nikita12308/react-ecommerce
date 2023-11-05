import { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Badge } from 'antd';
import {
  FaDollarSign,
  FaProjectDiagram,
  FaRegClock,
  FaCheck,
  FaTimes,
  FaTruckMoving,
  FaWarehouse,
  FaRocket,
} from 'react-icons/fa';
import ProductCard from '../components/cards/ProductCard';
import toast from 'react-hot-toast';
import { useCart } from '../context/cart';
import CommentsList from '../components/cards/CommentsSection';

export default function ProductView() {
  // context
  const [cart, setCart] = useCart();
  // state
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [commentsData, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  // hooks
  const params = useParams();

  useEffect(() => {
    if (params?.slug) loadProduct();
  }, [params?.slug]);

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
      toast.success(`Comment is created`);
    }
    setNewComment('');
    setNewRating(0);
  };

  const handleReply = async (commentId, replyText) => {
    try {
      const { replyData } = await axios.post(`/comment/${commentId}/replies`, {
        text: replyText,
      });
      if (replyData?.error) {
        toast.error(replyData.error);
      } else {
        toast.success(`Comment is created`);
        console.log('Comments data before loadComments ' + commentsData);
        loadComments(product._id);
        console.log('Comments data after loadComments ' + commentsData);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to add a reply');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-9">
          <div className="card mb-3">
            <Badge.Ribbon text={`${product?.sold} sold`} color="red">
              <Badge.Ribbon
                text={`${
                  product?.quantity >= 1
                    ? `${product?.quantity - product?.sold} in stock`
                    : 'Out of stock'
                }`}
                placement="start"
                color="green"
              >
                <img
                  className="card-img-top"
                  src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
                  alt={product.name}
                  style={{ height: '500px', width: '100%', objectFit: 'cover' }}
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
                  <FaDollarSign /> Price:{' '}
                  {product?.price?.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </p>

                <p>
                  <FaProjectDiagram /> Category: {product?.category?.name}
                </p>

                <p>
                  <FaRegClock /> Added: {moment(product.createdAt).fromNow()}
                </p>

                <p>
                  {product?.quantity > 0 ? <FaCheck /> : <FaTimes />}{' '}
                  {product?.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </p>

                <p>
                  <FaWarehouse /> Available {product?.quantity - product?.sold}
                </p>

                <p>
                  <FaRocket /> Sold {product.sold}
                </p>
              </div>
            </div>

            <button
              className="btn btn-outline-primary col card-button"
              style={{
                borderBottomRightRadius: '5px',
                borderBottomLeftRadius: '5px',
              }}
              onClick={() => {
                setCart([...cart, product]);
                toast.success('Added to cart');
              }}
            >
              Add to Cart
            </button>
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
                <option value={0}>Оберіть рейтинг</option>
                <option value={1}>1 зірка</option>
                <option value={2}>2 зірки</option>
                <option value={3}>3 зірки</option>
                <option value={4}>4 зірки</option>
                <option value={5}>5 зірок</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleAddComment}>
              Додати
            </button>
          </div>
          <CommentsList comments={commentsData} handleReply={handleReply} />
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
