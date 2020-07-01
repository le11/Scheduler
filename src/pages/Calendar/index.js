import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../../services/api";
import {
  Modal,
  Button,
  Form,
  Navbar,
  Nav,
  FormControl,
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TimePicker from "react-bootstrap-time-picker";
import { TOKEN_KEY } from "../../services/auth";

const Home = () => {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [events, setEvents] = useState(2);
  const [moreText, setMoreText] = useState("mais");
  const [modalShow, setModalShow] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [date, setDate] = useState(new Date());
  const [room, setRoom] = useState("");
  const [creationUser, setCreationUser] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("0");
  const [logon, setLogon] = useState("0");
  const [filterRoom, setFilterRoom] = useState("0");
  const [filterEvents, setFilterEvents] = useState("0");

  useEffect(() => {
    api.get("/calendar/events").then((response) => {
      setCurrentEvents(response.data);
    });
  }, []);

  useEffect(() => {
    api.get("/user/all").then((response) => {
      const _users = response.data.map((user) => user.sAMAccountName);

      setUsers(_users.sort());
    });
  }, []);

  useEffect(() => {
    api
      .get("/user/verify/" + localStorage.getItem(TOKEN_KEY))
      .then((response) => {
        setLogon(response.data.username);
      });
  }, []);

  const handleModal = () => {
    modalShow === true ? setModalShow(false) : setModalShow(true);
  };

  const handleStartChange = (time) => {
    setStart(time);
  };

  const handleEndChange = (time) => {
    time < start ? console.log("Erro!") : setEnd(time);
  };

  const handleEventClick = (clickInfo) => {
    alert(clickInfo.event.id);
  };

  const handleSelectedUser = (e) => {
    const user = e.target.value;

    setSelectedUser(user);
  };

  const handleSubmit = async (e) => {};

  const renderSidebar = () => {
    return (
      <div className="sidebar">
        <p id="login-user">
          Olá, <strong>{logon}</strong>
        </p>
        <div id="nav-links">
          <button onClick={handleModal}>AGENDAR</button>
          <button>CANCELAR</button>
        </div>
        <div className="nav-buttons">
          <p>Salas de reunião</p>
          <Form.Group controlId="formBasicRoom">
            <Form.Control
              as="select"
              onChange={(e) => setFilterRoom(e.target.value)}
              size="sm"
              custom
              id="mycustomForm"
            >
              <option value="0">TODAS</option>
              <option value="4">SALA 1 - Recepção</option>
              <option value="2">SALA 2 - Recepção</option>
              <option value="3">SALA 3 - TV</option>
              <option value="1">SALA 1 - DataShow</option>
              <option value="5">SALA Plotter</option>
            </Form.Control>
          </Form.Group>
          <p>Solicitante</p>
          <Form.Group controlId="formBasicRoom">
            <Form.Control
              as="select"
              onChange={(e) => setFilterEvents(e.target.value)}
              size="sm"
              custom
              id="mycustomForm"
            >
              <option value="0">TODOS</option>
              <option value="1">Meus</option>
            </Form.Control>
          </Form.Group>
        </div>
      </div>
    );
  };

  const renderModal = () => {
    return (
      <>
        <Modal show={modalShow}>
          <Modal.Header>
            <Modal.Title>Novo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formBasicUser">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedUser}
                  onChange={handleSelectedUser}
                >
                  <option value="0">{logon}</option>
                  {users.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formBasicRoom">
                <Form.Label>Sala</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setRoom(e.target.value)}
                >
                  <option value="0">Selecione uma sala</option>
                  <option value="4">SALA 1 - Recepção</option>
                  <option value="2">SALA 2 - Recepção</option>
                  <option value="3">SALA 3 - TV</option>
                  <option value="1">SALA 1 - DataShow</option>
                  <option value="5">SALA Plotter</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Data</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => setDate(e.target.value)}
                  value={date}
                />
              </Form.Group>
              <Form.Group controlId="formBasicTime">
                <Form.Label>Início</Form.Label>
                <TimePicker
                  format={24}
                  start="08:00"
                  end="18:00"
                  step={30}
                  onChange={handleStartChange}
                  value={start}
                />
              </Form.Group>
              <Form.Group controlId="formBasicTime">
                <Form.Label>Fim</Form.Label>
                <TimePicker
                  format={24}
                  start="08:00"
                  end="18:00"
                  step={30}
                  onChange={handleEndChange}
                  value={end}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModal}>
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const renderSubtitle = () => {
    return (
      <div className="sub">
        <svg 
        height="100" 
        width="100">
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="#d61a1a "
          />
        </svg>
        <p>SALA 1 - Recepção</p>
        <svg 
        height="100" 
        width="100">
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="#d7ed2d "
          />
        </svg>
        <p>SALA 2 - Recepção</p>
        <svg 
        height="100" 
        width="100">
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="#08cc08 "
          />
        </svg>
        <p>SALA 3 - TV</p>
        <svg 
        height="100" 
        width="100">
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="#E2A9F3 "
          />
        </svg>
        <p>SALA 1 - DataShow</p>
        <svg 
        height="100" 
        width="100">
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="#17e6d4 "
          />
        </svg>
        <p>SALA Plotter</p>
      </div>
    );
  };
  return (
    <div className="calendario">
      {renderSidebar()}
      {renderModal()}
      <div className="main">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          locale="pt-br"
          initialView="dayGridMonth"
          selectMirror={true}
          selectable={true}
          editable={true}
          weekends={weekendsVisible}
          // select={this.handleDateSelect}
          events={currentEvents}
          dayMaxEvents={events}
          moreLinkText={moreText}
          eventClick={handleEventClick}
          aspectRatio="1.4"
          // eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:
              eventAdd={function(){}}
              eventChange={function(){}}
              eventRemove={function(){}}
              */
        />
      </div>
      {renderSubtitle()}
    </div>
  );
};
export default Home;
