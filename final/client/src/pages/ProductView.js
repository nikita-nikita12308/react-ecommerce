import { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Badge } from 'antd';
import {
  FaDollarSign,
  FaProjectDiagram,
  FaRegClock,
  FaCheck,
  FaTimes,
  FaTruckMoving,
  FaWarehouse,
  FaRocket,
} from 'react-icons/fa';
import ProductCard from '../components/cards/ProductCard';
import toast from 'react-hot-toast';
import { useCart } from '../context/cart';

export default function ProductView() {
  // context
  const [cart, setCart] = useCart();
  // state
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  // hooks
  const params = useParams();

  useEffect(() => {
    if (params?.slug) loadProduct();
  }, [params?.slug]);

  const loadProduct = async (req, res) => {
    try {
      const { data } = await axios.get(`/product/${params.slug}`);
      setProduct(data);
      loadRelated(data._id, data.category._id);
    } catch (err) {
      console.log(err);
    }
  };

  const loadRelated = async (productId, categoryId) => {
    try {
      const { data } = await axios.get(
        `/related-products/${productId}/${categoryId}`
      );
      setRelated(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-9">
          <div className="card mb-3">
            <Badge.Ribbon text={`${product?.sold} sold`} color="red">
              <Badge.Ribbon
                text={`${
                  product?.quantity >= 1
                    ? `${product?.quantity - product?.sold} in stock`
                    : 'Out of stock'
                }`}
                placement="start"
                color="green"
              >
                <img
                  className="card-img-top"
                  src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
                  alt={product.name}
                  style={{ height: '500px', width: '100%', objectFit: 'cover' }}
                />
              </Badge.Ribbon>
            </Badge.Ribbon>

            <div className="card-body">
              <h1 className="fw-bold">{product?.name}</h1>
              <p className="card-text lead">{product?.description}</p>
            </div>

            <div className="d-flex justify-content-between lead p-5 bg-light fw-bold">
              <div>
                <p>
                  <FaDollarSign /> Price:{' '}
                  {product?.price?.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </p>

                <p>
                  <FaProjectDiagram /> Category: {product?.category?.name}
                </p>

                <p>
                  <FaRegClock /> Added: {moment(product.createdAt).fromNow()}
                </p>

                <p>
                  {product?.quantity > 0 ? <FaCheck /> : <FaTimes />}{' '}
                  {product?.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </p>

                <p>
                  <FaWarehouse /> Available {product?.quantity - product?.sold}
                </p>

                <p>
                  <FaRocket /> Sold {product.sold}
                </p>
              </div>
            </div>

            <button
              className="btn btn-outline-primary col card-button"
              style={{
                borderBottomRightRadius: '5px',
                borderBottomLeftRadius: '5px',
              }}
              onClick={() => {
                setCart([...cart, product]);
                toast.success('Added to cart');
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div className="col-md-3">
          <h2>Related Products</h2>
          <hr />
          {related?.length < 1 && <p>Nothing found</p>}
          {related?.map((p) => (
            <ProductCard p={p} key={p._id} />
          ))}
        </div>
      </div>
      <h4>Коментарі</h4>
      <div className="d-flex flex-column flex-md-row p-4 gap-4 py-md-5">
        <div className="list-group list-group-checkable d-grid gap-2 border-0">
          <div>
            <label
              className="list-group-item rounded-3 py-3"
              htmlFor="listGroupCheckableRadios1"
            >
              Andre
              <span className="d-block small opacity-50">
                With support text underneath to add more detail
                dqwqwdwdqwdqwdddddddddddddddddddddddddddddd
              </span>
            </label>
          </div>

          <div>
            <label
              className="list-group-item rounded-3 py-3"
              htmlFor="listGroupCheckableRadios2"
            >
              Maria
              <span className="d-block small opacity-50">
                Some other text goes here
              </span>
            </label>
          </div>

          <div>
            <label
              className="list-group-item rounded-3 py-3"
              htmlFor="listGroupCheckableRadios3"
            >
              RRayan23
              <span className="d-block small opacity-50">
                And we end with another snippet of text
              </span>
            </label>
          </div>

          <div>
            <label
              className="list-group-item rounded-3 py-3"
              htmlFor="listGroupCheckableRadios4"
            >
              Borgomi
              <span className="d-block small opacity-50">
                This option is disabled
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
