import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../../services/api";
import { Modal, Button, Form } from "react-bootstrap";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TimePicker from "react-bootstrap-time-picker";


export default class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weekendsVisible: true,
      currentEvents: [],
      events: 2,
      moreText: "mais",
      modalShow: false,
      start: "",
      end: "",
      date: new Date(),
      formattedDate: "",
      room: "",
      creationUser: ""
    };

    this.handleEvents();
    this.handleModal();
    this.handleStartChange();
    this.handleEndChange();
    // this.handleDateChange();
  }
  handleEvents = async () => {
    const response = await api.get("/calendar/events");
    this.setState({
      currentEvents: response.data,
    });
  };

  handleModal = () => {
    this.state.modalShow === true
      ? this.setState({ modalShow: false })
      : this.setState({ modalShow: true });
  };

  handleStartChange = (time) => {
    this.setState({ start: time });
  };

  handleEndChange = (time) => {
    time < this.state.start
      ? console.log("Erro!")
      : this.setState({ end: time });
  };

  // handleDateChange = async (date) => {
  //   var formattedDate = dateFormat(date, "isoDateTime");
  //   await this.setState({
  //     date: date,
  //     formattedDate: formattedDate,
  //   });
  //   console.log(this.state.formattedDate);
  // };

  handleEventClick = (clickInfo) => {
    alert(clickInfo.event.id);
  };

  handleSubmit = async (e) => {
    const room = this.state.room;
    console.log(room);
  };

  render() {
    return (
      <div className="calendario">
        <Button variant="primary" onClick={this.handleModal}>
          Teste
        </Button>
        {this.renderModal()}
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
            weekends={this.state.weekendsVisible}
            // select={this.handleDateSelect}
            events={this.state.currentEvents}
            dayMaxEvents={this.state.events}
            moreLinkText={this.state.moreText}
            eventClick={this.handleEventClick}
            // eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
              eventAdd={function(){}}
              eventChange={function(){}}
              eventRemove={function(){}}
              */
          />
        </div>
      </div>
    );
  }

  renderModal() {
    console.log(this.state.date);
    return (
      <>
        <Modal show={this.state.modalShow}>
          <Modal.Header>
            <Modal.Title>Novo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formBasicUser">
                <Form.Label>Nome</Form.Label>
                <Form.Control as="select">
                  <option>Default select</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formBasicRoom">
                <Form.Label>Sala</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => this.setState({ room: e.target.value })}
                >
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
                  onChange={(e) => this.setState({ date: e.target.value })}
                  value={this.state.date}
                />
              </Form.Group>
              {/* <Form.Group controlId="formBasicDate">
                <Form.Label>Data</Form.Label>
                <br />
                <DatePicker
                  className="datePicker"
                  required={true}
                  onChange={this.handleDateChange}
                  value={this.state.date}
                  format="dd/MM/yyyy"
                  locale="pt-BR"
                />
              </Form.Group> */}
              <Form.Group controlId="formBasicTime">
                <Form.Label>Início</Form.Label>
                <TimePicker
                  format={24}
                  start="08:00"
                  end="18:00"
                  step={30}
                  onChange={this.handleStartChange}
                  value={this.state.start}
                />
              </Form.Group>
              <Form.Group controlId="formBasicTime">
                <Form.Label>Fim</Form.Label>
                <TimePicker
                  format={24}
                  start="08:00"
                  end="18:00"
                  step={30}
                  onChange={this.handleEndChange}
                  value={this.state.end}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleModal}>
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={this.handleSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
