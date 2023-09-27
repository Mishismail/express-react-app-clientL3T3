import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Row, Col, ListGroup, Button, Form, InputGroup, Alert } from 'react-bootstrap';

function App() {
  // Define state variables for web projects, new web project, alert message, and editable project
  const [webProjects, setWebProjects] = useState([]);
  const [newWebProject, setNewWebProject] = useState({ title: '', description: '', url: '' });
  const [alertMessage, setAlertMessage] = useState('');
  const [editableProject, setEditableProject] = useState(null);

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWebProjects(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle input change for the new web project form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWebProject({ ...newWebProject, [name]: value });
  };

  // Handle adding a new web project
  const handleAddWebProject = async () => {
    try {
      if (!newWebProject.title || !newWebProject.description || !newWebProject.url) {
        setAlertMessage('All fields are required.');
        return;
      }
      if (!newWebProject.url.startsWith('www')) {
        setAlertMessage('URL must start with "www".');
        return;
      }
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWebProject),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setWebProjects([...webProjects, data.webProject]);
      setNewWebProject({ title: '', description: '', url: '' });
      setAlertMessage('Web project added successfully.');
    } catch (error) {
      console.error('Error adding web project:', error);
      setAlertMessage('Error adding web project.');
    }
  };

  // Handle deleting a web project
  const handleDeleteWebProject = async (id) => {
    try {
      const response = await fetch(`/api/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setWebProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
      setAlertMessage('Web project deleted successfully.');
    } catch (error) {
      console.error('Error deleting web project:', error);
      setAlertMessage('Error deleting web project.');
    }
  };

  // Handle clicking the edit button for a web project
  const handleEditClick = (project) => {
    setEditableProject(project);
  };

  // Handle saving changes to a web project
  const handleSaveWebProject = async (id, updatedProject) => {
    try {
      const response = await fetch(`/api/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProject),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const updatedProjects = webProjects.map((project) =>
        project.id === id ? data.webProject : project
      );
      setWebProjects(updatedProjects);
      setAlertMessage('Web project updated successfully.');
      setEditableProject(null);
    } catch (error) {
      console.error('Error updating web project:', error);
      setAlertMessage('Error updating web project.');
    }
  };

  // Render the component
  return (
    <Container className="App">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h1 className="text-center"><b>Web Projects</b></h1>
          {alertMessage && (
            <Alert variant="success" onClose={() => setAlertMessage('')} dismissible>
              {alertMessage}
            </Alert>
          )}
        </Col>
      </Row>
      {/* Render the list of web projects */}
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <ListGroup>
            {webProjects.map((project) => (
              <ListGroup.Item key={project.id} style={{ marginBottom: '10px' }}>
                {editableProject === project ? (
                  // Render the edit form for the selected project
                  <div>
                    <Form.Control
                      type="text"
                      placeholder="Title"
                      name="title"
                      value={project.title}
                      onChange={(e) => handleInputChange(e, project.id)}
                      required // Make the title field required
                    />
                    <Form.Control
                      type="text"
                      placeholder="Description"
                      name="description"
                      value={project.description}
                      onChange={(e) => handleInputChange(e, project.id)}
                      required // Make the description field required
                    />
                    <Form.Control
                      type="text"
                      placeholder="URL"
                      name="url"
                      value={project.url}
                      onChange={(e) => handleInputChange(e, project.id)}
                      required // Make the URL field required
                      pattern="www.*" // Ensure the URL starts with "www"
                    />
                    <Button
                      variant="success"
                      onClick={() => handleSaveWebProject(project.id, project)}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  // Render the project details and buttons for non-editable projects
                  <div>
                    <div>{project.title}</div>
                    <div>{project.description}</div>
                    <div>{project.url}</div>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteWebProject(project.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleEditClick(project)}
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      {/* Render the form for adding a new web project */}
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2><b>Add New Web Project</b></h2>
          <Form>
            <Form.Group>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  name="title"
                  value={newWebProject.title}
                  onChange={handleInputChange}
                  required // Make the title field required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Description"
                name="description"
                value={newWebProject.description}
                onChange={handleInputChange}
                required // Make the description field required
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="URL"
                name="url"
                value={newWebProject.url}
                onChange={handleInputChange}
                required // Make the URL field required
                pattern="www.*" // Ensure the URL starts with "www"
              />
              <Button variant="success" onClick={handleAddWebProject}>
                Add
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default App;



