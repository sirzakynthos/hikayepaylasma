import { NavLink } from "react-router-dom";
import "./NavLinks.css";
import { UserContext } from "../../contexts/user-context";
import { useContext } from "react";
import { SignOutHelper } from "../../utils/firebase";
import { Fragment } from "react";

const NavLinks = () => {
  const userCtx = useContext(UserContext);
  const user = userCtx.currentUser;

  console.log("navlinks run", user);
  const signOutHandler = async () => {
    try {
      await SignOutHelper();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav>
      <ul className="nav-links">
        {user ? (
          <span onClick={signOutHandler}>Logout ({user.displayName})</span>
        ) : (
          <Fragment>
            <li>
              <NavLink to="/sign-in">Sign In</NavLink>
            </li>
            <li>
              <NavLink to="/sign-up">Sign Up</NavLink>
            </li>
          </Fragment>
        )}
      </ul>
    </nav>
  );
};

export default NavLinks;
