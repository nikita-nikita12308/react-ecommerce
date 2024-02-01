import { useState } from "react";
import { NavLink } from "react-router-dom";
import Jumbotron from "../../components/cards/Jumbotron";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  // state
  const [email, setEmail] = useState("ryan@gmail.com");
  const [codeSent, setCodeSent] = useState(false);
  // console.log("location => ", location);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/forgot-password`, {
        email,
      });
      if (data?.success) {
        toast.success("Лист відпралений");
        setCodeSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Такої пошти не існує");
    }
  };

  return (
    <div>
      <Jumbotron title="Forgot Password" />

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-4 p-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                className="btn btn-primary"
                type="submit"
                disabled={codeSent}
              >
                {codeSent ? "Код відправлений на пошту" : "Відправити код"}
              </button>
              <button type="button" class="btn btn-link">
                <NavLink className="nav-link" to="/Login">
                  Вхід
                </NavLink>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
