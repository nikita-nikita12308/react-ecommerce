import { NavLink } from 'react-router-dom';

export default function UserMenu() {
  return (
    <>
      <div className="p-3 mt-2 mb-2 h4 bg-light">Посилання для користувача</div>

      <ul className="list-group list-unstyled">
        <li>
          <NavLink className="list-group-item" to="/dashboard/user/profile">
            Профіль
          </NavLink>
        </li>

        <li>
          <NavLink className="list-group-item" to="/dashboard/user/orders">
            Замовлення
          </NavLink>
        </li>
      </ul>
    </>
  );
}
