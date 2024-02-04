import moment from "moment";
import "moment/locale/uk"; // Import Ukrainian locale
import { useCart } from "../../context/cart";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
moment.locale("uk");
export default function ProductCardHorizontal({ p, remove = true, total }) {
  // context
  const [cart, setCart] = useCart();
  const [quantity, setQuantity] = useState(p.product.cart_quantity);
  let newPrice = p.product.price * quantity;

  return (
    <div
      className="card mb-3"
      // style={{ maxWidth: 540 }}
    >
      <div className="row g-0">
        <div className="col-md-4">
          <NavLink className="nav-link" to={`/product/${p.product.slug}`}>
            <img
              src={`${process.env.REACT_APP_API}/product/photo/${p.product._id}`}
              alt={p.product.name}
              style={{
                height: "150px",
                width: "150px",
                objectFit: "cover",
                marginLeft: "-12px",
                borderRopRightRadius: "0px",
              }}
            />
          </NavLink>
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">
              <NavLink className="nav-link" to={`/product/${p.product.slug}`}>
                <strong>{p.product.name} </strong>
              </NavLink>

              {p.product.price.toLocaleString("uk-UA", {
                style: "currency",
                currency: "UAH",
              })}
              {", "}
              {`Кількість: ${p.quantity}`}
            </h5>
            <p className="card-text">{`${p?.product?.description?.substring(
              0,
              50
            )}..`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
