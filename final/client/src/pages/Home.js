import { useEffect, useState } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import axios from "axios";
import ProductCard from "../components/cards/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
    getTotal();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/products-count");
      setTotal(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadProducts = async () => {
    try {
      const { data } = await axios.get(`/list-products/${page}`);
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };
  //test comment
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/list-products/${page}`);
      setProducts([...products, ...data]);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const arr = [...products];
  const sortedBySold = arr?.sort((a, b) => (a.sold < b.sold ? 1 : -1));

  return (
    <div>
      <Jumbotron
        title={
          <div style={{ height: "" }}>
            <img
              src="logo.png"
              alt="Your Image"
              style={{ marginRight: "10px", height: "90px" }}
            />
            Сирна Насолода
          </div>
        }
        sutTitle="Home Page"
      />
      <div className="container-fluid">
        <div className="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3 mx-auto">
          <div
            className="bg-body-tertiary me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden mx-auto"
            style={{ flex: "0 0 33%" }}
          >
            <div className="my-3 p-3">
              <h2 className="display-5">Рай для любителів сирів</h2>
              <p className="lead">Від місцевих сироварень до вашого порогу!</p>
            </div>
            <div
              className="justify-content-center align-items-center"
              style={{
                width: "100%",
                height: "300px",
                borderRadius: "21px 21px 0 0",
              }}
            >
              <img
                src="thumbnail1.jpg"
                alt="Your Image"
                style={{
                  width: "",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)",
                }}
              />
            </div>
          </div>
          <div
            className="bg-tertiary-color me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden"
            style={{ flex: "0 0 32%" }}
          >
            <div className="my-3 py-3">
              <h2 className="display-5">
                Відкрийте для себе досконалість місцевих сирів.
              </h2>
              <p className="lead">
                Відкрийте для себе смак, де кожен шматочок розповідає історію.
              </p>
            </div>
            <div
              className="text-center"
              style={{
                width: "100%",
                height: "300px",
                borderRadius: "21px 21px 0 0",
                marginBottom: "20px",
              }}
            >
              <img
                src="thumbnail3.jpg"
                alt="Your Image"
                style={{
                  width: "",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)",
                }}
              />
            </div>
          </div>
          <div
            className="bg-body-tertiary me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden"
            style={{ flex: "0 0 33%" }}
          >
            <div className="my-3 p-3">
              <h2 className="display-5">Кулінарна пригода чекає!</h2>
              <p className="lead">
                Відкрийте для себе досконалість місцевих сирів.
              </p>
            </div>
            <div
              className="text-center"
              style={{
                width: "100%",
                height: "300px",
                borderRadius: "21px 21px 0 0",
              }}
            >
              <img
                src="thumbnail2.jpg"
                alt="Your Image"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)",
                }}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">
              Нові надходження
            </h2>
            <div className="row">
              {products?.map((p) => (
                <div className="col-md-6" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-6">
            <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">Популярні</h2>
            <div className="row">
              {sortedBySold?.map((p) => (
                <div className="col-md-6" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container text-center p-5">
          {products && products.length < total && (
            <button
              className="btn btn-warning btn-lg col-md-6"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                setPage(page + 1);
              }}
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
