import useCategory from "../hooks/useCategory";
import Jumbotron from "../components/cards/Jumbotron";
import { Link } from "react-router-dom";

export default function CategoriesList() {
  const categories = useCategory();

  return (
    <>
      <Jumbotron title="Категорії" subTitle="Список всіх категорій" />

      <div className="container overflow-hidden">
        <div className="row gx-5 gy-5 mt-3 mb-5">
          {categories?.map((c) => (
            <div className="col-md-6" key={c._id}>
              <a
                href={`/category/${c.slug}`}
                className="btn btn-light col-12 text-dark p-3"
              >
                {c.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
