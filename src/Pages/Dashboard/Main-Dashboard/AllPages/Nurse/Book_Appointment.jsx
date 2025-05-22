import React, { useState } from "react";
import { CommonProblem } from "./MixedObjectData";
import "./CSS/Book_appointment.css";
import { useDispatch } from "react-redux";
import { AddPatients, CreateBooking } from "../../../../../Redux/Datas/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
const notify = (text) => toast(text);
 const url="https://nhd-server.vercel.app"

function getNextDatesForDays(days, count = 30) {
  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const result = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    if (days.includes(dayName)) {
      result.push(date.toISOString().split("T")[0]);
    }
  }

  return result;
}

function getTimeSlots(range) {
  if (!range.includes("-")) return [];

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const [startStr, endStr] = range.split("-");
  const start = parseTime(startStr);
  const end = parseTime(endStr);

  const slots = [];
  for (let time = start; time < end; time += 20) {
    const hour = Math.floor(time / 60);
    const min = time % 60;
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedTime = `${String(formattedHour).padStart(2, "0")}:${String(
      min
    ).padStart(2, "0")} ${ampm}`;
    slots.push(formattedTime);
  }

  return slots;
}

const Book_Appointment = () => {
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientID: "",
    patientName: "",
    age: "",
    gender: "",
    mobile: "",
    address: "",
    email: "",
    disease: "",
    time: "",
    date: "",
    doctorID: "",
    emergencyNo: null,
    bloodGroup: "N/A",
    ward: "General",
    password: "default123",
  });

  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  // const [BookAppoint, setBookAppoint] = useState();
  const [doctors, setDoctors] = useState([]); // Store available doctors

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        let response = await fetch(`${url}/doctors/`); // Update with your correct API URL
        let data = await response.json();

        setDoctors(data);
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const fetchBookedTimes = async (doctorID, date) => {
    try {
      const token = localStorage.getItem("patientToken");
      const res = await fetch(
        `${url}/appointments?doctorID=${doctorID}&date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      const booked = data.map((b) => b.time);
      setBookedTimes(booked);
    } catch (err) {
      console.error("Error fetching booked times:", err);
      setBookedTimes([]);
    }
  };
  const handleFormChange = async (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    if (name === "doctorID") {
      const selectedDoc = doctors.find((doc) => doc._id === value);
      if (selectedDoc?.availableDays) {
        const nextDates = getNextDatesForDays(selectedDoc.availableDays);
        setAvailableDates(nextDates);
        setTimeSlots([]);
        setBookedTimes([]);
        setFormData((prev) => ({ ...prev, date: "", time: "" }));
      }
    }

    if (
      (name === "date" || name === "doctorID") &&
      updatedForm.date &&
      updatedForm.doctorID
    ) {
      const selectedDoc = doctors.find(
        (doc) => doc._id === updatedForm.doctorID
      );
      if (selectedDoc?.timeSlot) {
        const slots = getTimeSlots(selectedDoc.timeSlot);
        
        setTimeSlots(slots);

        await fetchBookedTimes(updatedForm.doctorID, updatedForm.date);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.patientID ||
      !formData.patientName ||
      !formData.email ||
      !formData.time ||
      !formData.date ||
      !formData.doctorID
    ) {
      notify("Please fill all the required fields");
      return;
    }

   

    try {
      setLoading(true);
      await dispatch(AddPatients(formData));
      await dispatch(CreateBooking(formData));
     
      setAvailableDates([]);
      setTimeSlots([]);
      setBookedTimes([]);
      notify("Appointment Booked Successfully");
       setFormData({
        patientID: "",
        patientName: "",
        age: "",
        gender: "",
        mobile: "",
        address: "",
        email: "",
        disease: "",
        time: "",
        date: "",
        doctorID: "",
        emergencyNo: null,
        bloodGroup: "N/A",
        ward: "General",
        password: "default123",
      });
      
    } catch (err) {
      console.error(err);
      notify("Something Went Wrong...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="Main_Add_Doctor_div">
            <h1 style={{ color: "#199A8E" }}>Book Appointment</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label>CNIC</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Enter CNIC without dashes"
                    name="patientID"
                    value={formData.patientID}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              {/* Name PlaceHolder */}
              <div>
                <label>Patient Name</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="First Name"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              {/* AGE PLACEHOLDER  */}
              <div>
                <label>Age</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="Age"
                    name="age"
                    value={formData.age}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              {/* GENDER PLACEHOLDER  */}
              <div>
                <label>Gender</label>
                <div className="inputdiv">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="Choose Blood Group">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              {/* MOBILE PLACEHOLDER */}
              <div>
                <label>Contact Number</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="Number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Email</label>
                <div className="inputdiv">
                  <input
                    type="email"
                    placeholder="example@email.com"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              {/* PROBLEM PLACEHOLDER */}
              <div>
                <label>Type of Disease</label>
                <div className="inputdiv">
                  <select
                    name="disease"
                    value={formData.disease}
                    onChange={(e) => {
                      handleFormChange(e);
                    }}
                    required
                  >
                    <option value="Choose Blood Group">Select Disease</option>
                    {CommonProblem.map((ele, i) => {
                      return (
                        <option key={i} value={ele.title}>
                          {ele.title}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              {/* select doctor */}
              <div>
                <label className="align-items-center">Choose Doctor</label>
                <div className="form-group inputdiv" style={{ width: "33rem" }}>
                  <select
                    className="form-select form-control"
                    name="doctorID"
                    value={formData.doctorID}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.docName} - {doctor.department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* ADDRESS SECTION  */}
              <div>
                <label>Address</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Address line 1"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              {/* DEPARTMENT SECTION */}
              <div>
                <label>Department</label>
                <div className="inputdiv">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="ENT">ENT</option>
                    <option value="Ophthalmologist">Ophthalmologist</option>
                    <option value="Anesthesiologist">Anesthesiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Oncologist">Oncologist</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                  </select>
                </div>
              </div>
              {/* APPOINTMENT DATE  */}
            
              <div>
                <label>Select Time</label>
                <div className="inputdiv">
                  <select
                    className="form-control"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Appointment Date</option>
                    {availableDates.map((date, index) => (
                      <option key={index} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label>Select Time</label>
                <div className="inputdiv">
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((slot, i) => (
                      <option
                        key={i}
                        value={slot}
                        disabled={bookedTimes.includes(slot)}
                      >
                        {slot} {bookedTimes.includes(slot) ? "(Booked)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="book_formsubmitbutton">
                {Loading ? "Loading..." : "Book Appointment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Book_Appointment;
