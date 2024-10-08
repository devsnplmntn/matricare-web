import React, { useState, useEffect } from "react";
import "../../styles/features/appointmentconsultant.css";
import { IoAddCircleOutline, IoNotifications } from "react-icons/io5";

const initialAppointments = [
  {
    date: "Sept 4, 10 am",
    patientName: "Ella Cruz",
    location: "Mary Chiles",
    category: "Advice by the Doctor",
    status: "pending",
  },
  {
    date: "Sept 22, 1 pm",
    patientName: "Mary Andres",
    location: "Grace Medical Center",
    category: "Monthly Check-up",
    status: "pending",
  },
  {
    date: "Sept 24, 3 pm",
    patientName: "Sarah Smith",
    location: "Family Care Tungko",
    category: "Monthly Check-up",
    status: "confirmed",
  },
];

const AppointmentConsultant = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    date: "",
    time: "",
    patientName: "",
    location: "",
    category: "",
    status: "pending",
  });
  const [user, setUser] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      parsedUserData.name = parsedUserData.name.split(" ")[0];
      setUser(parsedUserData);
    }
  }, []);

  const timeOptions = [
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
  ];

  const locationOptions = [
    "Mary Chiles, Sampaloc",
    "Grace Medical Center",
    "Family Care Tungko",
  ];

  const categoryOptions = ["Monthly Check-up", "Advice by the Doctor"];

  const handleStatusChange = (index, newStatus) => {
    const updatedAppointments = appointments.map((appointment, i) => {
      if (i === index) {
        return { ...appointment, status: newStatus };
      }
      return appointment;
    });
    setAppointments(updatedAppointments);
  };

  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  );
  const postAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { date, time, patientName, location, category } = newAppointment;
    if (date && time && patientName && location && category) {
      const fullDateTime = `${date}, ${time}`;
      setAppointments([
        ...appointments,
        { ...newAppointment, date: fullDateTime },
      ]);
      setNewAppointment({
        date: "",
        time: "",
        patientName: "",
        location: "",
        category: "",
        status: "pending",
      });
      setIsFormVisible(false);
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setNewAppointment({
      date: "",
      time: "",
      patientName: "",
      location: "",
      category: "",
      status: "pending",
    });
  };

  return (
    <div className="appointmentConsultant-dashboard">
      <main className="appointmentConsultant-main">
        <header className="appointmentConsultant-header">
          <div className="appointmentConsultant-notificationIcon">
            <a href="/consultant-notification">
              <IoNotifications />
            </a>
          </div>
          <div className="appointmentConsultant-headerUser">
            <h1>{`Dr. ${user.name}`}</h1>
            <p>Obstetrician-gynecologist</p>
          </div>
          <div className="appointmentConsultant-headerImage">
            <img src="img/LOGO.png" alt="Profile" />
          </div>
        </header>

        <div className="appointmentConsultant-breadcrumb">
          <a href="#doctor">Doctor</a> <span>&gt;</span>{" "}
          <a href="#appointments" className="breadcrumb-active">
            Appointments
          </a>
        </div>

        <div className="appointmentConsultant-content">
          <section className="appointmentConsultant-appointments">
            <div className="appointmentConsultant-tabs">
              <button
                className={`appointmentConsultant-tab ${
                  activeTab === "upcoming" ? "active" : ""
                }`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming Appointments
              </button>
              <button
                className={`appointmentConsultant-tab ${
                  activeTab === "post" ? "active" : ""
                }`}
                onClick={() => setActiveTab("post")}
              >
                Post Appointments
              </button>
            </div>
            <button
              className="appointmentConsultant-addAppointmentBtn"
              onClick={() => setIsFormVisible(true)}
            >
              <IoAddCircleOutline /> Add Appointment
            </button>

            {/* Appointment Form */}
            {isFormVisible && (
              <div className="appointmentConsultant-appointmentForm">
                <h2>Add Appointment</h2>
                <input
                  type="text"
                  name="patientName"
                  placeholder="Patient Name"
                  value={newAppointment.patientName}
                  onChange={handleFormChange}
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={newAppointment.date}
                  onChange={handleFormChange}
                  required
                />
                <select
                  className="appointment-select"
                  name="time"
                  value={newAppointment.time}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Time</option>
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>

                <select
                  className="appointment-select"
                  name="location"
                  value={newAppointment.location}
                  onChange={handleFormChange}
                  required
                >
                  <option value="" disabled>
                    Select Location
                  </option>
                  {locationOptions.map((location, index) => (
                    <option key={index} value={location}>
                      {location}
                    </option>
                  ))}
                </select>

                <select
                  className="appointment-select"
                  name="category"
                  value={newAppointment.category}
                  onChange={handleFormChange}
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categoryOptions.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="appointment-add-button"
                  onClick={handleFormSubmit}
                >
                  Add Appointment
                </button>
                <button
                  type="button"
                  className="appointment-cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Conditionally render based on the active tab */}
            {activeTab === "upcoming" && (
              <div className="appointmentConsultant-appointmentList">
                {upcomingAppointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="appointmentConsultant-appointmentItem"
                  >
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Date:
                        </span>
                        <span className="appointmentConsultant-text">
                          {appointment.date}
                        </span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Patient Name:
                        </span>
                        <span className="appointmentConsultant-text">
                          {appointment.patientName}
                        </span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Location:
                        </span>
                        <span className="appointmentConsultant-text">
                          {appointment.location}
                        </span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Category:
                        </span>
                        <span className="appointmentConsultant-text">
                          {appointment.category}
                        </span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-action">
                      <select
                        className="appointmentConsultant-statusSelect"
                        value={appointment.status}
                        onChange={(e) =>
                          handleStatusChange(index, e.target.value)
                        }
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "post" && (
              <div className="appointmentConsultant-appointmentList">
                {postAppointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="appointmentConsultant-appointmentItem"
                  >
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Date:
                        </span>
                        <span className="appointmentConsultant-text">
                          {appointment.date}
                        </span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Patient Name:
                        </span>
                        <span className="appointmentConsultant-text">
                          {appointment.patientName}
                        </span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Location:
                        </span>
                        <span className="appointmentConsultant-text">
                          {appointment.location}
                        </span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Category:
                        </span>
                        <span className="appointmentConsultant-text">
                          {appointment.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AppointmentConsultant;
