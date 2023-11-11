import { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth';
import { useCart } from '../../context/cart';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import DropIn from 'braintree-web-drop-in-react';
import toast from 'react-hot-toast';
import CoinbaseCommerceButton from 'react-coinbase-commerce';
import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';

export default function UserCartSidebar() {
  // context
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  // state
  const [clientToken, setClientToken] = useState('');
  const [instance, setInstance] = useState('');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  // hooks
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.token) {
      getClientToken();
    }
  }, [auth?.token]);

  const handleUpdateCart = () => {
    const updatedTotal = cartTotal();
    return updatedTotal.toLocaleString('uk-UA', {
      style: 'currency',
      currency: 'UAH',
    });
  };

  const getClientToken = async () => {
    try {
      const { data } = await axios.get('/braintree/token');
      setClientToken(data.clientToken);
    } catch (err) {
      console.log(err);
    }
  };

  const cartTotal = () => {
    let total = 0;
    cart.map((item) => {
      total += item.price * (item.cart_quantity || 1);
    });
    return total;
  };

  const handleBuy = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      //   console.log("nonce => ", nonce);
      const { data } = await axios.post('/braintree/payment', {
        nonce,
        cart,
      });
      //   console.log("handle buy response => ", data);
      setLoading(false);
      localStorage.removeItem('cart');
      setCart([]);
      navigate('/dashboard/user/orders');
      toast.success('Payment successful');
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const handleOrderForm = () => {};
  return (
    <div className="col-md-4 mb-5">
      <h4>
        Your cart summary{' '}
        <button
          onClick={handleUpdateCart}
          className="btn btn-outline-primary btn-sm"
        >
          Update
        </button>
      </h4>
      Total / Address / Payments
      <hr />
      <h6>Total: {handleUpdateCart()}</h6>
      {auth?.user?.address ? (
        <>
          <div className="mb-3">
            <hr />
            <h4>Delivery address:</h4>
            <h5>{auth?.user?.address}</h5>
          </div>
          <button
            className="btn btn-outline-warning"
            onClick={() => navigate('/dashboard/user/profile')}
          >
            Update address
          </button>
        </>
      ) : (
        <div className="mb-3">
          {auth?.token ? (
            <>
              <button
                className="btn btn-outline-warning"
                onClick={() => navigate('/dashboard/user/profile')}
              >
                Додати адрес доставки
              </button>
            </>
          ) : (
            <button
              className="btn btn-outline-danger mt-3"
              onClick={() =>
                navigate('/login', {
                  state: '/cart',
                })
              }
            >
              Login to checkout
            </button>
          )}
        </div>
      )}
      <div className="mt-3">
        {!clientToken || !cart?.length ? (
          ''
        ) : (
          <>
            <button
              onClick={handleBuy}
              className="btn btn-primary col-12 mt-2"
              disabled={!auth?.user?.address}
            >
              Підтвердити Завмовлення
            </button>
            <button
              onClick={handleOrderForm}
              className="btn btn-primary col-12 mt-2"
              disabled={!auth?.user?.address}
            >
              Підтвердити Завмовлення
            </button>
            <NavLink className="nav-link" aria-current="page" to="/order-form">
              Форма
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}
