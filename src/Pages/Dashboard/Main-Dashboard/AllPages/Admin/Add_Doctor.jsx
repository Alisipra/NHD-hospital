import React, { useState } from "react";
import "./CSS/Add_Doctor.css";
import doctor from "../../../../../img/doctoravatar.png";
import { useDispatch, useSelector } from "react-redux";
import { DoctorRegister, SendPassword } from "../../../../../Redux/auth/action";
import Sidebar from "../../GlobalFiles/Sidebar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";
const notify = (text) => toast(text);

const AddDoctor = () => {
  const { data } = useSelector((store) => store.auth);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const initData = {
    docName: "",
    docID: "",
    age: "",
    mobile: "",
    email: "",
    bloodGroup: "",
    gender: "",
    specialization: "",
    address: "",
    education: "",
    department: "",
    image: "",
    password: "",
    fee:"",
    availableDays: [], // Array for storing available days
    timeSlot: "",
  };
  const [DoctorValue, setDoctorValue] = useState(initData);

  const HandleDoctorChange = (e) => {
    setDoctorValue({ ...DoctorValue, [e.target.name]: e.target.value });
  };

  const HandleDoctorSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(DoctorRegister(DoctorValue)).then((res) => {
      if (res.message === "Doctor already exists") {
        setLoading(false);
        return notify("Doctor Already Exist");
      }
      if (res.message === "error") {
        setLoading(false);
        return notify("Something went wrong, Please try Again");
      }

      let data = {
        email: res.data.email,
        password: res.data.password,
        userId: res.data.docID,
        availableDays: res.data.availableDays,
        timeSlot: res.data.timeSlot,
      };

      // console.log(data, "DOCTOR REGISTER SUCCESSFULLY");
      dispatch(SendPassword(data)).then((res) =>
        notify("Doctor Registered Successfully")
      );
      setLoading(false);
      setDoctorValue(initData);
    });
  };

  if (data?.isAuthticated === false) {
    return <Navigate to={"/"} />;
  }

  if (data?.user.userType !== "admin") {
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <>
      <ToastContainer />
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="Main_Add_Doctor_div">
            <h1>Add Doctors</h1>
            <img src={doctor} alt="doctor" className="avatarimg" />
            <form onSubmit={HandleDoctorSubmit}>
              <div>
                <label>Doctor ID</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="CNIC No without dashes"
                    name="docID"
                    value={DoctorValue.docID}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Doctor Name</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="docName"
                    value={DoctorValue.docName}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Age</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="Age"
                    name="age"
                    value={DoctorValue.age}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Emergency Number</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="Emergency Number"
                    name="mobile"
                    value={DoctorValue.mobile}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Email</label>
                <div className="inputdiv">
                  <input
                    type="email"
                    placeholder="abc@abc.com"
                    name="email"
                    value={DoctorValue.email}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Gender</label>
                <div className="inputdiv">
                  <select
                    name="gender"
                    value={DoctorValue.gender}
                    onChange={HandleDoctorChange}
                    required
                  >
                    <option value="Choose Gender">Choose Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>
              <div>
                <label>Blood Group</label>
                <div className="inputdiv">
                  <select
                    name="bloodGroup"
                    value={DoctorValue.bloodGroup}
                    onChange={HandleDoctorChange}
                    required
                  >
                    <option value="Choose Blood Group">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
              <div>
                <label>Specialization</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Eg.Cardio,ent..."
                    name="specialization"
                    value={DoctorValue.specialization}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Address</label>
                <div className="inputdiv adressdiv">
                  <input
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={DoctorValue.address}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Education</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="eg.MBBS"
                    name="education"
                    value={DoctorValue.education}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Department</label>
                <div className="inputdiv">
                  <select
                    name="department"
                    value={DoctorValue.department}
                    onChange={HandleDoctorChange}
                    required
                  >
                    <option value="General">Select</option>
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

              <div>
                <label>Password</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Password"
                    name="password"
                    value={DoctorValue.password}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Consultation Fee</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Fee per patient"
                    name="fee"
                    value={DoctorValue.fee}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              {/* image of doctor */}
              <div>
                <label>Doctor Image</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="img url"
                    name="image"
                    value={DoctorValue.image}
                    onChange={HandleDoctorChange}
                    
                  />
                </div>
              </div>

              

      
          {/* /////week days on which doc is present */}
          <div>
            <label className="label">Available Days</label>
            <div className="available-days-container">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <label key={day} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="availableDays"
                    className="days-checkbox"
                    value={day}
                    checked={DoctorValue.availableDays.includes(day)}
                    onChange={(e) => {
                      const updatedDays = e.target.checked
                        ? [...DoctorValue.availableDays, day]
                        : DoctorValue.availableDays.filter(
                          (d) => d !== day
                        );
                      setDoctorValue({
                        ...DoctorValue,
                        availableDays: updatedDays,
                      });
                    }}
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>

          {/* /////week Time on which doc is present */}
          <div>
            <label>Time Slot</label>
            <div className="inputdiv">
              <select
                name="timeSlot"
                value={DoctorValue.timeSlot}
                onChange={HandleDoctorChange}
                required
              >
                <option value="">Select Time Slot</option>
                <option value="9:00 AM - 12:00 PM">
                  9:00 AM - 12:00 PM
                </option>
                <option value="12:00 PM - 3:00 PM">
                  12:00 PM - 3:00 PM
                </option>
                <option value="3:00 PM - 6:00 PM">3:00 PM - 6:00 PM</option>
                <option value="6:00 PM - 9:00 PM">6:00 PM - 9:00 PM</option>
              </select>
            </div>
          </div>

          <button type="submit" className="formsubmitbutton">
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div >
      </div >
    </>
  );
};

export default AddDoctor;
