import React, { useState, useEffect, useReducer,useRef,useContext } from "react";
import AuthContext from "../../context/auth-context";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import UserInput from "./UserInput";

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT")
    return { value: action.val, isValid: action.val.includes("@") };

  if (action.type === "INPUT_BLUR")
    return { value: state.value, isValid: state.value.includes("@") };

  return { value: "", isValid: false };
};

const passReducer = (state, action) => {
  if (action.type === "USER_PASS")
    return { value: action.val, isValid: action.val.trim().length > 6 };

  if (action.type === "PASS_BLUR")
    return { value: state.value, isValid: state.value.trim().length > 6 };

  return { value: "", isValid: false };
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const ctx = useContext(AuthContext);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passState, dispatchPass] = useReducer(passReducer, {
    value: "",
    isValid: null,
  });

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passState;

  const emailInputRef = useRef();
  const passwordInputRef = useReducer();

  useEffect(() => {
    const identifier = setTimeout(() => {
      // we set a timer for pause and then we will run this function
      console.log("checkng form validity");
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      console.log("clean up");
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });

    setFormIsValid(event.target.value.includes("@") && passState.isValid);
  };

  const passwordChangeHandler = (event) => {
    dispatchPass({ type: "USER_PASS", val: event.target.value });

    setFormIsValid(event.target.value.trim().length > 6 && emailState.isValid);
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPass({ type: "PASS_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid)
    ctx.onLogin(emailState.value, passState.value);
    else if(!emailIsValid)
    emailInputRef.current.focus();
    else
    passwordInputRef.current.focus();
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <UserInput
        ref={emailInputRef}
          id="email"
          type="email"
          label="E-mail"
          value={emailState.value}
          isValid={emailIsValid}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <UserInput
        ref={passwordInputRef}
          id="password"
          type="password"
          label="Password"
          value={passState.value}
          isValid={passwordIsValid}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} >
            Login 
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
 // disabled={!formIsValid} in last button pass