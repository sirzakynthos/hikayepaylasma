import { useState } from "react";
import Input from "../Input/Input";
import { SignInWithEmailHelper } from "../../utils/firebase";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await SignInWithEmailHelper(email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
    }
  };
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  };
  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
  };
  return (
    <form className="signin-form">
      <h2>Sign in</h2>
      <Input value={email} onChange={emailChangeHandler} type="email">
        E-mail
      </Input>
      <Input value={password} onChange={passwordChangeHandler} type="password">
        Password
      </Input>
      <button onClick={submitHandler}>Sign In</button>
    </form>
  );
};

export default SignIn;
