import * as types from "./types";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const url="https://nhd-server.vercel.app"
// CreateReport

export const CreateReport = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.CREATE_REPORT_REQUEST });
    
    const res = await axios.post(
      `${url}/reports/create`,
      data
    );
    

    
    
    dispatch({
      type: types.CREATE_REPORT_SUCCESS,
      payload: res.data,
    });

    return res.data;

  } catch (error) {
    console.error("❌ Error while creating report:", error);

    // Handle different types of errors safely
    const errorMessage = error?.response?.data?.message || error?.message || "Unknown error occurred.";

    dispatch({
      type: types.CREATE_REPORT_ERROR,
      payload: { message: errorMessage },
    });
    return { message: errorMessage };
  }
};

// GET DOCTOR DETAILS
export const GetDoctorDetails = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_DOCTOR_REQUEST });
    const res = await axios.get(
      `${url}/doctors`
    );
    

    


    dispatch({
      type: types.GET_DOCTOR_SUCCESS,
      payload: {
    
      },
    });
  } catch (error) {
    dispatch({
      type: types.GET_DOCTOR_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

//ADD PATIENTS
export const AddPatients = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.ADD_PATIENT_REQUEST });
    const res = await axios.post(
      `${url}/patients/register`,
      data
    );
    
    return res.data;
   
  } catch (error) {
    

    
    dispatch({
      type: types.ADD_PATIENT_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

//ADD BEDS
export const CreateBeds = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.ADD_BED_REQUEST });
    const res = await axios.post(
      `${url}/beds/add`,
      data
    );
    
    return res.data;
   
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "An error occurred";

    toast.error(errorMessage); // Show error message
    dispatch({
      type: types.ADD_BED_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

//create payment
export const CreatePayment = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.CREATE_PAYMENT_REQUEST });
    const res = await axios.post(
      `${url}/payments/add`,
      data
    );
    
   
  } catch (error) {
    dispatch({
      type: types.CREATE_PAYMENT_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

//GET BEDS
export const GetBeds = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_BED_REQUEST });

    const res = await axios.get(`${url}/beds/available`);

    
    
    dispatch({
      type: types.GET_BED_SUCCESS,
      payload: res.data, // ✅ FIXED
    });
  } catch (error) {
    dispatch({
      type: types.GET_BED_ERROR,
      payload: { message: error },
    });
  }
};


//CREATE BOOKING
export const CreateBooking = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.CREATE_BOOKING_REQUEST });
    const res = await axios.post(
      `${url}/appointments/create`,
      data
    );
    
    // dispatch({ type: types.CREATE_BOOKING_SUCCESS, payload: res.data.postData });
  } catch (error) {
    console.log(error);
  }
};

//GET BEDS
export const AddBed = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.ADD_BEDS_REQUEST });
    const res = await axios.post(
      `${url}/beds/add`,
      data
    );
    
    
    return res.data;
  } catch (error) {
    dispatch({
      type: types.ADD_BEDS_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

// GET SINGLE BED
export const GetSingleBed = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_SINGLE_BEDS_REQUEST });
    const res = await axios.post(
      `${url}/beds/single`,
      data
    );
    
    return res.data;
    
  } catch (error) {
   
    console.log(error);
  }
};

// EDIT SINGLE BED
export const EditSingleBed = (data, id) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_SINGLE_BEDS_REQUEST });
    const res = await axios.patch(
      `${url}/beds/${id}`,
      data
    );
    
    return res.data;
    // dispatch({
    //   type: types.GET_SINGLE_BEDS_SUCCESS,
    //   payload: {

    //   },
    // });
  } catch (error) {
    // dispatch({
    //   type: types.GET_SINGLE_BEDS_ERROR,
    //   payload: {
    //     message: error,
    //   },
    // });
    console.log(error);
  }
};

// DISCHARGE PATIENT
export const dischargePatient = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.DISCHARGE_PATIENT_REQUEST });
    const res = await axios.put(
      `${url}/beds/discharge`,
      data
    );
    
    // return res.data;
    dispatch({
      type: types.DISCHARGE_PATIENT_SUCCESS,
      payload: {
        bed: res.data.bed,
      },
    });
  } catch (error) {
    // dispatch({
    // type: types.DISCHARGE_PATIENT_ERROR,
    //   payload: {
    //     message: error,
    //   },
    // });
    console.log(error);
  }
};

// GET ALL PATIENT
export const GetPatients = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_PATIENT_REQUEST });
    const res = await axios.get(
      `${url}/patients`
    );
    
    dispatch({
      type: types.GET_PATIENT_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
  }
};

// GET ALL DATA
export const GetAllData = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_ALLDATA_REQUEST });
    const res = await axios.get(
      `${url}/hospitals`
    );
    
    dispatch({
      type: types.GET_ALLDATA_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
  }
};
// GET specific doctore APPOINTMENT DETAILS
export const fetchDoctorAppointments = () => async (dispatch, getState) => {
  try {
    dispatch({ type: types.FETCH_APPOINTMENTS_REQUEST });

    const { user, token } = getState().auth.data; // Get user and token
    const doctorID = user?._id;

    if (!doctorID) {
      throw new Error("Doctor ID not found");
    }

    //  Include Authorization header with JWT token
    const res = await axios.get(`${url}/appointments/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Sending JWT token
      },
    });

    //  Ensure only the logged-in doctor's appointments are filtered
    const filteredAppointments = res.data.filter(
      (appt) => appt.doctorID === doctorID
    );

    dispatch({
      type: types.FETCH_APPOINTMENTS_SUCCESS,
      payload: filteredAppointments,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_APPOINTMENTS_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch appointments.",
    });
  }
};


// GET ALL APPOINTMENT DETAILS
export const GetAllAppointment = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_APPOINTMENT_DETAILS_REQUEST });
    const res = await axios.get(
      `${url}/appointments/`
    );
   
    // return res.data;
    dispatch({
      type: types.GET_APPOINTMENT_DETAILS_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
  }
};

// DELETE APPOINTMENTS
export const DeleteAppointment = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.DELETE_APPOINTMENT_REQUEST });
    const res = await axios.delete(
      `${url}/appointments/${id}`
    );
    
    // return res.data;
    dispatch({
      type: types.DELETE_APPOINTMENT_SUCCESS,
      payload: id,
    });
  } catch (error) {
    console.log(error);
  }
};

// GET ALL REPORTS
export const GetAllReports = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_REPORTS_REQUEST });
    const res = await axios.get(
      `${url}/reports`
    );
    
    return res.data;
    // dispatch({
    //   type: types.DELETE_APPOINTMENT_SUCCESS,
    //   payload: id,
    // });
  } catch (error) {
    console.log(error);
  }
};
