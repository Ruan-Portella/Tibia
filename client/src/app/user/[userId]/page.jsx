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

export default function DashBoard() {
  const [usersChars, setUserChars] = useState([]);
  const [filteredUsesChars, setFilteredUsersChars] = useState([]);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    };
    const getUser = async () => {
      await axios.get(`${PROTOCOL}://${HOST}/api/user/${params.userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
        .then((res) => {
            setUserChars(res.data.chars);
            setFilteredUsersChars(res.data.chars);
        })
        .catch((err) => {
          if (err.response.status === 401 || err.response.status === 500) {
            router.push('/');
          }
        });
    };

    getUser();

  }, [router]);

  const deleteChar = async (id) => {
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
          axios.delete(`${PROTOCOL}://${HOST}/api/user/${params.userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            data: {
              id,
            }
          })
            .then(() => {
              const removedChar = usersChars.filter((char) => char._id !== id);
              if (removedChar) {
                setUserChars(removedChar);
                setFilteredUsersChars(removedChar);
              } else {
                setUserChars([]);
                setFilteredUsersChars([]);
              }
            }).catch((err) => {
              Swal.fire(
                'Deletado!',
                `O Personagem não foi deletado: ${err.response.data.message}`,
                'error'
              );
            });

          Swal.fire(
            'Deletado!',
            'O Personagem foi deletado com sucesso.',
            'success'
          );
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          Swal.fire(
            'Cancelado!',
            'Seu Personagem foi salvo :)',
            'error'
          );
        }
      });
  };

  const createChar = async () => {
    Swal.fire({
      title: 'Cria um novo personagem',
      html: `
      <input id="charName" class="swal2-input" placeholder="CharName" autofocus>
      <select id="isPrincipal" class="swal2-select" placeholder="Principal">
      <option value='false'>Personagem Principal?</option>
      <option value="true">Verdadeiro</option>
      <option value="false">Falso</option>
      </select>
      <input id="level" class="swal2-input" placeholder="Level">
      <input id="vocation" class="swal2-input" placeholder="Vocação">
    `,
      showCancelButton: true,
      confirmButtonText: 'Criar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          const token = localStorage.getItem('token');
          const charName = document.getElementById('charName');
          const isPrincipal = document.getElementById('isPrincipal');
          const level = document.getElementById('level');
          const vocation = document.getElementById('vocation');


          if (charName.value && isPrincipal.value && level.value && vocation.value) {

            await axios.post(`${PROTOCOL}://${HOST}/api/user/${params.userId}`, {
              charName: charName.value,
              level: level.value,
              vocation: vocation.value,
              isPrincipal: isPrincipal.value,
            }, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            })
              .then((res) => {
                if (res.status === 201) {
                  const newChar = {
                    _id: res.data._id,
                    charName: charName.value,
                    level: level.value,
                    vocation: vocation.value,
                    isPrincipal: isPrincipal.value,
                  };

                  setUserChars([...usersChars, newChar]);
                  setFilteredUsersChars([...usersChars, newChar]);
                  Swal.fire(
                    'Personagem Criado',
                    'Parabéns',
                    'success'
                  );
                }
              })
              .catch((err) => {
                Swal.fire(
                  'Falhou!',
                  `O Personagem não foi criado: ${err.response.data.message}`,
                  'error'
                );
              },
              router.push('/')
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

  const updateChar = async (id, charName, isPrincipal, level, vocation) => {
    Swal.fire({
      title: 'Editar Personagem',
      html: `
      <input id="charName" class="swal2-input" placeholder="CharName" autofocus>
      <select id="isPrincipal" class="swal2-select" placeholder="Principal">
      <option value="true">Verdadeiro</option>
      <option value="false">Falso</option>
      </select>
      <input id="level" class="swal2-input" placeholder="Level">
      <input id="vocation" class="swal2-input" placeholder="Vocação">
    `,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      showLoaderOnConfirm: true,
      didOpen: () => {
        const newCharName = document.getElementById('charName');
        const newIsPrincipal = document.getElementById('isPrincipal');
        const newLevel = document.getElementById('level');
        const newVocations = document.getElementById('vocation');
        newCharName.value = charName;
        newIsPrincipal.value = isPrincipal;
        newLevel.value = level;
        newVocations.value = vocation
      },
    })
      .then(async (result) => {
        const token = localStorage.getItem('token');
        const newCharName = document.getElementById('charName');
        const newIsPrincipal = document.getElementById('isPrincipal');
        const newLevel = document.getElementById('level');
        const newVocations = document.getElementById('vocation');

        if (result.isConfirmed) {
          if (newCharName && newIsPrincipal && newLevel && newVocations) {
            await axios.put(`${PROTOCOL}://${HOST}/api/user/${params.userId}`, {
                id,
                charName: newCharName.value,
                level: newLevel.value,
                vocation: newVocations.value,
                isPrincipal: newIsPrincipal.value,
            }, {
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            })
              .then((res) => {
                if (res.status === 200) {

                  usersChars.filter((char) => {
                    if (char._id === id) {
                        char.charName = newCharName.value;
                        char.level = newLevel.value;
                        char.vocation = newVocations.value;
                        char.isPrincipal = newIsPrincipal.value;
                    }
                  });

                  setUserChars([...usersChars]);
                  setFilteredUsersChars([...usersChars]);
                  Swal.fire(
                    'Personagem Editado',
                    'Parabéns',
                    'success'
                  );
                }
              })
              .catch((err) => {
                console.log(err);

                Swal.fire(
                  'Falhou!',
                  `O Personagem não foi editado: ${err.response.data.message}`,
                  'error'
                );
              },
              router.push('/')
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

  const filterChars = (value) => {
    const filteredUsesChar = usersChars.filter((chars) => chars.charName
      .toLowerCase().includes(value.toLowerCase()));
      setFilteredUsersChars(filteredUsesChar);
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
                onChange={(e) => filterChars(e.target.value)}
                className={styles.formControl}
                placeholder="Filtrar por Nome"
                aria-label="Filter"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Col>
          <Col className={styles.button}>
            <Button variant="primary" type="submit" onClick={() => createChar()}>
              <IoMdAdd size={20} /> Adicionar Personagem
            </Button>
          </Col>
        </Row>
        {
          filteredUsesChars.length === 0 && (
            <Row className={styles.notCharRow}>
              <h2 className={styles.notChar}>
                Nenhum personagem salvo
              </h2>
            </Row>
          )
        }
        <Row className={styles.dashBoardRow}>
          <Col className={styles.dashBoardCol}>
            <div className={styles.dashBoardTable}>
              {
                filteredUsesChars.length >= 1 && (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Principal</th>
                        <th>Level</th>
                        <th>Vocação</th>
                        <th>Operações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        filteredUsesChars.map((chars, index) => {
                          return (
                            <tr key={chars._id} className={filteredUsesChars.length > 1 ? '' : 'trFirst'}>
                              <td data-title='#'>{index + 1}</td>
                              <td data-title='Nome'>{chars.charName}</td>
                              <td data-title='Principal'>{`${chars.isPrincipal}`}</td>
                              <td data-title='Level'>{chars.level}</td>
                              <td data-title='Vocação'>{chars.vocation}</td>
                              <td data-title='Operações' >
                                <div className={styles.thOperations}>
                                  <BiEdit size={27} className={styles.editBtn} onClick={() => updateChar(chars._id, chars.charName, chars.isPrincipal, chars.level, chars.vocation)} />
                              |
                                  <BiTrashAlt size={27} className={styles.deleteBtn} onClick={() => deleteChar(chars._id)} />
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