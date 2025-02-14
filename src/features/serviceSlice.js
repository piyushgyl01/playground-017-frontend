import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://playground-017-backend.vercel.app/api";

//FETCH ALL SERVICE FROM THE API
export const fetchAllServices = createAsyncThunk(
  "services/fetchAllServices",
  async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-services`);

      return response.data;
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }
  }
);

//FETCH A SINGLE SERVICE BY ID
export const fetchSingleService = createAsyncThunk(
  "services/fetchSingleService",
  async (serviceId) => {
    try {
      const response = await axios.get(`${BASE_URL}/get-service/${serviceId}`);

      return response.data;
    } catch (error) {
      console.error("Fetch By ID Error:", error);
      throw error;
    }
  }
);

//CREATE A NEW SERVICE
export const postService = createAsyncThunk(
  "services/postService",
  async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/post-service`, formData);

      return response.data;
    } catch (error) {
      console.error("Post Error:", error);
      throw error;
    }
  }
);

//UPDATE AN EXISTING SERVICE
export const updateService = createAsyncThunk(
  "services/updateService",
  async ({ serviceId, formData }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/put-service/${serviceId}`,
        formData
      );

      return response.data;
    } catch (error) {
      console.error("Update Error:", error);
      throw error;
    }
  }
);

//DELETE AN EXISTING SERVICE
export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (serviceId) => {
    try {
      await axios.delete(`${BASE_URL}/delete-service/${serviceId}`);

      return { serviceId };
    } catch (error) {
      console.error("Delete Error:", error);
      throw error;
    }
  }
);

export const serviceSlice = createSlice({
  name: "services",
  initialState: {
    services: [],
    singleService: null,
    fetchStatus: "idle",
    fetchByIdStatus: "idle",
    addStatus: "idle",
    deleteStatus: "idle",
    updateStatus: "idle",
    searchFilter: "",
    error: null,
  },
  reducers: {
    setSearchFilter: (state, action) => {
      state.searchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL SERVICES
      .addCase(fetchAllServices.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchAllServices.fulfilled, (state, action) => {
        state.fetchStatus = "success";
        state.services = action.payload;
        state.error = null;
      })
      .addCase(fetchAllServices.rejected, (state, action) => {
        state.fetchStatus = "error";
        state.error = action.error.message;
      })

      // FETCH SINGLE SERVICE
      .addCase(fetchSingleService.pending, (state) => {
        state.fetchByIdStatus = "loading";
      })
      .addCase(fetchSingleService.fulfilled, (state, action) => {
        state.fetchByIdStatus = "success";
        state.singleService = action.payload;
        state.error = null;
      })
      .addCase(fetchSingleService.rejected, (state, action) => {
        state.fetchByIdStatus = "error";
        state.error = action.error.message;
      })

      // POST NEW SERVICE
      .addCase(postService.pending, (state) => {
        state.addStatus = "loading";
      })
      .addCase(postService.fulfilled, (state, action) => {
        state.addStatus = "success";
        state.services.push(action.payload);
        state.error = null;
      })
      .addCase(postService.rejected, (state, action) => {
        state.addStatus = "error";
        state.error = action.error.message;
      })

      // DELETE EXISTING SERVICE
      .addCase(deleteService.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.deleteStatus = "success";
        state.services = state.services.filter(
          (service) => service._id !== action.payload.serviceId
        );
        state.error = null;
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.deleteStatus = "error";
        state.error = action.error.message;
      })

      // UPDATE EXISTING SERVICE
      .addCase(updateService.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.updateStatus = "success";
        const updatedService = action.payload;
        const index = state.services.findIndex(
          (service) => service._id === updatedService._id
        );
        if (index !== -1) {
          state.services[index] = updatedService;
        }
        state.error = null;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.updateStatus = "error";
        state.error = action.error.message;
      });
  },
});

//SELECTING ALL SERVICES
export const getAllServices = (state) => state.services.services;
export const getServiceById = (state) => state.services.singleService;

//SELECTING SERVICE'S STATUSES
export const getServiceStatuses = createSelector(
  (state) => state.services.fetchStatus,
  (state) => state.services.addStatus,
  (state) => state.services.deleteStatus,
  (state) => state.services.updateStatus,
  (state) => state.services.fetchByIdStatus,

  (fetchStatus, addStatus, deleteStatus, updateStatus, fetchByIdStatus) => ({
    fetchStatus,
    addStatus,
    deleteStatus,
    updateStatus,
    fetchByIdStatus,
  })
);

//FILTERING SERVICE BASED ON THE SEARCH INPUT
export const getFilteredServices = createSelector(
  [getAllServices, (state) => state.services.searchFilter],
  (services, searchFilter) => {
    if (!searchFilter) return services;

    return services.filter(
      (service) =>
        service.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        service.provider.toLowerCase().includes(searchFilter.toLowerCase()) ||
        service.description.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }
);

//EXPORT ACTIONS
export const { setSearchFilter } = serviceSlice.actions;

//EXPORT REDUCER
export default serviceSlice.reducer;
