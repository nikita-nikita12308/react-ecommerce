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
  return (
    <div className="col-md-4 mb-5">
      <h4>Підсумок вашого кошика </h4>
      Всього / Адреса / Оформлення
      <hr />
      <h6>Всього: {handleUpdateCart()}</h6>
      {auth?.user?.address ? (
        <>
          <div className="mb-3">
            <hr />
            <h4>Адрес доставки:</h4>
            <h5>{auth?.user?.address}</h5>
          </div>
          <button
            className="btn btn-outline-warning"
            onClick={() => navigate('/dashboard/user/profile')}
          >
            Оновити адрес
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
              Увійдіть щоб замовити
            </button>
          )}
        </div>
      )}
      <div className="mt-3">
        {!cart?.length ? (
          ''
        ) : (
          <>
            <button
              className="btn btn-primary col-12 mt-2"
              disabled={!auth?.user?.address}
            >
              <NavLink
                className="nav-link"
                aria-current="page"
                to="/order-form"
                cart={cart}
              >
                Перейти до оформлення
              </NavLink>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
