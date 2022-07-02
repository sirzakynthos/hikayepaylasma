import { useState } from "react";
import Input from "../Input/Input";
import { SignUpWithEmailHelper } from "../../utils/firebase";
import { useContext } from "react";
import { UserContext } from "../../contexts/user-context";

const SignUp = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userCtx = useContext(UserContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await SignUpWithEmailHelper(name, surname, email, password);
      userCtx.setCurrentUser((prev) => {
        return { ...prev, displayName: name };
      });
    } catch (error) {
      console.log(error);
    }
  };
  const nameChangeHandler = (e) => {
    setName(e.target.value);
  };
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  };
  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
  };
  const surnameChangeHandler = (e) => {
    setSurname(e.target.value);
  };
  return (
    <form className="signup-form">
      <h2>Sign up</h2>
      <Input value={name} onChange={nameChangeHandler} type="text">
        Name
      </Input>
      <Input value={surname} onChange={surnameChangeHandler} type="text">
        Surname
      </Input>
      <Input value={email} onChange={emailChangeHandler} type="email">
        E-mail
      </Input>
      <Input value={password} onChange={passwordChangeHandler} type="password">
        Password
      </Input>
      <button onClick={submitHandler}>Sign Up</button>
    </form>
  );
};

export default SignUp;
