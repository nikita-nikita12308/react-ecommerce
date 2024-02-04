import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import UserMenu from "../../components/nav/UserMenu";
import axios from "axios";
import moment from "moment";
import OrderProductCardHorizontal from "../../components/cards/OrderProductCardHorizontal";

export default function UserOrders() {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/orders");
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return (
    <>
      <Jumbotron
        title={`Вітаємо ${auth?.user?.name}`}
        subTitle="Панель користувача"
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Замовлення</div>

            {orders
              ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((o, i) => {
                return (
                  <div
                    key={o._id}
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
                          <td>{o?.orderNumber}</td>
                          <td>{o?.status}</td>
                          <td>{o?.buyer?.name}</td>
                          <td>{moment(o?.createdAt).fromNow()}</td>
                          <td>
                            {o?.payment?.success ? "Оплачено" : "Не оплачено"}
                            {" - "}
                            {o?.cartTotal} грн
                          </td>
                          <td>{o?.products?.length} артикулів</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="container">
                      <div className="row m-2">
                        {console.log(o.products)}
                        {o?.products?.map((p, i) => (
                          <OrderProductCardHorizontal
                            key={i}
                            p={p}
                            total={o.cartTotal}
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
