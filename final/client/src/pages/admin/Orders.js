import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import axios from "axios";
import moment from "moment";
import OrderProductCardHorizontal from "../../components/cards/OrderProductCardHorizontal";
import { Select } from "antd";

const { Option } = Select;

export default function AdminOrders() {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState([
    "Не оброблено",
    "Обробка",
    "Відправлено",
    "Доставлено",
    "Скасовано",
  ]);
  const [paymentStatus, setPaymentStatus] = useState([
    "Не оплачено",
    "Оплачено",
  ]);

  const [changedStatus, setChangedStatus] = useState("");
  const [changedPaymentStatus, setChangedPaymentStatus] = useState("");

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/all-orders");
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = async (orderId, value) => {
    setChangedStatus(value);
    try {
      const { data } = await axios.put(`/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (err) {
      console.log(err);
    }
  };
  const handlePaymentChange = async (orderId, value) => {
    setChangedPaymentStatus(value);
    try {
      const { data } = await axios.put(`/payment-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Jumbotron
        title={`Вітаємо ${auth?.user?.name}`}
        subTitle="Панель адміністратора"
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Замовлення</div>

            {orders?.map((o, i) => {
              return (
                <div
                  key={o.orderNumber}
                  className="border shadow bg-light rounded-4 mb-5"
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Статус</th>
                        <th scope="col">Покупець</th>
                        <th scope="col">Замовлено</th>
                        <th scope="col">Оплата</th>
                        <th scope="col">Кількість</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>
                          <Select
                            bordered={false}
                            onChange={(value) => handleChange(o._id, value)}
                            defaultValue={o?.status}
                          >
                            {status.map((s, i) => (
                              <Option key={i} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td>{o?.fullName}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>
                          {o?.cartTotal} грн
                          {" - "}
                          <Select
                            bordered={false}
                            onChange={(value) =>
                              handlePaymentChange(o._id, value)
                            }
                            defaultValue={o?.paymentStatus}
                          >
                            {paymentStatus.map((ps, i) => (
                              <Option key={i} value={ps}>
                                {ps}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td>{o?.products?.length} Артикули</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="container">
                    <div className="row m-2">
                      {o?.products?.map((p, i) => (
                        <OrderProductCardHorizontal
                          key={i}
                          p={p}
                          remove={false}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
