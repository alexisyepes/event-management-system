import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
} from "reactstrap";
import CalendarAdmin from "../../Components/Calendars/CalendarAdmin";
import "./style.css";
import moment from "moment";
import API from "../../utils/API";

let attendanceOptions = [
  {
    value: "No",
    label: "No",
  },
  {
    value: "Yes",
    label: "Yes",
  },
  {
    value: "Maybe",
    label: "Maybe",
  },
];

class index extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      user_id: "",
      firstName: "",
      lastName: "",
      email: "",
      events: [],
      isLoading: true,
      error: false,
      eventToEdit: "",
      modalToEditEvent: false,
      modalToAddGuestsToEvents: false,
      modalToViewGuestList: false,
      modalToEditGuest: false,
      editTitle: "",
      editStart: "",
      editEnd: "",
      guestName: "",
      guestPhone: "",
      guestEmail: "",
      guestConfirmed: "",
      idEvent: "",
      guestsList: [],
      guestConfirmation: "",
      guestNameToEdit: "",
      guestPhoneToEdit: "",
      guestEmailToEdit: "",
      guestConfirmedToEdit: "",
      guest_id: "",
    };
  }

  async componentDidMount() {
    const accessString = localStorage.getItem("JWT");
    if (accessString == null) {
      this.setState({
        isLoading: false,
        error: true,
      });
    } else {
      try {
        const response = await axios.get("/auth/profile", {
          headers: { Authorization: `JWT ${accessString}` },
        });
        this.setState({
          user_id: response.data._id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          isLoading: false,
          error: false,
        });

        window.scrollTo(0, 0);
        this.getAllEvents();
        // console.log(response)
      } catch (error) {
        console.error(error.response);
        this.setState({
          error: true,
        });
      }
    }
  }

  getAllEvents = async () => {
    let _id = this.state.user_id;
    await API.getAppointmentsAdmin(_id)
      .then((res) => {
        this.setState({
          events: res.data.events,
        });
      })
      .catch((err) => console.log(err));
  };

  //Toggle for modal form to edit events
  toggle = () => {
    this.setState({
      modalToEditEvent: !this.state.modalToEditEvent,
      eventToEdit: "",
    });
  };

  //Toggle for modal form to add Guests to events
  toggleModalToAddGuests = () => {
    this.setState({
      modalToAddGuestsToEvents: !this.state.modalToAddGuestsToEvents,
    });
  };

  //Toggle for modal to view Guest List
  toggleModalToViewGuestList = () => {
    this.setState({
      modalToViewGuestList: !this.state.modalToViewGuestList,
    });
  };

  //Toggle for modal to Edit Guest
  toggleModalToEditGuest = () => {
    this.setState({
      modalToEditGuest: !this.state.modalToEditGuest,
    });
  };

  //onChange for modal forms
  onChangeModal = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  editGuestModal = ({ currentTarget }) => {
    this.toggleModalToEditGuest();
    let _id = currentTarget.value;
    API.getOneGuest(_id)
      .then((res) => {
        this.setState({
          guestNameToEdit: res.data.name,
          guestPhoneToEdit: res.data.phone,
          guestEmailToEdit: res.data.email,
          guestConfirmedToEdit: res.data.confirmed,
          guest_id: res.data._id,
        });
        // console.log(this.state.guestConfirmedToEdit);
      })
      .catch((err) => console.log(err));
  };

  convertDate = (date) => {
    return moment.utc(date).toDate();
  };

  //Edit event submit function
  editEventModalOpen = ({ currentTarget }) => {
    this.toggle();
    if (!this.state.modalToEditEvent) {
      this.setState({
        eventToEdit: "",
        editTitle: "",
        editStart: "",
        editEnd: "",
      });
    }
    const event_id = currentTarget.value;
    API.getOneEventAdmin(event_id)
      .then((res) => {
        this.setState({
          eventToEdit: res.data,
          editTitle: res.data.title,
          editStart: this.convertDate(res.data.start),
          editEnd: this.convertDate(res.data.end),
        });
      })
      .catch((err) => console.log(err));
  };

  closeModal = () => {
    this.setState({
      modalToEditEvent: false,
    });
  };

  closeModalToAddGuest = () => {
    this.setState({
      modalToAddGuestsToEvents: false,
      idEvent: "",
    });
  };

  closeModalToViewGuestList = () => {
    this.setState({
      modalToViewGuestList: false,
      guestList: "",
    });
  };

  closeModalToEditGuest = () => {
    this.setState({
      modalToEditGuest: false,
      guestNameToEdit: "",
      guestPhoneToEdit: "",
      guestEmailToEdit: "",
    });
  };

  submitEditEvent = async (e) => {
    e.preventDefault();

    let obj = {
      _id: this.state.eventToEdit._id,
      title: this.state.editTitle,
      start: this.state.editStart,
      end: this.state.editEnd,
    };

    let _id = this.state.eventToEdit._id;

    await API.updateAppointmentAdmin(_id, obj)

      .then((res) => console.log(res))
      .catch((error) => console.log(error));

    window.location.href = "/profile";
  };

  handleDeleteEvent = async ({ currentTarget }) => {
    let _id = currentTarget.value;
    if (
      window.confirm(`Are you sure you wish to delete this Event permanently?`)
    ) {
      await API.deleteCalendarAdminEvent(_id)
        .then(() => {
          window.location.reload();
        })
        // this.getAllEvents()})
        .catch((err) => console.log(err));
    }
  };

  handleDeleteGuest = async ({ currentTarget }) => {
    let _id = currentTarget.value;
    if (
      window.confirm(`Are you sure you wish to delete this Guest permanently?`)
    ) {
      await API.deleteOneGuest(_id)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      window.location.href = "/profile";
    }
  };

  addGuestsToEventModal = (e) => {
    let idEvent = e.target.value;
    this.setState({
      idEvent,
    });
    this.toggleModalToAddGuests();
  };

  onSubmitModalToAddGuests = (e) => {
    e.preventDefault();
    let guestObj = {
      name: this.state.guestName.replace(/^./, (str) => str.toUpperCase()),
      phone: this.state.guestPhone,
      email: this.state.guestEmail,
      confirmed: this.state.guestConfirmed.value,
    };
    let _id = this.state.idEvent;

    if (
      !guestObj.name ||
      !guestObj.phone ||
      !guestObj.email ||
      !guestObj.confirmed
    ) {
      return alert("All fields are mandatory!");
    }

    API.addGuest(_id, guestObj)
      .then((res) => {
        console.log(res);
        this.setState({
          guestName: "",
          guestPhone: "",
          guestEmail: "",
          guestConfirmed: "",
        });
      })
      .catch((err) => console.log(err));
    this.closeModalToAddGuest();
  };

  submitEditGuest = async (e) => {
    e.preventDefault();

    let obj = {
      _id: this.state.guest_id,
      name: this.state.guestNameToEdit.replace(/^./, (str) =>
        str.toUpperCase()
      ),
      phone: this.state.guestPhoneToEdit,
      email: this.state.guestEmailToEdit,
      confirmed: this.state.guestConfirmedToEdit,
    };

    let _id = this.state.guest_id;

    await API.updateOneGuest(_id, obj)

      .then((res) => console.log(res))
      .catch((error) => console.log(error));
    this.closeModalToEditGuest();
    this.closeModalToViewGuestList();
  };

  viewGuestList = ({ currentTarget }) => {
    this.toggleModalToViewGuestList();
    let _id = currentTarget.value;
    API.getAppointmentAdmin(_id)
      .then((res) => {
        // console.log(res.data.guests)
        this.setState({
          guestsList: res.data.guests,
        });
      })
      .catch((err) => console.log(err));
  };

  onSelectedChanged = (value) => {
    this.setState({
      guestConfirmed: value,
    });
    // console.log(`Option selected:`, value);
  };

  onSelectedChangedEdit = (value) => {
    this.setState({
      guestConfirmedToEdit: value.value,
    });
  };

  render() {
    const user_id = this.state.user_id;

    const { isLoading, error } = this.state;
    if (error) {
      return (
        <div
          className="container"
          style={{
            marginTop: "180px",
            fontSize: "30px",
            background: "rgba(196, 210, 212, 0.699)",
          }}
        >
          ...Problem fetching user data. Please login again
        </div>
      );
    }
    if (isLoading) {
      return (
        <div
          style={{
            marginTop: "100px",
            marginLeft: "10%",
            fontSize: "30px",
            height: "100vh",
            color: "white",
          }}
        >
          Loading User Data...
        </div>
      );
    }

    const guests = this.state.guestsList;
    const guestList = guests.length ? (
      guests.map((guest) => {
        if (guest.confirmed === "Yes" || guest.confirmed === "yes") {
          return (
            <div key={guest._id} className="card guestListBox">
              <div className="guestListInfoColumn">
                <p className="guestListContent"> Name: {guest.name}</p>
                <p className="guestListContent"> Phone: {guest.phone}</p>
                <p className="guestListContent"> Email: {guest.email}</p>
                <p className="guestListContent">
                  Is {guest.name} attending? {guest.confirmed}{" "}
                </p>
              </div>

              <div className="guestListButtonsColumnInModal">
                <Button
                  onClick={this.handleDeleteGuest}
                  value={guest._id}
                  block
                  className="guestListButtons deleteButton"
                >
                  Delete
                </Button>
                <Button
                  value={guest._id}
                  onClick={this.editGuestModal}
                  block
                  className="guestListButtons editButton"
                >
                  Edit
                </Button>
              </div>
            </div>
          );
        } else {
          return (
            <div key={guest._id} className="card confirmedNoBox">
              <div className="guestListInfoColumn">
                <p className="guestListContent"> Name: {guest.name}</p>
                <p className="guestListContent"> Phone: {guest.phone}</p>
                <p className="guestListContent"> Email: {guest.email}</p>
                <p className="guestListContent">
                  Is {guest.name} attending? {guest.confirmed}{" "}
                </p>{" "}
              </div>

              <div className="guestListButtonsColumnInModal">
                <Button
                  onClick={this.handleDeleteGuest}
                  value={guest._id}
                  block
                  className="guestListButtons deleteButton"
                >
                  Delete
                </Button>
                <Button
                  value={guest._id}
                  onClick={this.editGuestModal}
                  block
                  className="guestListButtons editButton"
                >
                  Edit
                </Button>
              </div>
            </div>
          );
        }
      })
    ) : (
      <div>
        No Guests yet for this event...close this window and choose the add
        Guests option
      </div>
    );

    const guestConfirmed = this.state.guestConfirmed;
    const guestConfirmedToEdit = this.state.guestConfirmedToEdit;

    const events = this.state.events;
    const eventsList = events.length ? (
      events.map((event) => {
        return (
          <div className="mainBox" key={event._id}>
            {/* events list card */}
            <div className="card-body-profile">
              <h3 className="eventDetailsText">
                Description: <b>{event.title}</b>
              </h3>
              <ul className="datesText">
                <li>
                  Start Date / Time:{" "}
                  {moment(event.start).format("YYYY-MMMM-DD ddd hh:mm A")}
                </li>
                <li>
                  End Date / Time:{" "}
                  {moment(event.end).format("YYYY-MMMM-DD ddd hh:mm A")}
                </li>
              </ul>

              <div className="events-list-btns-wrapper">
                <button
                  className="events-list-btns events-list-btns__edit"
                  onClick={this.editEventModalOpen}
                  value={event._id}
                >
                  <i className="fas fa-tasks"></i> Edit
                </button>
                <button
                  value={event._id}
                  className="events-list-btns events-list-btns__delete"
                  onClick={this.handleDeleteEvent}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
                <button
                  className="events-list-btns events-list-btns__add-guest"
                  onClick={this.addGuestsToEventModal}
                  value={event._id}
                >
                  <i className="fas fa-user-plus"></i> Add Guests
                </button>
                <button
                  className="events-list-btns events-list-btns__view-guests"
                  onClick={this.viewGuestList}
                  value={event._id}
                >
                  <i className="fas fa-glasses"></i> View Guests
                </button>
              </div>
            </div>
            {/* events list card */}

            {/* Modal To Edit Events */}
            <div>
              <Modal
                className="modal-xl modalForMobile"
                isOpen={this.state.modalToEditEvent}
                toggle={this.toggle}
              >
                <ModalHeader className="modalToEdit" toggle={this.eventToEdit}>
                  <div>
                    <button
                      className="danger modalMsg"
                      onClick={this.closeModal}
                    >
                      Close
                    </button>
                    <h4>Please confirm your event details </h4>
                  </div>
                </ModalHeader>
                <ModalBody className="modalToEdit">
                  <Form onSubmit={this.onSubmitModalToEdit}>
                    <FormGroup>
                      <Input
                        type="text"
                        name="editTitle"
                        id="editTitle"
                        defaultValue={this.state.editTitle}
                        placeholder="Please enter the event details"
                        onChange={this.onChangeModal}
                      />
                      <label className="mt-3 ml-2">
                        Event Start Date/Time (YYYY-MM-DD HH:MM:SS):
                      </label>
                      <Input
                        type="text"
                        name="editStart"
                        id="editStart"
                        defaultValue={this.state.editStart}
                        placeholder="Please enter the start time details"
                        onChange={this.onChangeModal}
                      />
                      <label className="mt-3 ml-2">
                        Event End Date/Time (YYYY-MM-DD HH:MM:SS):
                      </label>
                      <Input
                        type="text"
                        name="editEnd"
                        id="editEnd"
                        defaultValue={this.state.editEnd}
                        placeholder="Please enter the end time details"
                        onChange={this.onChangeModal}
                      />
                      <Button
                        onClick={this.submitEditEvent}
                        color="info"
                        style={{ marginTop: "1rem" }}
                        block
                      >
                        Submit Changes
                      </Button>
                    </FormGroup>
                  </Form>
                  <button
                    value={event.id}
                    className="btn deleteButton btn-block text-light"
                    onClick={this.handleDeleteEvent}
                  >
                    Delete Event
                  </button>
                </ModalBody>
              </Modal>
            </div>
            {/* Modal to edit events ends here */}
          </div>
        );
      })
    ) : (
      <div className="noEventYetMessage">
        No events added yet...select dates and times on calendar below.
      </div>
    );
    return (
      <div className="container profileMainContainer">
        <div className="row">
          <h4 className="col-lg-12 profilePageMainTitle">
            Welcome to your Personal Event Management System{" "}
            {this.state.firstName}
          </h4>
        </div>
        <hr style={{ background: "white" }}></hr>

        <div className="row profileContainer">
          <div className="col-md-12 listOfGuestsToInvite">
            <h4 style={{ textAlign: "center", marginTop: "5px" }}>
              Events List
            </h4>
            {eventsList}
          </div>
          <div id="calendarBox" className="col-md-12 calendarBox">
            <CalendarAdmin
              getAllEvents={this.getAllEvents}
              idForUserEvents={user_id}
            />
          </div>
        </div>

        {/* Modal To Add Guests to Events */}
        <div className="col-lg-12">
          <Modal
            className="modal-xl modalForMobile"
            isOpen={this.state.modalToAddGuestsToEvents}
            toggle={this.toggleModalToAddGuests}
          >
            <ModalHeader className="modalToEdit" toggle={this.eventToEdit}>
              <div>
                <button
                  className="danger modalMsg"
                  onClick={this.closeModalToAddGuest}
                >
                  Close
                </button>
                <h4>Add a Guest to this Event</h4>
              </div>
            </ModalHeader>
            <ModalBody className="modalToEdit">
              <Form onSubmit={this.onSubmitModalToAddGuests}>
                <FormGroup>
                  <label>Guest's Name:</label>
                  <Input
                    type="text"
                    name="guestName"
                    id="guestName"
                    placeholder="Enter Guest Name"
                    onChange={this.onChangeModal}
                  />
                  <label className="mt-3 ml-2">Guest's Phone:</label>
                  <Input
                    type="text"
                    name="guestPhone"
                    id="guestPhone"
                    placeholder="Enter Guest phone"
                    onChange={this.onChangeModal}
                  />

                  <label className="mt-3 ml-2">Guest's Email:</label>
                  <Input
                    type="email"
                    name="guestEmail"
                    id="guestEmail"
                    placeholder="Enter Guest Email"
                    onChange={this.onChangeModal}
                  />
                  <label className="mt-3 ml-2">
                    Confirm if this guest is attending:
                  </label>
                  <Select
                    name="form-field-name"
                    value={guestConfirmed}
                    options={attendanceOptions}
                    placeholder="Confirm Attendance"
                    isSearchable={false}
                    onChange={this.onSelectedChanged}
                  />
                  <Button
                    onClick={this.onSubmitModalToAddGuests}
                    value={event._id}
                    color="info"
                    style={{ marginTop: "1rem" }}
                    block
                  >
                    Add Guest
                  </Button>
                </FormGroup>
              </Form>
            </ModalBody>
          </Modal>

          {/* Modal to view Guest List */}
          <div>
            <Modal
              className="modal-xl modalForMobile"
              isOpen={this.state.modalToViewGuestList}
              toggle={this.toggleModalToViewGuestList}
            >
              <ModalHeader
                className="modalToEdit"
                toggle={this.modalToViewGuestList}
              >
                <div>
                  <button
                    className="danger modalMsg"
                    onClick={this.closeModalToViewGuestList}
                  >
                    Close
                  </button>
                  <h4 className="guestListTitleModal">Guests List</h4>
                </div>
              </ModalHeader>
              <ModalBody className="modalToEdit guestListModalMobile">
                {guestList}
              </ModalBody>
            </Modal>
          </div>
          {/* Modal to edit Guests */}
          <div>
            <Modal
              className="modal-xl modalForMobile"
              isOpen={this.state.modalToEditGuest}
              toggle={this.toggleModalToEditGuest}
            >
              <ModalHeader
                className="modalToEdit"
                toggle={this.modalToEditGuest}
              >
                <div>
                  <button
                    className="danger modalMsg"
                    onClick={this.closeModalToEditGuest}
                  >
                    Close
                  </button>
                  <h4 className="guestListTitleModal">Guest Info to Edit</h4>
                </div>
              </ModalHeader>
              <ModalBody className="modalToEdit">
                <Form onSubmit={this.submitEditGuest}>
                  <FormGroup>
                    <Input
                      onChange={this.onChangeModal}
                      name="guestNameToEdit"
                      defaultValue={this.state.guestNameToEdit}
                    />
                    <Input
                      onChange={this.onChangeModal}
                      name="guestPhoneToEdit"
                      defaultValue={this.state.guestPhoneToEdit}
                    />
                    <Input
                      onChange={this.onChangeModal}
                      name="guestEmailToEdit"
                      defaultValue={this.state.guestEmailToEdit}
                    />
                    <label>Is {this.state.guestNameToEdit} attending?</label>
                    <Select
                      name="form-field-name"
                      value={guestConfirmedToEdit}
                      options={attendanceOptions}
                      placeholder={guestConfirmedToEdit}
                      isSearchable={false}
                      onChange={this.onSelectedChangedEdit}
                    />
                  </FormGroup>
                  <Button onClick={this.submitEditGuest}>Save Changes</Button>
                </Form>
              </ModalBody>
            </Modal>
          </div>
          {/* Modal to edit guests */}
        </div>
      </div>
    );
  }
}
export default index;
