'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import '../styles/header.css'
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap"

export default function Header() {
    const [userId, setUserId] = useState('');
    const [activeLink, setActiveLink] = useState('home');
    const [isToggler, setIsToggler] = useState(false);
    const [pathUser, setPathUser] = useState('user');
    const route = useRouter();
    const params = useParams();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const admin = localStorage.getItem('admin');
        if (!token) {
            route.push('/');
        }
        if (admin === 'true') {
            setPathUser('admin')
        }
        setUserId(params.userId)
    }, []);

    return (
    <header>
    <Navbar collapseOnSelect expand="lg">
      <Container>
        <Navbar.Brand href={`/${pathUser}/${userId}`}>
          <p className="brandLogo">Brazilian Squad</p>
        </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" className={isToggler ? 'hamburger-x' : ''} onClick={() => isToggler ? setIsToggler(false) : setIsToggler(true)}>
                <span className="hamburger-icon"></span>
              </Navbar.Toggle>
              <Navbar.Offcanvas
                className='offcanvas_dark'
                id={`offcanvasNavbar-expand-lg`}
                aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
                placement="end">
                <Offcanvas.Body>
                  <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                      <Nav.Link
                         href={`/${pathUser}/${userId}`}
                        className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'}
                        onClick={() => {
                          setActiveLink('home');
                          setIsToggler(false)
                          return false;
                        }}
                      >
                        Inicio
                      </Nav.Link>
                      <Nav.Link
                        className={activeLink === 'profile' ? 'active navbar-link' : 'navbar-link'}
                        onClick={() => {
                          setActiveLink('profile');
                          setIsToggler(false)
                          return false;
                        }}
                      >
                        Profile
                      </Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
      </Container>
    </Navbar>
    </header>
    )
}