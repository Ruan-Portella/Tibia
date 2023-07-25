"use client";

import Image from "next/image";
import style from "../styles/login.module.css";
import Form from "react-bootstrap/Form";
import loginImage from "../images/loginBanner.svg";
import { useRouter } from 'next/navigation';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import {GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google';
import axios from "axios";
import Swal from "sweetalert2";

const HOST = process.env.NEXT_PUBLIC_API_HOST || "localhost:3001";
const PROTOCOL = process.env.NEXT_PUBLIC_API_PROTOCOL || "http";
const CLIENTID = process.env.NEXT_PUBLIC_CLIENT_ID || 'seu_client_id';
const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME || "localhost:3000";

export default function Home() {
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validatedFields, setValidateFields] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError('');

    await axios
      .post(`${PROTOCOL}://${HOST}/api/auth/login`, {
        email: signUpData.email,
        password: signUpData.password,
        remember: signUpData.remember,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admin", response.data.admin);
        localStorage.setItem("userName", response.data.name);
        localStorage.setItem("userId", response.data.id);

        if (response.data.admin) {
          router.push(`${HOSTNAME}/admin`);
        } else {
          router.push(`${HOSTNAME}/user/${response.data.id}`);
        }
      })
      .catch((error) => {
        if (error.response.data.error === 'Senha incorreta') {
          setError('Senha ou Usuário incorretos');
        } else {
          setError(error.response.data.error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const handleChange = (data) => {
    setSignUpData({
      ...signUpData,
      [data.name]: data.value,
    });
  };

  useEffect(() => {
    const validateFields = () => {
      const regex = /\S+@\S+\.\S+/;
      setValidateFields({
        password: signUpData.password.length >= 6,
        email: regex.test(signUpData.email),
      });
    };
    validateFields();
  }, [signUpData]);

  return (
    <GoogleOAuthProvider clientId={CLIENTID}>
      <main>
        <Container fluid>
          <Row className={style.loginContent}>
            <Col className={style.loginBanner}>
              <Image
                className={style.image}
                src={loginImage}
                priority
                alt="jobHunt Login Image"
              ></Image>
              <a href="https://storyset.com/job" target="_blank">Job illustrations by Storyset</a>
            </Col>
            <Col className={style.loginForm}>

              <Row className={style.formTitle}>
                <h1>Login</h1>
              </Row>

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={signUpData.email}
                      isValid={validatedFields.email}
                      isInvalid={!validatedFields.email}
                      onChange={({ target }) =>
                        handleChange({name: "email", value: target.value})
                      }
                      placeholder="Enter Email"
                    />
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <div className={style.inputPassword}>
                      <Form.Control
                        className={style.formPassword}
                        type={showPassword ? "text" : "password"}
                        value={signUpData.password}
                        isValid={validatedFields.password}
                        isInvalid={!validatedFields.password}
                        onChange={({ target }) =>
                          handleChange({name: "password", value: target.value})
                        }
                        placeholder="Password"
                      />
                      {
                        showPassword ? ( <AiFillEyeInvisible cursor='pointer' size={20} onClick={() => setShowPassword(false)} /> ) : (
                          <AiFillEye size={20}  cursor='pointer' onClick={() => setShowPassword(true)} />
                        )
                      }
                    </div>
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Manter Conectado"
                      id="checkbox-remember"
                      onClick={() =>
                        handleChange({name: "remember", value: !signUpData.remember})
                      }
                    />
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Text>
                    {error && <p className={style.error}>{error}</p>}
                  </Form.Text>
                </Row>

                <Row>
                  <Button
                    type="submit"
                    className={style.buttonForm}
                    disabled={ loading || !validatedFields.email || !validatedFields.password }
                  >
                    {loading ? (
                      <Spinner animation="border" variant="light" size="sm" />
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </Row>

              </Form>
              <Row>
                <Form.Text className="text-muted">
                  Ou entre com
                </Form.Text>
              </Row>
              <GoogleLogin
                onSuccess={async credentialResponse => {
                  await axios.post(`${PROTOCOL}://${HOST}/api/auth/loginWithGoogle`, {
                    credential: credentialResponse.credential,
                  }).then((response) => {

                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("admin", response.data.admin);
                    localStorage.setItem("userName", response.data.name);
                    localStorage.setItem("userId", response.data.id);

                    if (response.status === 200) {
                      let timerInterval;
                      Swal.fire({
                        icon: 'success',
                        title: 'Você conseguiu fazer login!',
                        html: 'Sendo redirecionado em poucos instantes.',
                        allowOutsideClick: false,
                        timer: 2000,
                        timerProgressBar: true,
                        didOpen: () => {
                          Swal.showLoading();
                        },
                        willClose: () => {
                          clearInterval(timerInterval);
                          if (response.data.admin) {
                            router.push(`${HOSTNAME}/admin`);
                          } else {
                            router.push(`${HOSTNAME}/user/${response.data.id}`);
                          }
                        }
                      });
                    }
                  })
                    .catch((error) => {
                      setError(error.response.data.error)   
                    });
                }}
                onError={() => {
                  console.log('Login Failed');
                }}/>
            </Col>
          </Row>
        </Container>
      </main>
    </GoogleOAuthProvider>
  );
}
