'use client';

import Header from "@/components/Header";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import style from '@/styles/profile.module.css';
import Image from "next/image";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Spinner } from "react-bootstrap";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";

const HOST = process.env.NEXT_PUBLIC_API_HOST || "localhost:3001";
const PROTOCOL = process.env.NEXT_PUBLIC_API_PROTOCOL || "http";

export default function Profile() {
  const [signUpData, setSignUpData] = useState({
    nome: "",
    email: "",
    password: "",
    tell: '',
    newPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validatedFields, setValidateFields] = useState({ email: false, password: false, nome: false, tell: false });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    };
    const getUserInfo = async () => {
      await axios.get(`${PROTOCOL}://${HOST}/api/user/${params.userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }).then((res) => {
        setSignUpData({
          ...signUpData,
          nome: res.data.username,
          email: res.data.email,
          tell: res.data.tell,
        });
      })
        .catch((err) => {
          if (err.response.status === 401 || err.response.status === 500) {
            router.push('/');
          }
        });
    };
    getUserInfo();
  }, []);

  const handleChange = (data) => {
    setSignUpData({
      ...signUpData,
      [data.name]: data.value,
    });
  };

  const handleSubmit = async (event) => {
    const token = localStorage.getItem('token');
    event.preventDefault();
    setLoading(true);
    setError('');

    Swal.fire({
      icon: 'warning',
      title: 'Deseja Alterar suas informações?',
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      showLoaderOnConfirm: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        let data = {
          email: signUpData.email,
          tell: signUpData.tell,
          username: signUpData.nome,
        };
    
        signUpData.newPassword ? data = {
          ...data,
          password: signUpData.password,
        } : data;
    
    
        await axios
          .put(`${PROTOCOL}://${HOST}/api/user/${params.userId}/profile`, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Perfil atualizado com sucesso!',
              });
            }
          })
          .catch((error) => {
            if (error.response.data.message === "Token inválido") {
              router.push('/');
            }
            else {
              setError(error.response.data.message);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Suas informações não foram alteradas',
          'error'
        );
      }
      setLoading(false);
    });

  };

  useEffect(() => {
    const validateFields = () => {
      const regex = /\S+@\S+\.\S+/;
      setValidateFields({
        password: signUpData.password.length >= 6,
        email: regex.test(signUpData.email),
        nome: signUpData.nome.length >= 3,
        tell: signUpData.tell.length >= 8,
      });
    };

    validateFields();
  }, [signUpData]);

  return (
    <Container fluid>
      <Header></Header>
      <Row>
        <Col className={style.col}>
          <h1 className={style.title}>Perfil</h1>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit} className={style.form}>
        <Row>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={signUpData.nome}
              isValid={validatedFields.nome}
              isInvalid={!validatedFields.nome}
              className={style.inputGroup}
              onChange={({ target }) =>
                handleChange({ name: "nome", value: target.value })
              }
              placeholder="Enter Your Name"
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="number"
              value={signUpData.tell}
              isValid={validatedFields.tell}
              isInvalid={!validatedFields.tell}
              className={style.inputGroup}
              onChange={({ target }) =>
                handleChange({ name: "tell", value: target.value })
              }
              placeholder="Enter Your Phone Number"
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={signUpData.email}
              isValid={validatedFields.email}
              isInvalid={!validatedFields.email}
              className={style.inputGroup}
              onChange={({ target }) =>
                handleChange({ name: "email", value: target.value })
              }
              placeholder="Enter Email"
            />
          </Form.Group>
        </Row>


        <Row>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Alterar Senha"
              id="checkbox-remember"
              onClick={() =>
                handleChange({ name: "newPassword", value: !signUpData.newPassword })
              }
            />
          </Form.Group>
        </Row>

        {signUpData.newPassword && (
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
                    handleChange({ name: "password", value: target.value })
                  }
                  placeholder="Password"
                />
                {
                  showPassword ? (<AiFillEyeInvisible color="black" cursor='pointer' size={20} onClick={() => setShowPassword(false)} />) : (
                    <AiFillEye size={20} color="black" cursor='pointer' onClick={() => setShowPassword(true)} />
                  )
                }
              </div>
            </Form.Group>
          </Row>
        )}

        <Row>
          <Form.Text>
            {error && <p className={style.error}>{error}</p>}
          </Form.Text>
        </Row>

        <Row>
          <Button
            type="submit"
            className={style.buttonForm}
            disabled={loading || !validatedFields.email || signUpData.newPassword && !validatedFields.password}
          >
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </Row>
      </Form>
    </Container>
  );
}