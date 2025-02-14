import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingUi from "../components/LoadingUi.jsx";
import {
  deleteService,
  fetchAllServices,
  getFilteredServices,
  getServiceStatuses,
  setSearchFilter,
} from "./serviceSlice.js";

export default function ServiceList() {
  //STATES
  const [message, setMessage] = useState({
    show: false,
    message: "",
    type: "warning",
  });
  const [deletingId, setDeletingId] = useState(null);

  //GETTING SERVICE FILTER FROM THE STORE
  const searchFilter = useSelector((state) => state.services.searchFilter);

  //USE DISPATCH FUNCTION
  const dispatch = useDispatch();

  //GETTING SERVICES FROM THE STORE
  const services = useSelector(getFilteredServices);

  //DISPATCHING API CALL
  useEffect(() => {
    dispatch(fetchAllServices());
  }, [dispatch]);

  //GETTING STATUSES FROM THE STORE
  const { fetchStatus, deleteStatus } = useSelector(getServiceStatuses);

  //HANDLE DELETE EFFECT
  useEffect(() => {
    if (deleteStatus === "success") {
      setMessage({
        show: true,
        message: "Service deleted successfully",
        type: "success",
      });

      const timer = setTimeout(() => {
        setMessage({
          show: false,
          message: "",
          type: "warning",
        });
      }, 3000);
      setDeletingId(null);

      return () => clearTimeout(timer);
    } else if (deleteStatus === "error") {
      setMessage({
        show: true,
        message: "Unable to delete the service",
        type: "warning",
      });
      setDeletingId(null);
    }
  }, [deleteStatus, deletingId]);

  //HANDLE DELETE FUNCTIONS
  const handleDelete = (id) => {
    setDeletingId(id);
    dispatch(deleteService(id));
  };

  //HANDLE SEARCH CHANGE
  const handleSearchChange = (e) => {
    dispatch(setSearchFilter(e.target.value));
  };

  return (
    <>
      <h1>All Services</h1>
      <div className="row">
        <div className="col-md-12">
          <input
            type="text"
            placeholder="Search service"
            value={searchFilter}
            onChange={handleSearchChange}
            className="form-control my-4"
          />
        </div>
      </div>
      {fetchStatus === "loading" && (
        <div className="row">
          {[...Array(10)].map((_, index) => (
            <LoadingUi key={index} />
          ))}
        </div>
      )}

      {fetchStatus === "error" && <p>Error occured while fetching the data</p>}

      {message.show && (
        <div className="row">
          <div className="col-md-12">
            <p
              className={
                message.type === "warning"
                  ? "bg-danger-subtle p-3 rounded"
                  : "bg-success-subtle p-3 rounded"
              }
            >
              {message.message}
            </p>
          </div>
        </div>
      )}

      <div className="row">
        {services.map((service) => (
          <div className="col-md-4" key={service._id}>
            <div className="card mb-4 p-2">
              <div className="card-header">{service.title}</div>
              <div className="card-body">
                <p>
                  <strong>Provider: </strong>
                  {service.provider}
                </p>
                <p>
                  <strong>Duration: </strong>
                  {service.details.duration} hours
                </p>
                <p>
                  <strong>Category: </strong>
                  {service.details.category}
                </p>
                <p>
                  <strong>Price: </strong>${service.details.price}
                </p>
                <p>
                  <strong>Availability: </strong>
                  {service.details.availability}
                </p>
                <div className="row mb-2">
                  <Link
                    className="btn btn-primary"
                    to={`/service-details/${service.title}/${service._id}`}
                  >
                    See Details
                  </Link>
                </div>
                <div className="row">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(service._id)}
                    disabled={deletingId === service._id}
                  >
                    {deletingId === service._id ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
