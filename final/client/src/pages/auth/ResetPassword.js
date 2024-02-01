import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Jumbotron from "../../components/cards/Jumbotron";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  // state
  const [password, setPassword] = useState("rrrrrr");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  // hook
  const navigate = useNavigate();
  const location = useLocation();

  // console.log("location => ", location);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.success(token);
      toast.error("Паролі не однакові");
      return;
    }
    try {
      const { data } = await axios.post(`/reset-password/${token}`, {
        password,
      });
      // console.log(data);
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Пароль змінено");
        navigate(location.state || `/login`);
      }
    } catch (err) {
      console.log(err);
      toast.error("Внутрішня помилка");
    }
  };

  return (
    <div>
      <Jumbotron title="Reset Password" />

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <form onSubmit={handleSubmit}>
              <h5>Новий пароль</h5>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control mb-4 p-2"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <h5>Підтвердити пароль</h5>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control mb-4 p-2"
                placeholder="Enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Створити новий пароль
              </button>
              <button
                type="button"
                className="btn btn-link"
                onClick={handleTogglePassword}
              >
                {showPassword ? "Сховати паролі" : "Показати паролі"}
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
