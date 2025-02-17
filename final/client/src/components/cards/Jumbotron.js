export default function Jumbotron({
  title,
  subTitle = "Вітаємо вас в нашому магазині!",
}) {
  return (
    <div
      className="container-fluid jumbotron"
      style={{ marginTop: "-8px", height: "200px" }}
    >
      <div className="row">
        <div className="col text-center p-5">
          <h1 className="fw-bold">{title}</h1>
          <p className="lead">{subTitle}</p>
        </div>
      </div>
    </div>
  );
}
