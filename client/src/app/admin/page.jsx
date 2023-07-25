'use client';

import Header from "@/components/Header";
import styles from '@/styles/user.module.css';
import axios from "axios";
import Link from "next/link";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import {  Badge, Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap";
import { BiEdit, BiTrashAlt } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';
import Swal from "sweetalert2";
import '@/styles/table.css';

const HOST = process.env.NEXT_PUBLIC_API_HOST || "localhost:3001";
const PROTOCOL = process.env.NEXT_PUBLIC_API_PROTOCOL || "http";
const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME || "localhost:3000";

export default function DashBoard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    };
    const getUser = async () => {
      await axios.get(`${PROTOCOL}://${HOST}/api/admin/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
        .then((res) => {
          setUsers(res.data);
          setFilteredUsers(res.data);
        })
        .catch((err) => {
          if (err.response.status === 401 || err.response.status === 500) {
            router.push('/');
          }
        });
    };

    getUser();

  }, [router]);

  const deleteUser = async (id) => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, quero deletar!',
      cancelButtonText: 'Não, quero cancelar!',
      reverseButtons: true
    })
      .then((result) => {
        if (result.isConfirmed) {
          const token = localStorage.getItem('token');
          axios.delete(`${PROTOCOL}://${HOST}/api/admin`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            data: {
              userId: id,
            }
          })
            .then(() => {
              const removedUser = users.filter((user) => user._id !== id);
              if (removedUser) {
                setUsers(removedUser);
                setFilteredUsers(removedUser);
              } else {
                setUsers([]);
                setFilteredUsers([]);
              }
            }).catch((err) => {
              console.log(err);
            });

          Swal.fire(
            'Deletado!',
            'O Usuário foi deletado com sucesso.',
            'success'
          );
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          Swal.fire(
            'Cancelado!',
            'O Usuário foi salvo :)',
            'error'
          );
        }
      });
  };

  const createUser = async () => {
    Swal.fire({
      title: 'Cria um novo Usuário',
      html: `
      <input id="userName" class="swal2-input" placeholder="userName" autofocus>
      <input id="email" class="swal2-input" placeholder="Email">
      <input id="tell" class="swal2-input" placeholder="Telefone">
      <select id="isAdmin" class="swal2-select" placeholder="Admin">
      <option value='false'>Usuário é admin?</option>
      <option value="true">Verdadeiro</option>
      <option value="false">Falso</option>
      </select>
    `,
      showCancelButton: true,
      confirmButtonText: 'Criar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          const adminName = localStorage.getItem('userName');
          const token = localStorage.getItem('token');
          const userName = document.getElementById('userName');
          const email = document.getElementById('email');
          const tell = document.getElementById('tell');
          const isAdmin = document.getElementById('isAdmin');


          if (userName.value && email.value && tell.value && isAdmin.value) {

            await axios.post(`${PROTOCOL}://${HOST}/api/admin/`, {
              username: userName.value,
              email: email.value,
              tell: tell.value,
              isAdmin: isAdmin.value,
            }, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            })
              .then((res) => {
                if (res.status === 201) {
                  const newUser = {
                    _id: res.data._id,
                    username: userName.value,
                    tell: tell.value,
                    createdAt: res.data.createdAt,
                    isAdmin: isAdmin.value,
                    invitedBy: adminName,
                  };

                  setUsers([...users, newUser]);
                  setFilteredUsers([...users, newUser]);
                  Swal.fire(
                    'Usuário Criado',
                    'Parabéns',
                    'success'
                  );
                }
              })
              .catch((err) => {
                Swal.fire(
                  'Falhou!',
                  `O Usuário não foi criado: ${err.response.data.message}`,
                  'error'
                );
              }
              );
          }
          else {
            Swal.fire(
              'Falhou!',
              'Você não preencheu todos os campos',
              'error'
            );
          }
        }
      });;
  };

  const updateChar = async (id, userName, tell, isAdmin) => {
    Swal.fire({
      title: 'Editar Usuário',
      html: `
      <input id="userName" class="swal2-input" placeholder="userName" autofocus>
      <input id="tell" class="swal2-input" placeholder="Telefone">
      <select id="isAdmin" class="swal2-select" placeholder="Admin">
      <option value='false'>Usuário é admin?</option>
      <option value="true">Verdadeiro</option>
      <option value="false">Falso</option>
      </select>
    `,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      showLoaderOnConfirm: true,
      didOpen: () => {
        const newUserName = document.getElementById('userName');
        const newTell = document.getElementById('tell');
        const newIsAdmin = document.getElementById('isAdmin');
        newUserName.value = userName;
        newTell.value = tell;
        newIsAdmin.value = isAdmin;
      },
    })
      .then(async (result) => {
        const token = localStorage.getItem('token');
        const newUserName = document.getElementById('userName');
        const newTell = document.getElementById('tell');
        const newIsAdmin = document.getElementById('isAdmin');

        if (result.isConfirmed) {
          if (newUserName && newTell && newIsAdmin) {
            await axios.put(`${PROTOCOL}://${HOST}/api/admin`, {
              userId: id,
              username: newUserName.value,
              tell: newTell.value,
              isAdmin: newIsAdmin.value,
            }, {
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            })
              .then((res) => {
                if (res.status === 200) {

                  users.filter((user) => {
                    if (user._id === id) {
                      user.username = newUserName.value;
                      user.tell = newTell.value;
                      user.isAdmin = newIsAdmin.value;
                    }
                  });

                  setUsers([...users]);
                  setFilteredUsers([...users]);
                  Swal.fire(
                    'Usuário Editado',
                    'Parabéns',
                    'success'
                  );
                }
              })
              .catch((err) => {
                console.log(err);

                Swal.fire(
                  'Falhou!',
                  `O Usuário não foi editado: ${err.response.data.message}`,
                  'error'
                );
              }
              );
          }
        } else if (!result.isDismissed) {
          Swal.fire(
            'Falhou!',
            'Você não preencheu todos os campos',
            'error'
          );
        }
      });
  };

  const filterUsers = (value) => {
    const filterUsers = users.filter((user) => user.username
      .toLowerCase().includes(value.toLowerCase()));
    setFilteredUsers(filterUsers);
  };

  return (
    <>
      <Header />
      <main>
        <Container fluid className={styles.container}>
          <Row className={styles.userInput}>
            <Col className={styles.inputGroup}>
              <InputGroup size="sm" className={styles.input} >
                <Form.Control
                  onChange={(e) => filterUsers(e.target.value)}
                  className={styles.formControl}
                  placeholder="Filtrar por Nome"
                  aria-label="Filter"
                  aria-describedby="basic-addon1"
                />
              </InputGroup>
            </Col>
            <Col className={styles.button}>
              <Button variant="primary" type="submit" onClick={() => createUser ()}>
                <IoMdAdd size={20} /> Adicionar Usuário
              </Button>
            </Col>
          </Row>
          <Row className={styles.dashBoardRow}>
            <Col className={styles.dashBoardCol}>
              <div className={styles.dashBoardTable}>
                {
                  filteredUsers.length >= 1 && (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Nome</th>
                          <th>Telefone</th>
                          <th>Personagens</th>
                          <th>Data de Entrada</th>
                          <th>Invitado Por</th>
                          <th>Admin</th>
                          <th>Operações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          filteredUsers.map((user, index) => {
                            return (
                              <tr key={user._id} className={filteredUsers.length > 1 ? '' : 'trFirst'}>
                                <td data-title='#'>{index + 1}</td>
                                <td data-title='Nome'>{user.username}</td>
                                <td data-title='Telefone'>{`${user.tell}`}</td>
                                <td data-title='Personagens' className={styles.char} ><Link href={`${HOSTNAME}/user/${user._id}`}>Personagens</Link></td>
                                <td data-title='Data de Entrada'>{user.createdAt}</td>
                                <td data-title='Invitado Por'>{user.invitedBy}</td>
                                <td data-title='Admin'>{`${user.isAdmin}`}</td>
                                <td data-title='Operações' >
                                  <div className={styles.thOperations}>
                                    <BiEdit size={27} className={styles.editBtn} onClick={() => updateChar(user._id, user.username, user.tell, user.isAdmin)} />
                              |
                                    <BiTrashAlt size={27} className={styles.deleteBtn} onClick={() => deleteUser(user._id)} />
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        }
                      </tbody>
                    </Table>
                  )
                }
              </div>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
}