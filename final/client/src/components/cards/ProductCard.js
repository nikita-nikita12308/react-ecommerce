import { Badge } from 'antd';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/cart';
import React, { useState } from 'react';

export default function ProductCard({ p }) {
  // context
  const [cart, setCart] = useCart();
  const [quantity, setQuantity] = useState(1);
  let newPrice = p.price * quantity;
  // hooks
  const navigate = useNavigate();
  const updateQuantity = (newQuantity) => {
    setQuantity(newQuantity);
    // Тут ви також можете оновити кількість товару в кошику, використовуючи ваш контекст кошика
  };
  return (
    <div className="card mb-3 hoverable">
      <Badge.Ribbon text={`${p?.sold} sold`} color="red">
        <Badge.Ribbon
          text={`${
            p?.quantity >= 1
              ? `${p?.quantity - p?.sold} in stock`
              : 'Out of stock'
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

        <h4 className="fw-bold">
          {newPrice.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
          <input
            className="input_number"
            type="number"
            value={quantity}
            onChange={(e) => updateQuantity(e.target.value)}
          />
        </h4>

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
