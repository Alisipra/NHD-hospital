import React, { useState } from "react";
import { Radio, Drawer } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AdminLogin,
  DoctorLogin,
  forgetPassword,
  NurseLogin,
} from "../../../Redux/auth/action";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import banner from "../../../img/banner.png";
import admin from "../../../img/admin.jpg";
import "./DLogin.css";

const notify = (text, type = "info") => toast[type](text);

const DLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // **State for Role Selection**
  const [placement, setPlacement] = useState("Nurse");

  // **Login Form State**
  const [formValues, setFormValues] = useState({ ID: "", password: "" });
  const [loading, setLoading] = useState(false);

  // **Forget Password State**
  const [openDrawer, setOpenDrawer] = useState(false);
  const [forgetPasswordData, setForgetPasswordData] = useState({
    type: "",
    email: "",
  });
  const [forgetLoading, setForgetLoading] = useState(false);

  // **Handle Input Changes**
  const handleChange = (e) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlacementChange = (e) => {
    setPlacement(e.target.value);
  };

  // **Login Submission**
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formValues.ID || !formValues.password) {
      setLoading(false);
      return notify("All fields are required!", "error");
    }

    let data = { ...formValues };
    let action;

    if (placement === "Nurse") {
      data.nurseID = formValues.ID;
      action = NurseLogin;
    } else if (placement === "Doctor") {
      data.docID = formValues.ID;
      action = DoctorLogin;
    } else if (placement === "Admin") {
      data.adminID = formValues.ID;
      action = AdminLogin;
    }
    
    try {
      const res = await dispatch(action(data));
    
      
      if (res?.message === "Login Successful" || res?.message === "Successful") {
        notify("Login Successful", "success");
         // Optionally, store token (e.g., localStorage/sessionStorage)
        localStorage.setItem("token", res.token);
        navigate("/dashboard");
      } else if (res?.message === "Wrong credentials") {
        notify("Wrong credentials", "error");
        
      } else {
        notify("Something went wrong, please try again", "error");
      }
    } catch (error) {
      notify("Login Failed! Please check your credentials.", "error");
    }

    setLoading(false);
  };

  // **Handle Forget Password Input**
  const handleForgetPasswordChange = (e) => {
    setForgetPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // **Handle Forget Password Submission**
  const handleForgetPassword = async () => {
    if (!forgetPasswordData.type || !forgetPasswordData.email) {
      return notify("Please fill all details!", "error");
    }

    setForgetLoading(true);

    try {
      const res = await dispatch(forgetPassword(forgetPasswordData));

      if (res?.message === "User not found") {
        notify("User not found!", "error");
      } else {
        notify("Account details sent to email!", "success");
        setOpenDrawer(false);
        setForgetPasswordData({ type: "", email: "" });
      }
    } catch (error) {
      notify("Failed to send email. Please try again.", "error");
    }

    setForgetLoading(false);
  };

  return (
    <>
      <ToastContainer />

      <div className="mainLoginPage">
        {/* Left Side Banner */}
        <div className="leftside">
          <img src={banner} alt="banner" />
        </div>

        {/* Right Side Login Form */}
        <div className="rightside">
          <h1 className="text-white">Login</h1>

          {/* Role Selection */}
          <Radio.Group value={placement} onChange={handlePlacementChange} className="radiogroup">
            <Radio.Button value="Nurse" className="radiobutton">Nurse</Radio.Button>
            <Radio.Button value="Doctor" className="radiobutton">Doctor</Radio.Button>
            <Radio.Button value="Admin" className="radiobutton">Admin</Radio.Button>
          </Radio.Group>

          {/* Profile Image */}
          <div className="Profileimg">
            <img src={admin} alt="profile" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <h3>{placement} ID</h3>
            <input type="text" name="ID" value={formValues.ID} onChange={handleChange} required />

            <h3>Password</h3>
            <input type="password" name="password" value={formValues.password} onChange={handleChange} required />

            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>

            {/* Forget Password */}
            <p style={{ marginTop: "10px" }}>
              Forgot Password?{" "}
              <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setOpenDrawer(true)}>
                Get it on Email!
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* Forget Password Drawer */}
      <Drawer title="Forget Password" placement="left" onClose={() => setOpenDrawer(false)} open={openDrawer}>
        <div>
          <label style={{ fontSize: "18px" }}>Choose Type</label>
          <select name="type" value={forgetPasswordData.type} onChange={handleForgetPasswordChange} required>
            <option value="">User Type</option>
            <option value="nurse">Nurse</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "18px" }}>Enter Email</label>
          <input
            type="email"
            placeholder="example@mail.com"
            name="email"
            value={forgetPasswordData.email}
            onChange={handleForgetPasswordChange}
            required
            style={{
              width: "100%",
              height: "3rem",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#bce0fb",
              fontSize: "18px",
              marginTop: "10px",
              paddingLeft: "10px",
            }}
          />
        </div>

        <button
          style={{
            width: "50%",
            margin: " 20px auto",
            display: "flex",
            padding: "10px",
            fontSize: "18px",
            backgroundColor: "#ff9f9f",
            border: "none",
            borderRadius: "7px",
            cursor: "pointer",
            justifyContent: "center",
          }}
          onClick={handleForgetPassword}
          disabled={forgetLoading}
        >
          {forgetLoading ? "Loading..." : "Send Mail"}
        </button>
      </Drawer>
    </>
  );
};

export default DLogin;
