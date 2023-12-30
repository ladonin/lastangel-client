import React, { ChangeEventHandler, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useOutletContext } from "react-router-dom";
import PAGES from "routing/routes";
import { saveUserData, isAuthorized } from "utils/user";
import { UserApi } from "api/user";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { loadItem } from "utils/localStorage";
import "./style.scss";

const Signin: React.FC = () => {
  const isMobile = loadItem("isMobile");
  const navigate = useNavigate();
  const { checkMail } = useOutletContext<any>();
  const [loginState, setLoginState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [errorTextState, setErrorTextState] = useState("");

  const setLogin: ChangeEventHandler<HTMLInputElement> = (e) => {
    setLoginState(e.target.value);
  };

  const setPassword: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPasswordState(e.target.value);
  };

  const sendHandler = () => {
    UserApi.signin({ login: loginState, password: passwordState }).then((res) => {
      if (res.status === "error") {
        setErrorTextState(res.data);
      } else {
        setErrorTextState("");
        saveUserData(res.data);
        checkMail();
        navigate(PAGES.MAIN);
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Вход</title>
      </Helmet>
      <div className="page-signin">
        {isAuthorized() && <div className="loc_title">Вы уже вошли</div>}
        {!isAuthorized() && (
          <>
            <div className="loc_title">Вход</div>
            <input type="text" onChange={setLogin} placeholder="Логин" />
            <input type="password" onChange={setPassword} placeholder="Пароль" />
            {errorTextState && <div className="loc_errorText">{errorTextState}</div>}
            <Button
              theme={ButtonThemes.PRIMARY}
              size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
              disabled={!loginState || !passwordState}
              onClick={sendHandler}
            >
              Войти
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default Signin;
