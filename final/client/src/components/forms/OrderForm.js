// Import necessary React libraries
import React, { useState } from 'react';

// Additional CSS for centering the form
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

// Functional component for the form page
function OrderForm() {
  // State variables to store form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    phone: '',
    email: '',
    orderNotes: '',
  });

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
    console.log('Form submitted:', formData);
  };

  // JSX for the form page with Bootstrap styling
  return (
    <div>
      <div style={centerFormStyle}>
        <form className="col-md-6">
          <div style={headerStyle}>
            <h2 className="mb-4">Оформлення замовлення</h2>
            <h6>
              <a className="navbar-brand" href="/">
                Головна
              </a>
              / Оформлення замовлення
            </h6>
          </div>

          <form>
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
              />
            </div>
            <div className="mb-3">
              <label htmlFor="postNumber" className="form-label">
                Номер відділення Нової Пошти
              </label>
              <input
                type="number"
                className="form-control"
                id="postNumber"
                placeholder="Номер відділення Нової Пошти"
                required
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
              />
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
                />
                <label className="form-check-label" htmlFor="cashOnDelivery">
                  Оплата готівкою або карткою при отриманні у відділенні Нової
                  пошти
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="prepaid"
                  value="prepaid"
                  disabled
                />
                <label className="form-check-label disabled" htmlFor="prepaid">
                  Передплата на карту Приватбанку
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="prepaid"
                  value="prepaid"
                  disabled
                />
                <label className="form-check-label disabled" htmlFor="prepaid">
                  Оплата криптовалютою
                </label>
              </div>
            </div>
          </form>
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
