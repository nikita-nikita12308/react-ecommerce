import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/cart';

const centerFormStyle = {
  display: 'flex',
  justifyContent: 'center',
  minHeight: '100vh',
  marginTop: '40px',
};

const headerStyle = {
  marginBottom: '20px',
  marginRight: '20px',
};

function OrderForm() {
  const [cart, setCart] = useCart();
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    city: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    const calculateTotal = () => {
      let newTotal = 0;
      cart.forEach((item) => {
        newTotal += item.price * (item.cart_quantity || 1);
      });
      return newTotal;
    };

    const newTotal = calculateTotal();
    setTotal(newTotal);
  }, [cart]);

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle form submission (e.g., send data to the server)
    console.log('Form submitted:', JSON.stringify(formData));
  };

  // JSX for the form page with Bootstrap styling
  return (
    <div>
      <div style={centerFormStyle}>
        <form className="col-md-6" onSubmit={handleSubmit}>
          <div style={headerStyle}>
            <h2 className="mb-4">Оформлення замовлення</h2>
            <h6>
              <a className="navbar-brand" href="/">
                Головна
              </a>
              / Оформлення замовлення
            </h6>
          </div>

          <div>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Ім'я Прізвище
              </label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                placeholder="Ваше Ім'я Прізвище"
                required
                onChange={handleInputChange}
                name="fullName"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="city" className="form-label">
                Місто / Село
              </label>
              <input
                type="text"
                className="form-control"
                id="city"
                placeholder="Ваше Місто / Село"
                required
                onChange={handleInputChange}
                name="city"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="region" className="form-label">
                Область / Округ
              </label>
              <input
                type="text"
                className="form-control"
                id="region"
                placeholder="Ваша Область / Округ"
                required
                onChange={handleInputChange}
                name="region"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="postNumber" className="form-label">
                Номер відділення Нової Пошти
              </label>
              <input
                type="text"
                className="form-control"
                id="postNumber"
                placeholder="Номер відділення Нової Пошти"
                required
                onChange={handleInputChange}
                name="postNumber"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Телефон
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                placeholder="Ваш номер телефону"
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Пошта
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Ваша електронна пошта"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <h5>Ваше замовлення</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Товар</th>
                    <th scope="col">Проміжний підсумок</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.name} x {item.cart_quantity}
                      </td>
                      <td>
                        {(item.price * item.cart_quantity).toLocaleString(
                          'uk-UA',
                          { style: 'currency', currency: 'UAH' }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                Загалом:{' '}
                {total.toLocaleString('uk-UA', {
                  style: 'currency',
                  currency: 'UAH',
                })}
              </p>
            </div>
            <div className="mb-3">
              <p>Виберіть спосіб оплати:</p>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="cashOnDelivery"
                  value="cash"
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="cashOnDelivery">
                  Оплата готівкою або карткою при отриманні у відділенні Нової
                  пошти
                </label>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Підтвердити замовлення
          </button>
        </form>
      </div>
    </div>
  );
}

// Export the component
export default OrderForm;
