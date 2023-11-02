import moment from 'moment';
import { useCart } from '../../context/cart';
import React, { useState } from 'react';

export default function ProductCardHorizontal({ p, remove = true }) {
  // context
  const [cart, setCart] = useCart();
  const [quantity, setQuantity] = useState(1);
  let newPrice = p.price * quantity;

  const updateQuantity = (newQuantity) => {
    setQuantity(newQuantity);
    // Тут ви також можете оновити кількість товару в кошику, використовуючи ваш контекст кошика
  };

  const removeFromCart = (productId) => {
    let myCart = [...cart];
    let index = myCart.findIndex((item) => item._id === productId);
    myCart.splice(index, 1);
    setCart(myCart);
    localStorage.setItem('cart', JSON.stringify(myCart));
  };

  return (
    <div
      className="card mb-3"
      // style={{ maxWidth: 540 }}
    >
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={`${process.env.REACT_APP_API}/product/photo/${p._id}`}
            alt={p.name}
            style={{
              height: '150px',
              width: '150px',
              objectFit: 'cover',
              marginLeft: '-12px',
              borderRopRightRadius: '0px',
            }}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">
              {p.name}{' '}
              {newPrice.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </h5>
            <p className="card-text">{`${p?.description?.substring(
              0,
              50
            )}..`}</p>
            <input
              type="number"
              value={quantity}
              onChange={(e) => updateQuantity(e.target.value)}
            />
            {/* Додайте блок, який відображатиме ціну залежно від кількості */}
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <p className="card-text">
            <small className="text-muted">
              Listed {moment(p.createdAt).fromNow()}
            </small>
          </p>
          {remove && (
            <p
              className="text-danger mb-2 pointer"
              onClick={() => removeFromCart(p._id)}
            >
              Remove
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
