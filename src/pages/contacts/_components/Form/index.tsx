/*
  import Form from 'pages/contacts/_components/Form'
  Форма отправки письма клиентом
 */
import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FeedbacksApi } from "api/feedbacks";
import { loadItem } from "utils/localStorage";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import Textarea from "components/Form/Textarea";
import InputText from "components/Form/InputText";
import FlowerImage from "icons/flower1.png";
import "./style.scss";

const Form: React.FC = () => {
  const isMobile = loadItem("isMobile");
  const [topicState, setTopicState] = useState<string>("");
  const [fioState, setFioState] = useState<string>("");
  const [phoneState, setPhoneState] = useState<string>("");
  const [emailState, setEmailState] = useState<string>("");
  const [textState, setTextState] = useState<string>("");
  const [captchaState, setCaptchaState] = useState<boolean>(false);
  const [errorTextState, setErrorTextState] = useState("");
  const [isSentState, setIsSentState] = useState(false);

  const emailRef = useRef<any>(null);
  const phoneRef = useRef<any>(null);

  const sendHandler = () => {
    let isValid = true;

    if (!emailRef.current.validate()) {
      isValid = false;
    }
    if (!phoneRef.current.validate()) {
      isValid = false;
    }

    if (!isValid) {
      setErrorTextState("Некорректно указаны данные");
    } else {
      setErrorTextState("");
      FeedbacksApi.add({
        fio: fioState,
        phone: phoneState,
        email: emailState,
        text: textState,
      }).then(() => {
        setIsSentState(true);
      });
    }
  };

  return (
    <div className="page-contacts_form">
      {isSentState && (
        <div className="loc_success">
          <img alt="загружаю" src={FlowerImage} />
          Ваше сообщение успешно отправлено.
        </div>
      )}
      {!isSentState && (
        <>
          <h2 className="loc_title">Обратная связь</h2>
          <InputText
            required
            placeholder="Тема"
            onChange={(val) => {
              setTopicState(val);
            }}
            className="loc_formInputItem"
          />
          <InputText
            required
            placeholder="Ваше имя"
            onChange={(val) => {
              setFioState(val);
            }}
            className="loc_formInputItem"
          />
          <InputText
            required
            placeholder="Телефон"
            innerRef={phoneRef}
            type="phone"
            onChange={(val) => {
              setPhoneState(val);
              setErrorTextState("");
            }}
            className="loc_formInputItem"
          />
          <InputText
            placeholder="E-mail"
            type="email"
            innerRef={emailRef}
            onChange={(val) => {
              setEmailState(val);
              setErrorTextState("");
            }}
            className="loc_formInputItem"
          />

          <Textarea
            maxWords={1024}
            onChange={(val) => {
              setTextState(val);
            }}
            placeholder="Ваш вопрос/предложение"
            required
            className="loc_formTextareaItem loc__shortdescription"
          />
          {errorTextState && <div className="loc_error">{errorTextState}</div>}
          {false && isMobile === false && (
            <ReCAPTCHA
              sitekey="6Ldvqv0mAAAAADuVHYfsejSXeL-eH9Ko3WAerhzm"
              onChange={() => setCaptchaState(true)}
            />
          )}

          <Button
            theme={ButtonThemes.PRIMARY}
            size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
            disabled={
              !topicState ||
              !fioState ||
              !phoneState ||
              !textState ||
              (false && isMobile === false && !captchaState)
            }
            onClick={sendHandler}
          >
            Отправить
          </Button>
        </>
      )}
    </div>
  );
};

export default Form;

// ReCAPTCHA - в мобилке не изменяется размер, в русском домене дает ошибку
