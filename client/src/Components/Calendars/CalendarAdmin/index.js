// import React, { Component } from "react";
import React from "react";
import API from "../../../utils/API";
import Select from "react-select";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./style.css";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
} from "reactstrap";

let optionsAdmin = [
  {
    value: "allDay",
    label: "All day Event",
  },
  {
    value: "partial",
    label: "Partial day Event",
  },
];

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

class CalendarAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmitModalToEdit = this.onSubmitModalToEdit.bind(this);

    this.state = {
      modal: false,
      modalToEditEvent: false,
      slotEvent: "",
      title: "",
      userCalendarName: "",
      appointment: "",
      appointmentEdit: "",
      eventId: "",
      editTitle: "",
      editStart: "",
      editEnd: "",
      eventToEdit: "",
      individualEventsId: "",
      cal_eventsAdmin: [
        //State is updated via componentDidMount
      ],
    };
  }

  async componentDidMount() {
    const user_id = this.props.idForUserEvents;
    axios
      .get("/auth/users/" + user_id)

      .then((response) => {
        let appointments = response.data.events;

        for (let i = 0; i < appointments.length; i++) {
          appointments[i].start = this.convertDate(appointments[i].start);
          appointments[i].end = this.convertDate(appointments[i].end);
        }
        this.setState({
          cal_eventsAdmin: appointments,
          userCalendarName: response.data.firstName,
        });
        // console.log(this.state.userCalendarName);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Modal Functions ************************************

  //Toggle for modal form to add Appointments to calendar
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  //Toggle to edit appointments on calendar
  toggleToEdit = () => {
    this.setState({
      modalToEditEvent: !this.state.modalToEditEvent,
    });
  };

  closeModal = () => {
    this.setState({
      modalToEditEvent: false,
      modal: false,
    });
  };

  //onChange for modal forms
  onChangeModal = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  //onChange for <Select /> on modal form
  onSelectedChanged = (value) => {
    this.setState({
      appointment: value,
    });
    // console.log(`Option selected:`, value);
  };

  //Submit for adding appointments to calendar (Admin)
  onSubmitModal = (e) => {
    e.preventDefault();
    let obj = {
      title: this.state.title,
      start: this.state.slotEvent.start,
      end: this.state.slotEvent.end,
      appointment: this.state.appointment.value,
    };

    if (!obj.title) {
      return alert("Event details are required!");
    }

    let _id = this.props.idForUserEvents;

    API.addAppointmentAdmin(_id, obj)

      .then((data) => console.log(data))
      .then(
        this.setState({
          slotEventStart: "",
          slotEventEnd: "",
          title: "",
          appointment: "",
          modal: false,
        })
      )
      // .then(() => this.getAppointmentsCalendarAdmin())
      .then(() => {
        this.getAppointmentsCalendarAdmin();
        this.props.getAllEvents();
      })
      .catch((error) => console.log(error));

    // this.state.cal_eventsAdmin.push(obj);
    // window.location.href = "/profile";
  };

  onSubmitModalToEdit = async (e) => {
    e.preventDefault();

    let obj = {
      _id: this.state.eventToEdit._id,
      title: this.state.editTitle,
      start: this.state.editStart,
      end: this.state.editEnd,
      appointment: this.state.appointmentEdit,
    };

    let _id = this.state.eventToEdit._id;

    await API.updateAppointmentAdmin(_id, obj)

      .then((res) => console.log(res))
      .catch((error) => console.log(error));

    window.location.href = "/profile";
  };

  handleDeleteEvent = async () => {
    let _id = this.state.eventId;
    if (
      window.confirm(`Are you sure you wish to delete this Event permanently?`)
    ) {
      await API.deleteCalendarAdminEvent(_id)
        .then(() => this.getAppointmentsCalendarAdmin())
        .catch((err) => console.log(err));
      window.location.href = "/profile";
    }
  };

  //Slot event on Calendar opens modal
  handleSelect = (slot) => {
    console.log(slot);
    let slotEvent = {
      start: this.convertDate(slot.start),
      end: this.convertDate(slot.end),
    };

    this.setState({
      slotEvent,
    });
    this.toggle();
  };

  convertDate = (date) => {
    return moment.utc(date).toDate();
  };
  // Modal Functions End **************************************

  getAppointmentsCalendarAdmin = () => {
    let _id = this.props.idForUserEvents;

    API.getAppointmentsAdmin(_id)
      .then((response) => {
        let appointments = response.data.events;

        for (let i = 0; i < appointments.length; i++) {
          appointments[i].start = this.convertDate(appointments[i].start);
          appointments[i].end = this.convertDate(appointments[i].end);
        }
        this.setState({
          cal_eventsAdmin: appointments,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    // this.props.history.push("/profile");
  };

  //Opens up modal with event info to update
  handleEventGetter = (event) => {
    let _id = event._id;
    this.setState({
      eventId: event._id,
    });
    if (this.state.modalToEditEvent === true) {
      this.setState({
        eventId: "",
      });
    }
    this.toggleToEdit();
    API.getAppointmentAdmin(_id)
      .then((res) => {
        if (res.error) {
          return process.on("unhandledRejection", (reason, promise) => {
            promise.reject(res.error);
          });
        }
        this.setState({
          eventToEdit: res.data,
          appointmentEdit: res.data.appointment,
          editTitle: res.data.title,
          editStart: this.convertDate(res.data.start),
          editEnd: this.convertDate(res.data.end),
        });
        console.log(this.state.editEnd);
        return Promise.resolve(res);
      })
      .then(
        this.setState({
          eventToEdit: "",
          appointmentEdit: "",
          editTitle: "",
          editStart: "",
          editEnd: "",
        })
      )
      .catch((error) => console.log(error));
  };

  //Function to define styling on Calendar's Admin's events
  eventStyleGetter = (event, start, end, isSelected) => {
    // console.log(event);

    // var backgroundColor = "#" + event.hexColor;
    var style = {
      backgroundColor: "rgb(51, 156, 255)",
      borderRadius: "5px",
      opacity: 0.8,
      fontSize: "16px",
      color: "white",
      border: "1px solid blue",
      display: "block",
      paddingLeft: "12px",
      paddingRight: "12px",
      textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black",
    };
    if (event.appointment === "allDay") {
      style.backgroundColor = "blue";
      style.color = "white";
    }

    return {
      style,
    };
  };

  render() {
    const { cal_eventsAdmin } = this.state;
    const appointment = this.state.appointment;

    let components = {};

    return (
      <div className="row">
        {/* Modal To add Event to Calendar */}
        <div>
          <Modal
            className="modal-xl modalForMobile"
            isOpen={this.state.modal}
            toggle={this.toggle}
          >
            <ModalHeader
              className="modalToEdit"
              charCode=""
              toggle={this.handleSelect}
            >
              <button className="danger modalMsg" onClick={this.closeModal}>
                Close
              </button>
              Please confirm your event details
            </ModalHeader>
            <ModalBody className="modalToEdit">
              <Form onSubmit={this.onSubmitModal}>
                <FormGroup>
                  <Select
                    name="form-field-name"
                    value={appointment}
                    options={optionsAdmin}
                    placeholder="Select one of the following:"
                    isSearchable={false}
                    onChange={this.onSelectedChanged}
                  />
                  <label className="mt-3">Event Details:</label>

                  <Input
                    type="text"
                    name="title"
                    id="title"
                    value={this.state.title}
                    placeholder="Please enter the event description here"
                    onChange={this.onChangeModal}
                  />

                  <p className="time-on-modal">
                    Starts:
                    {moment(this.state.slotEvent.start).format(
                      "dddd, MMMM Do YYYY, h:mm a"
                    )}
                  </p>
                  <p className="time-on-modal">
                    Ends:
                    {moment(this.state.slotEvent.end).format(
                      "dddd, MMMM Do YYYY, h:mm a"
                    )}
                  </p>
                  <Button color="info" style={{ marginTop: "1rem" }} block>
                    Submit Event
                  </Button>
                </FormGroup>
              </Form>
            </ModalBody>
          </Modal>
        </div>
        {/* Modal to add event to calendar ends here */}

        {/* Modal To Edit Events */}
        <div>
          <Modal
            className="modal-xl modalForMobile"
            isOpen={this.state.modalToEditEvent}
            toggle={this.toggleToEdit}
          >
            <ModalHeader
              className="modalToEdit"
              charCode=""
              toggle={this.handleEventGetter}
            >
              <button className="danger modalMsg" onClick={this.closeModal}>
                Close
              </button>
              Please confirm your event details
            </ModalHeader>
            <ModalBody className="modalToEdit">
              <Form onSubmit={this.onSubmitModalToEdit}>
                <FormGroup>
                  <label>Appointment details:</label>

                  <Input
                    type="text"
                    name="editTitle"
                    id="editTitle"
                    defaultValue={this.state.eventToEdit.title}
                    placeholder="Please enter the event details"
                    onChange={this.onChangeModal}
                  />
                  <label>Event Start Date/Time (YYYY-MM-DD HH:MM:SS):</label>

                  <Input
                    type="text"
                    name="editStart"
                    id="editStart"
                    defaultValue={this.state.editStart}
                    placeholder="Please enter the start time details"
                    onChange={this.onChangeModal}
                  />
                  <label>Event End Date/Time (YYYY-MM-DD HH:MM:SS):</label>

                  <Input
                    type="text"
                    name="editEnd"
                    id="editEnd"
                    defaultValue={this.state.editEnd}
                    placeholder="Please enter the end time details"
                    onChange={this.onChangeModal}
                  />

                  <Button color="info" style={{ marginTop: "1rem" }} block>
                    Submit Event
                  </Button>
                </FormGroup>
              </Form>
              <button
                className="deleteBtnEvent"
                onClick={() => {
                  this.handleDeleteEvent(this.state.eventToEdit.id);
                }}
                color="danger"
                style={{ marginTop: "1rem" }}
                block
              >
                Delete Event
              </button>
            </ModalBody>
          </Modal>
        </div>
        {/* Modal to edit events ends here */}

        {/* Calendar */}
        <div className="col-md-12 mainCalendarComponentWrapper">
          <h4 className="calendarMainTitle">
            {this.state.userCalendarName}'s Calendar
          </h4>
          <hr style={{ background: "white" }}></hr>
          <Calendar
            className="calendarComponent"
            components={components}
            events={cal_eventsAdmin}
            onSelectSlot={this.handleSelect}
            step={15}
            selectable="ignoreEvents"
            eventPropGetter={this.eventStyleGetter}
            timeslots={4}
            defaultView="day"
            views={["day", "agenda"]}
            defaultDate={new Date()}
            localizer={localizer}
            min={new Date(2019, 10, 0, 5, 0, 0)}
            max={new Date(2019, 10, 0, 23, 0, 0)}
            onSelectEvent={this.handleEventGetter}
          />
        </div>
        {/* Calendar Ends*/}
      </div>
    );
  }
}

export default CalendarAdmin;
