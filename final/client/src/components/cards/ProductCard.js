import { Badge } from 'antd';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/cart';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaStarHalf, FaRegStar } from 'react-icons/fa';

export default function ProductCard({ p }) {
  // context
  const [cart, setCart] = useCart();
  const [averageRating, setAverageRating] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  // hooks
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch average rating when the component mounts
    const fetchAverageRating = async () => {
      try {
        const { data } = await axios.get(`/product/average-rating/${p._id}`);
        setAverageRating(data.averageRating);
        setTotalRating(data.totalRating); // Set the average rating state
      } catch (err) {
        console.log(err);
      }
    };

    fetchAverageRating(); // Call the function
  }, [p._id]);
  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<FaStar key={i} style={{ color: '#FFD700' }} />);
      } else {
        stars.push(<FaRegStar key={i} style={{ color: '#FFD700' }} />);
      }
    }

    return stars;
  };

  const stars = renderStarRating(averageRating);
  const totalRatings = `(${totalRating})`;
  return (
    <div className="card mb-3 hoverable">
      <Badge.Ribbon
        text={
          <>
            {stars} {totalRatings}
          </>
        }
        color="red"
      >
        <Badge.Ribbon
          text={`${
            p?.quantity >= 1
              ? `${p?.quantity - p?.sold} в наявності`
              : 'Немає в наявності'
          }`}
          placement="start"
          color="green"
        >
          <img
            className="card-img-top"
            src={`${process.env.REACT_APP_API}/product/photo/${p._id}`}
            alt={p.name}
            style={{ height: '300px', objectFit: 'cover' }}
          />
        </Badge.Ribbon>
      </Badge.Ribbon>

      <div className="card-body">
        <h5>{p?.name}</h5>
        <p className="card-text">{p?.description?.substring(0, 60)}...</p>
      </div>

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary col card-button"
          style={{ borderBottomLeftRadius: '5px' }}
          onClick={() => navigate(`/product/${p.slug}`)}
        >
          View Product
        </button>

        <button
          className="btn btn-outline-primary col card-button"
          style={{ borderBottomRightRadius: '5px' }}
          onClick={() => {
            setCart([...cart, p]);
            localStorage.setItem('cart', JSON.stringify([...cart, p]));
            toast.success('Added to cart');
          }}
        >
          Add to Cart
        </button>
      </div>

      {/* <p>{moment(p.createdAt).fromNow()}</p>
      <p>{p.sold} sold</p> */}
    </div>
  );
}
