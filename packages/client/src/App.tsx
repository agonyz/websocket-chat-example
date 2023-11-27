import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';

// set up socket
const socket: Socket = io('http://localhost:3001');

const App: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; message: string, color: string }[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    // set up event listener for receiving chat messages
    socket.on('chat-message', (data: { sender: string; message: string, color: string }) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // set up event listener for user joining the chat
    socket.on('user-joined', (data: { user: string, color: string }) => {
      const systemMessage = {
        sender: 'System',
        message: `${data.user} has joined the room.`,
        color: data.color
      }
      setMessages((prevMessages) => [...prevMessages, systemMessage]);
    });

    // clean up the event listener when the component unmounts - important to not send events multiple times
    return () => {
      socket.off('chat-message');
      socket.off('user-joined');
    };
  }, []);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim() !== '') {
      socket.emit('chat-message', input);
      setInput('');
    }
  };

  return (
      <Container className="vh-100 d-flex flex-column justify-content-center">
        <Row>
          <Col className="overflow-auto" style={{ maxHeight: '600px' }}>
            <ListGroup>
              {messages.map((msg, index) => (
                  <ListGroup.Item key={index}>
                    <span style={{color: msg.color}}>{msg.sender}:</span> {msg.message}
                  </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
        <Row className="align-self-center">
          <Col className="mx-auto">
            <Form onSubmit={sendMessage}>
              <Row>
                <Col xs={9}>
                  <Form.Control
                      type="text"
                      placeholder="Type your message"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                  />
                </Col>
                <Col xs={3}>
                  <Button variant="primary" type="submit">
                    Send
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
  );
};

export default App;