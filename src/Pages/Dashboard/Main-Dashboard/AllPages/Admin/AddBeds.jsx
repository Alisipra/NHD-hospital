import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../GlobalFiles/Sidebar";
import  {AddBed}  from "../../../../../Redux/Datas/action";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";
const notify = (text) => toast(text);

const AddBeds = () => {
  const { data } = useSelector((store) => store.auth);

  const InitData = {
    roomNumber: "none",
    bedNumber: "",
    occupied: "available",
    ward:""
  };
  const [BedData, setBedData] = useState(InitData);

  const [loading, setloading] = useState(false);

  const dispatch = useDispatch();

  const HandleAmbuChange = (e) => {
    setBedData({
      ...BedData,
      [e.target.name]: e.target.value,
    });
  };

  const HandleAmbuSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    const response = await dispatch(AddBed(BedData));

   if (response?.error) {
    notify(` ${response.message}`);
  } else if (response?.message === "Bed already present") {
    notify(" Bed already exists in the same room.");
  } else {
    notify(" Bed Added");
    setBedData(InitData);
  }

    
    setloading(false);
    
    
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
          <div className="mainAmbupance">
            <h1>Add Beds</h1>

            {/* ******************************************************** */}
            <form onSubmit={HandleAmbuSubmit}>
              <div>
                <label>Bed Number</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="bed No"
                    name="bedNumber"
                    value={BedData.bedNumber}
                    onChange={HandleAmbuChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Room Number</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="room no"
                    name="roomNumber"
                    value={BedData.roomNumber}
                    onChange={HandleAmbuChange}
                    required
                  />
                </div>
              </div>
            {/* wards adding */}
            <div>
                <label>Ward</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="ward name"
                    name="ward"
                    value={BedData.ward}
                    onChange={HandleAmbuChange}
                    required
                  />
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

export default AddBeds;
