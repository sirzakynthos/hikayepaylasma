import NavLinks from "./NavLinks";
import "./Navigation.css";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <header className="main-header">
      <h1 className="main-navigation__title">
        <Link to="/">MyApp</Link>
      </h1>
      <NavLinks></NavLinks>
    </header>
  );
};

export default Navigation;
