import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/settings/consultantpatientsinfo.css";
import { IoPencil, IoTrash, IoSave } from "react-icons/io5";
import { getCookie } from "../../../utils/getCookie";
import axios from "axios";

const ConsultantPatientInfo = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [filter, setFilter] = useState("all");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [view, setView] = useState("patients");
  const [editingUserId, setEditingUserId] = useState(null);
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

  const [admins, setAdmins] = useState([
    {
      id: 3,
      photo: "img/topic1.jpg",
      name: "Dra. Donna Jill A. Tungol",
      mobile: "123-456-7890",
      email: "john@example.com",
      role: "Doctor",
    },
    {
      id: 4,
      photo: "img/topic1.jpg",
      name: "Anna Taylor",
      mobile: "123-456-7890",
      email: "john@example.com",
      role: "Assistant",
    },
    // Add more admins here
  ]);

  const [showForm, setShowForm] = useState(false); // State for form visibility

  const filteredUsers =
    view === "patients"
      ? patients.filter((user) => filter === "all" || user.status === filter)
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

  const handleEditClick = (userId) => {
    setEditingUserId(userId);
  };

  const handleDeleteClick = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      if (view === "patients") {
        try {
          const response = await axios.delete(
            `${API_URL}/record/patient?id=${userId}`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          setPatients(patients.filter((patient) => patient._id !== userId));
        } catch (error) {
          console.error(error);
        }
      } else {
        setAdmins(admins.filter((user) => user._id !== userId));
      }
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleSaveClick = () => {
    setEditingUserId(null);
  };

  const handleRowClick = (userId) => {
    navigate(`/patient-records/${userId}`);
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
        setAdmins(filteredAdmins);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPatients();
    fetchAdmins();
  }, []);

  return (
    <div className="CPM-container">
      <div className="CPM-main-section">
        <header className="CPM-header">
          <div className="CPM-user-profile">
            <h1>{`Dr. ${user.name}`}</h1>
            <p>Obstetrician-gynecologist</p>
            <img src="img/LOGO.png" alt="Profile" />
            <button className="CPM-add-btn" onClick={handleAddPatientClick}>
              + Add Patients
            </button>
          </div>
        </header>

        <div className="CPM-type-buttons">
          <button
            className={`CPM-type-button ${view === "patients" ? "active" : ""}`}
            onClick={() => setView("patients")}
          >
            Patients
          </button>
          <button
            className={`CPM-type-button ${view === "admins" ? "active" : ""}`}
            onClick={() => setView("admins")}
          >
            Admins
          </button>
        </div>

        <div className="CPM-view-label">
          {view === "patients" ? <h2>Patients</h2> : <h2>Admins</h2>}
        </div>

        <div className="CPM-filter-options">
          {view === "patients" && (
            <div className="CPM-toggle-select">
              <input
                type="checkbox"
                id="selectAll"
                checked={selectAll}
                onChange={toggleSelectAll}
              />
              <label htmlFor="selectAll">Select All Users</label>
              <span className="CPM-total-users">({patients.length} Users)</span>
            </div>
          )}
          {view === "patients" && (
            <div className="CPM-filter-section">
              <div className="CPM-filter-container">
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

        <table className="CPM-user-table">
          <thead>
            <tr>
              {view === "patients" && <th>Select</th>}

              <th>Patient ID</th>
              <th>Photo</th>
              {view === "patients" && (
                <>
                  <th>Patient Name</th>
                  <th>Phone Number</th>
                  <th>Email Address</th>
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
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id} onClick={() => handleRowClick(user._id)}>
                {view === "patients" && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleUserSelection(user._id)}
                    />
                  </td>
                )}
                <td>{user.seq}</td>
                <td>
                  <img
                    src={
                      user && user.userId && user.userId.profilePicture
                        ? user.userId.profilePicture
                        : "img/topic2.jpg"
                    }
                    className="CPM-user-photo"
                  />
                </td>
                {view === "patients" && (
                  <>
                    <td>{user.fullName}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.email}</td>
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
                <td>
                  {editingUserId === user._id ? (
                    <button
                      className="CPM-operation-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSaveClick();
                      }}
                    >
                      <IoSave />
                    </button>
                  ) : (
                    <button
                      className="CPM-operation-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleEditClick(user._id);
                      }}
                    >
                      <IoPencil />
                    </button>
                  )}
                  <button
                    className="CPM-operation-btn CPM-delete-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteClick(user._id);
                    }}
                  >
                    <IoTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="CPM-patient">
          <div className="CPM-add-patient-form">
            <form onSubmit={handleAddPatientSubmit}>
              <div className="CPM-add-form">
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
              <div className="CPM-add-form">
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
              <div className="CPM-add-form">
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
              <button type="submit" className="CPM-add-submit">
                Add Patient
              </button>
              <button
                type="button"
                className="CPM-add-cancel"
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

export default ConsultantPatientInfo;
