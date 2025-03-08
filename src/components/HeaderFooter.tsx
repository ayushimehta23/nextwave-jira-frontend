"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchProjects } from "@/app/store/slices/projectSlice";
import { logout } from "@/app/store/slices/authSlice";
import { RootState, AppDispatch } from "@/app/store/store";
import { Navbar, Nav, NavDropdown, Button, Container } from "react-bootstrap";
import { FaSignOutAlt, FaTachometerAlt, FaProjectDiagram, FaCog, FaColumns } from "react-icons/fa";

const HeaderFooter = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
const token = localStorage.getItem("token")
console.log(token, "token")
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const { projects } = useSelector((state: RootState) => state.projects);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Header */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} href="/dashboard" className="fw-bold">
            Jira Clone
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} href="/dashboard">
                <FaTachometerAlt className="me-2" /> Dashboard
              </Nav.Link>
              <NavDropdown title={<><FaProjectDiagram className="me-2" /> Projects</>} id="projects-dropdown">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <NavDropdown.Item key={project.id} onClick={() => router.push(`/projects/${project.id}`)}>
                      {project.name}
                    </NavDropdown.Item>
                  ))
                ) : (
                  <NavDropdown.Item disabled>No Projects</NavDropdown.Item>
                )}
              </NavDropdown>
              <NavDropdown title={<><FaColumns className="me-2" /> Kanban Boards</>} id="kanban-dropdown">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <NavDropdown.Item key={project.id} onClick={() => router.push(`/projects/${project.id}/kanban`)}>
                      {project.name} Kanban
                    </NavDropdown.Item>
                  ))
                ) : (
                  <NavDropdown.Item disabled>No Kanban Boards</NavDropdown.Item>
                )}
              </NavDropdown>
              <Nav.Link as={Link} href="/settings">
                <FaCog className="me-2" /> Settings
              </Nav.Link>
            </Nav>
            {token && (
            <Button variant="danger" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> Logout
            </Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main className="container-fluid flex-grow-1 overflow-auto">{children}</main>

      {/* Footer */}
      <footer className="bg-dark text-center text-white py-3 mt-auto">
        <Container>
          <p className="mb-0">© 2025 Jira Clone. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default HeaderFooter;
