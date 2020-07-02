import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import ptLocale from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../../services/api";
import { Modal, Button, Form } from "react-bootstrap";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TimePicker from "react-bootstrap-time-picker";
import { TOKEN_KEY, logout } from "../../services/auth";
import moment from "moment";
import exitIcon from "../../resources/exit-icon.png";
import { useHistory } from "react-router-dom";

const Home = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [start, setStart] = useState("28800");
  const [end, setEnd] = useState("");
  const [date, setDate] = useState(new Date());
  const [room, setRoom] = useState("0");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("0");
  const [logon, setLogon] = useState("0");
  const [filterRoom, setFilterRoom] = useState("0");
  const [filterEvents, setFilterEvents] = useState("0");
  const [error, setError] = useState(null);
  const [logado, setLogado] = useState();

  const locales = [ptLocale];
  const history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      api
      .get("/user/verify/" + localStorage.getItem(TOKEN_KEY))
      .then((response) => {
        if (response.statusText === "OK" && response.status >= 200) {
          setLogon(response.data.username);
          setLogado(true);
        } else {
          throw new Error("Sessão expirada!");
        }
      })
      .catch((error) => {
        history.push("/");// Token expired
      });
    }, 1000)
    return () => clearInterval(interval);
  }, [history]);

  useEffect(() => {

      async function getEvents() {
        if (filterRoom === "0" && filterEvents === "0") {
          const response = await api.get("/calendar/events");
  
          setCurrentEvents(response.data);
        } else if (filterEvents === "0" && filterRoom !== "0") {
          const params = {
            room_id: filterRoom,
          };
          const response = await api.get("/calendar/events", { params });
  
          setCurrentEvents(response.data);
        } else if (filterEvents !== "0" && filterRoom === "0") {
          const params = {
            user: logon,
          };
          const response = await api.get("/calendar/events", { params });
  
          setCurrentEvents(response.data);
        } else {
          const params = {
            user: logon,
            room_id: filterRoom,
          };
          const response = await api.get("/calendar/events", { params });
          setCurrentEvents(response.data);
        }
      }
      getEvents();

  }, [filterEvents, filterRoom, logon]);

  useEffect(() => {
    if (logado) {
      api.get("/user/all").then((response) => {
        const _users = response.data.map((user) => user.sAMAccountName);

        setUsers(_users.sort());
      });
    }
  }, [logado]);

  const resetValues = () => {
    setSelectedUser(logon);
    setRoom("0");
    setStart("28800");
    setEnd("");
  };

  const handleModal = () => {
    modalShow === true ? setModalShow(false) : setModalShow(true);
    resetValues();
  };

  const handleStartChange = (time) => {
    setStart(time);
  };

  const handleEndChange = (time) => {
    if (time < start) {
      setError("Hora fim deve ser maior que início");
    } else {
      setEnd(time);
      setError(null);
    }
  };

  const handleEventClick = (clickInfo) => {
    alert(clickInfo.event.id);
  };

  const handleSelectedUser = (e) => {
    const user = e.target.value;

    setSelectedUser(user);
  };

  const handleSubmit = async () => {
    if (end <= start) {
      setError("Hora fim deve ser maior que início!");
    } else if (room === "0") {
      setError("Selecione uma sala!");
    } else {
      const schedule_date = date;
      const schedule_user = selectedUser;
      const start_time = (start / 60).toString();
      const end_time = (end / 60).toString();
      const all_day = "0";
      const creation_user = logon;
      const creation_date = moment(date).format("yyyy-MM-DD");
      const room_id = room;

      const data = {
        schedule_date,
        schedule_user,
        start_time,
        end_time,
        all_day,
        creation_user,
        creation_date,
        room_id,
      };

      const response = await api.post("/calendar/event", data);
      if (response.status === 201) {
        setModalShow(false);
        alert("Sala agendada com sucesso!");
      } else {
        setModalShow(false);
        alert("Ocorreu um erro!");
      }
      window.location.reload();
    }
  };
  


  const handleDateSelect = (selectInfo) => {
    setDate(selectInfo.startStr);
    handleModal();
  };

  const handleLogout = () => {
    logout();
  };

  const renderSidebar = () => {
    return (
      <div className="sidebar">
        <p id="login-user">
          Olá, <strong>{logon}</strong>
        </p>
        <div className="nav-buttons">
          <p>Salas de reunião</p>
          <Form.Group>
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
          <Form.Group>
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
        <div id="logout">
          <img src={exitIcon} alt="logout" id="exit-icon" />
          <button onClick={handleLogout}>Sair</button>
        </div>
      </div>
    );
  };

  const renderModal = () => {
    return (
      <>
        <Modal
          show={modalShow}
          onHide={handleModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Novo agendamento</Modal.Title>
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
                  <option value={logon}>{logon}</option>
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
              <Form.Group controlId="formBasicTime1">
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
              <Form.Group controlId="formBasicTime2">
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
            {error && <p id="error">{error}</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModal}>
              Fechar
            </Button>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Criar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const renderSubtitle = () => {
    return (
      <div className="sub">
        <svg height="100" width="100">
          <circle cx="50" cy="50" r="8" fill="#d61a1a " />
        </svg>
        <p>SALA 1 - Recepção</p>
        <svg height="100" width="100">
          <circle cx="50" cy="50" r="8" fill="#d7ed2d " />
        </svg>
        <p>SALA 2 - Recepção</p>
        <svg height="100" width="100">
          <circle cx="50" cy="50" r="8" fill="#08cc08 " />
        </svg>
        <p>SALA 3 - TV</p>
        <svg height="100" width="100">
          <circle cx="50" cy="50" r="8" fill="#E2A9F3 " />
        </svg>
        <p>SALA 1 - DataShow</p>
        <svg height="100" width="100">
          <circle cx="50" cy="50" r="8" fill="#17e6d4 " />
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
          locales={locales}
          initialView="dayGridMonth"
          selectMirror={true}
          selectable={true}
          editable={true}
          weekends={true}
          select={handleDateSelect}
          events={currentEvents}
          dayMaxEvents={2}
          moreLinkText="mais"
          eventClick={handleEventClick}
          aspectRatio="1.4"
        />
      </div>
      {renderSubtitle()}
    </div>
  );
};
export default Home;
