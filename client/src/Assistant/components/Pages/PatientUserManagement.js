import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/pages/patientusermanagement.css";
import { getCookie } from "../../../utils/getCookie";
import axios from "axios";

const PatientUserManagement = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [filter, setFilter] = useState("all");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [view, setView] = useState("patients");
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    assignedId: userID,
    fullName: "",
    phoneNumber: "",
    email: "",
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

  const [obGyneSpecialist, setObGyneSpecialist] = useState([]);
  const [admins, setAdmins] = useState([]);

  const [showForm, setShowForm] = useState(false); // State for form visibility

  const filteredUsers =
    view === "patients"
      ? patients.filter((user) => filter === "all" || user.status === filter)
      : view === "specialist"
      ? obGyneSpecialist
      : admins;

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedUsers(selectAll ? [] : filteredUsers.map((user) => user.id));
  };

  const handleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleAddPatientClick = () => {
    setShowForm(true); // Show the form when the button is clicked
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setNewPatient((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddPatientSubmit = async (event) => {
    event.preventDefault();
    try {
      const patientForm = {
        assignedId: userID,
        email: newPatient.email,
        fullName: newPatient.fullName,
        phoneNumber: newPatient.phoneNumber,
      };
      const response = await axios.post(
        `${API_URL}/record/patient`,
        patientForm,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setPatients([...patients, response.data.newPatient]);
    } catch (error) {
      console.error(error);
    }
    setShowForm(false); // Hide the form
  };

  const handleCancelClick = () => {
    setShowForm(false); // Hide the form
  };

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await axios.get(`${API_URL}/record/patient`, {
          headers: {
            Authorization: token,
          },
        });
        setPatients(response.data);
      } catch (error) {
        console.error();
      }
    }

    async function fetchAdmins() {
      try {
        const response = await axios.get(`${API_URL}/user/a`, {
          headers: {
            Authorization: token,
          },
        });
        const filteredAdmins = response.data.filter(
          (admin) => admin.role === "Assistant" || admin.role === "Obgyne"
        );
        const filteredObgyneSpecialist = response.data.filter(
          (user) => user.role === "Ob-gyne Specialist"
        );
        setAdmins(filteredAdmins);
        setObGyneSpecialist(filteredObgyneSpecialist);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPatients();
    fetchAdmins();
  }, []);

  const handleStatusChange = async (userId, newStatus) => {
    const isVerified = newStatus === "Verified" ? true : false;
    try {
      await axios.put(
        `${API_URL}/user?userId=${userId}`,
        {
          verified: isVerified,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const updatedSetObgyneSpecialist = obGyneSpecialist.map((specialist) =>
        specialist._id === userId
          ? { ...specialist, verified: isVerified }
          : specialist
      );
      setObGyneSpecialist(updatedSetObgyneSpecialist);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="UM-container">
      <div className="UM-main-section">
        <header className="UM-header">
          <div className="UM-user-profile">
            <h1>{`${user.name}`}</h1>
            <p>Assistant</p>
            <img
              src={
                user.profilePicture
                  ? user.profilePicture
                  : "img/profilePicture.jpg"
              }
              alt="Profile"
            />
            <button
              className="UM-logs-btn"
              onClick={() => navigate("/user-logs")}
            >
              View Logs
            </button>
            <button className="UM-add-btn" onClick={handleAddPatientClick}>
              + Add Patients
            </button>
          </div>
        </header>

        <div className="UM-type-buttons">
          <button
            className={`UM-type-button ${view === "patients" ? "active" : ""}`}
            onClick={() => setView("patients")}
          >
            Patients
          </button>
          <button
            className={`UM-type-button ${
              view === "specialist" ? "active" : ""
            }`}
            onClick={() => setView("specialist")}
          >
            Ob-Gyne Specialist
          </button>
          <button
            className={`UM-type-button ${view === "admins" ? "active" : ""}`}
            onClick={() => setView("admins")}
          >
            Admins
          </button>
        </div>

        <div className="UM-view-label">
          {view === "patients" ? (
            <h2>Patients</h2>
          ) : view === "admins" ? (
            <h2>Admins</h2>
          ) : view === "specialist" ? (
            <h2>Ob-Gyne Specialists</h2>
          ) : (
            <h2>Default Title</h2>
          )}
        </div>

        <div className="UM-filter-options">
          {view === "patients" && (
            <div className="UM-toggle-select">
              <input
                type="checkbox"
                id="selectAll"
                checked={selectAll}
                onChange={toggleSelectAll}
              />
              <label htmlFor="selectAll">Select All Users</label>
              <span className="UM-total-users">({patients.length} Users)</span>
            </div>
          )}
          {view === "patients" && (
            <div className="UM-filter-section">
              <div className="UM-filter-container">
                <label htmlFor="filter">Filter:</label>
                <select id="filter" onChange={handleFilterChange}>
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <table className="UM-user-table">
          <thead>
            <tr>
              {view === "patients" && <th>Select</th>}

              <th> ID</th>
              <th>Photo</th>
              {view === "patients" && (
                <>
                  <th>Patient Name</th>
                  <th>Phone Number</th>
                  <th>Email Address</th>
                </>
              )}
              {view === "specialist" && (
                <>
                  <th>Specialist Name</th>
                  <th>PRC ID</th>
                  <th>Selfie with ID</th>
                  <th>Phone Number</th>
                  <th>Email Address</th>
                  <th>Verification Status</th>
                </>
              )}
              {view === "admins" && (
                <>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Email Address</th>
                  <th>Role</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                {view === "patients" && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelection(user.id)}
                    />
                  </td>
                )}
                <td>{user.seq}</td>
                <td>
                  {view === "patients" ? (
                    <>
                      <img
                        src={
                          user.userId && user.userId.profilePicture
                            ? user.userId.profilePicture
                            : "img/profilePicture.jpg"
                        }
                        // alt={user.name}
                        className="CPM-user-photo"
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src={
                          user.profilePicture
                            ? user.profilePicture
                            : "img/profilePicture.jpg"
                        }
                        // alt={user.name}
                        className="CPM-user-photo"
                      />
                    </>
                  )}
                </td>
                {view === "patients" && (
                  <>
                    <td>{user.fullName}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.email}</td>
                  </>
                )}
                {view === "specialist" && (
                  <>
                    <td>{user.fullName}</td>
                    <td>
                      {user.prcId && user.prcId.length > 0 ? (
                        <a
                          href={user.prcId[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View File
                        </a>
                      ) : (
                        "No ID Found"
                      )}
                    </td>
                    <td>
                      {user.prcId && user.prcId.length > 0 ? (
                        <a
                          href={user.prcId[1]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View File
                        </a>
                      ) : (
                        "No Selfie with ID Found"
                      )}
                    </td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.prcId && user.prcId.length > 0 ? (
                        <select
                          value={user.verified ? "Verified" : "On Process"}
                          onChange={(e) =>
                            handleStatusChange(user._id, e.target.value)
                          } // Function to handle status change
                        >
                          <option value="Verified">Verified</option>
                          <option value="On Process">On Process</option>
                        </select>
                      ) : (
                        "No ID Found"
                      )}
                    </td>
                  </>
                )}
                {view === "admins" && (
                  <>
                    <td>{user.fullName}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="UM-patient">
          <div className="UM-add-patient-form">
            <form onSubmit={handleAddPatientSubmit}>
              <div className="UM-add-form">
                <label htmlFor="patientName">Name:</label>
                <input
                  type="text"
                  id="patientName"
                  name="fullName"
                  value={newPatient.fullName}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="UM-add-form">
                <label htmlFor="patientMobile">Mobile Number:</label>
                <input
                  type="tel"
                  id="patientMobile"
                  name="phoneNumber"
                  value={newPatient.phoneNumber}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="UM-add-form">
                <label htmlFor="patientEmail">Email:</label>
                <input
                  type="email"
                  id="patientEmail"
                  name="email"
                  value={newPatient.email}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <button type="submit" className="UM-add-submit">
                Add Patient
              </button>
              <button
                type="button"
                className="UM-add-cancel"
                onClick={handleCancelClick}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientUserManagement;
