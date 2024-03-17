import { useEffect, useState } from "react";
import {
  VscSymbolMethod,
  VscAccount,
  VscComment,
  VscTrash,
  VscStarFull,
  VscCommentDiscussion,
  VscStarEmpty,
  VscSync,
} from "react-icons/vsc";
import { useAuth } from "../../context/auth";
import { NavLink } from "react-router-dom";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import axios from "axios";
import moment from "moment";
import toast from "react-hot-toast";

export default function AdminOrders() {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [comments, setComments] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentsListSize, setCommentsListSize] = useState(5);

  useEffect(() => {
    if (auth?.token) getComments(1, commentsListSize);
  }, [auth?.token]);

  const getComments = async (page, count) => {
    try {
      const { data } = await axios.get(`/comments?page=${page}&count=${count}`);
      setComments(data.comments);
    } catch (err) {
      console.log(err);
    }
  };

  const renderRating = (rating) => {
    const maxRating = 5;
    const fullStars = rating > 0 ? Math.floor(rating) : 0;
    const emptyStars = maxRating - fullStars;

    return (
      <div>
        {/* Render full stars */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <VscStarFull key={index} />
        ))}
        {/* Render empty stars */}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <VscStarEmpty key={index} />
        ))}
        ({rating})
      </div>
    );
  };

  const handleDelete = async (commentId) => {
    try {
      setIsDeleting(true);
      const { data } = await axios.delete(`/comment/${commentId}`);
      // Call getComments to fetch the updated comments list
      getComments(1, 5);
      toast.success("Коментар видалено");
    } catch (err) {
      console.log(err);
    } finally {
      setIsDeleting(false);
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
            <div className="p-3 mt-2 mb-2 h4 bg-light">Коментарі</div>
            {comments?.map((c, i) => {
              return (
                <div
                  key={c._id}
                  className="border shadow bg-light rounded-4 mb-5"
                >
                  <table className="table">
                    <thead></thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>
                          <VscAccount /> {c.user.name}
                        </td>
                        <td>
                          <VscSymbolMethod />{" "}
                          <NavLink
                            className="nav-link"
                            to={`/product/${c.product?.slug || ""}`}
                          >
                            {c.product?.name || "продукт видалений"}
                          </NavLink>
                        </td>
                        <td>Створений: {moment(c?.createdAt).fromNow()}</td>
                        <td>{renderRating(c.rating)}</td>
                        <td>
                          <button
                            className="btn"
                            onClick={() => handleDelete(c._id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <VscSync className="rotate" />
                            ) : (
                              <VscTrash />
                            )}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="container">
                    <div className="row m-2">
                      <h5>{c.text}</h5>
                      <h5></h5>
                      {c.replies?.map((r, i) => {
                        return (
                          <div
                            key={r._id}
                            className="border shadow bg-light rounded-4 mb-5"
                          >
                            <table className="table">
                              <thead>
                                <VscAccount /> {r.user.name}
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <VscCommentDiscussion />
                                    {" - "}
                                    {r.text}
                                  </td>
                                  <td></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            <button
              className="btn"
              onClick={() => {
                const newSize = commentsListSize + 5;
                // Update the commentsListSize state
                setCommentsListSize(newSize);
                // Call getComments with the updated commentsListSize
                getComments(1, newSize);
              }}
            >
              Завантажити ще
            </button>
            <button
              className="btn"
              onClick={() => {
                const newSize = 5;
                setCommentsListSize(newSize);
                getComments(1, newSize);
              }}
            >
              Повернутись на початок
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
