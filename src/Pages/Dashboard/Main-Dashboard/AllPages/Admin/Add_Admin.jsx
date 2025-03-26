import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AdminRegister, SendPassword } from "../../../../../Redux/auth/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import admin from "../../../../../img/admin.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";

const Add_Admin = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);

  const initialFormState = {
    adminName: "",
    adminID:"",
    age: "",
    mobile: "",
    email: "",
    gender: "",
    DOB: "",
    address: "",
    education: "",
    adminID: Date.now(),
    password: "",
  };

  const [adminDetails, setAdminDetails] = useState(initialFormState);

  const handleInputChange = (e) => {
    setAdminDetails({ ...adminDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log("Data being sent: ", JSON.stringify(adminDetails, null, 2));

    try {
      const res = await dispatch(AdminRegister(adminDetails));
      
      if (res?.message === "Admin already exists") {
        toast.error("Admin already exists");
      } else if (res?.message === "error") {
        toast.error("Something went wrong. Please try again.");
      } else {
        toast.success("Admin added successfully!");

        // Send password details
        const emailData = {
          email: res.data.email,
          password: res.data.password,
          userId: res.data.adminID,
        };
        await dispatch(SendPassword(emailData));
        toast.success("Account details sent!");

        // Reset form
        setAdminDetails(initialFormState);
      }
    }  catch (error) {
      
      toast.error(`Error: "Error adding admin."`);
    }
     finally {
      setLoading(false);
    }
  };

  if (!data?.isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (data?.user?.userType !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <ToastContainer />
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="Main_Add_Doctor_div">
            <h1>Add Admin</h1>
            <img src={admin} alt="admin" className="avatarimg" />
            <form onSubmit={handleSubmit}>
              {[
                    { label: "CNIC", name: "adminID", type: "text", placeholder: "CNIC without dashes" },
                { label: "Name", name: "adminName", type: "text", placeholder: "Full Name" },
                { label: "Age", name: "age", type: "number", placeholder: "Age" },
                { label: "Contact Number", name: "mobile", type: "number", placeholder: "Emergency Number" },
                { label: "Email", name: "email", type: "email", placeholder: "abc@abc.com" },
                { label: "Birthdate", name: "DOB", type: "date", placeholder: "dd-mm-yy" },
                { label: "Address", name: "address", type: "text", placeholder: "Address" },
                { label: "Education", name: "education", type: "text", placeholder: "e.g., MBBS" },
                { label: "Password", name: "password", type: "text", placeholder: "Password" },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label>{label}</label>
                  <div className="inputdiv">
                    <input
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      value={adminDetails[name]}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              ))}

              <div>
                <label>Gender</label>
                <div className="inputdiv">
                  <select name="gender" value={adminDetails.gender} onChange={handleInputChange} required>
                    <option value="">Choose Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="formsubmitbutton">
                {loading ? "Loading..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Add_Admin;
