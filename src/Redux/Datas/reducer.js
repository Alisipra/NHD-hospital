import * as types from "./types";

const initialState = {
  loading: false,
  error: false,
  doctors: [],
  reports: [],
  beds: [],
  patients: [],
  nurses: [],
  dashboard: [],
  Appointments: [], // ✅ This needs to update properly
};

export default function dataReducer(state = initialState, { type, payload }) {
  switch (type) {
    case types.GET_DOCTOR_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case types.GET_DOCTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        doctors: payload,
      };

    case types.GET_BED_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case types.GET_BED_SUCCESS:
      return {
        ...state,
        loading: false,
        beds: payload,
      };

    case types.GET_PATIENT_SUCCESS:
      return {
        ...state,
        loading: false,
        patients: payload,
      };

    case types.GET_ALLDATA_SUCCESS:
      return {
        ...state,
        loading: false,
        dashboard: payload,
      };

    case types.DISCHARGE_PATIENT_SUCCESS:
      return {
        ...state,
        beds: state.beds.map((ele) =>
          ele._id === payload.bed._id ? payload.bed : ele
        ),
      };

    case types.FETCH_APPOINTMENTS_REQUEST: // ✅ Add loading state
      return {
        ...state,
        loading: true,
      };

    case types.FETCH_APPOINTMENTS_SUCCESS: // ✅ This is the missing case
      return {
        ...state,
        loading: false,
        Appointments: payload, // ✅ Store filtered appointments
      };

    case types.FETCH_APPOINTMENTS_FAILURE: // ✅ Handle error
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case types.DELETE_APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        Appointments: state.Appointments.filter(
          (ele) => ele._id !== payload
        ),
      };

    case types.GET_APPOINTMENT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        Appointments: payload,
      };

    default:
      return state;
  }
}
