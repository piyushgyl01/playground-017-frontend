import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import DetailsLoading from "../components/DetailsLoading";
import {
  fetchSingleService,
  getServiceById,
  getServiceStatuses,
  updateService,
} from "../features/serviceSlice";

export default function ServiceDetails() {
  //STATES
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ show: false, text: "", type: "" });
  const [formData, setFormData] = useState({
    title: "",
    provider: "",
    description: "",
    details: {
      duration: 0,
      category: "",
      price: 0,
      availability: "",
    },
    benefits: [""],
  });

  //GETTING PRODUCT ID FROM USE PARAMS
  const { serviceId } = useParams();

  //USE DISPATCH
  const dispatch = useDispatch();

  //SELECTING SINGLE SERVICE
  const service = useSelector(getServiceById);

  //SELECITNG STATUSES FROM THE STORE
  const { fetchByIdStatus, updateStatus } = useSelector(getServiceStatuses);

  //FETCHING SERVICE
  useEffect(() => {
    dispatch(fetchSingleService(serviceId));
  }, [dispatch, serviceId]);

  //PREF FILLING EDIT FORM
  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || "",
        provider: service.provider || "",
        description: service.description || "",
        details: {
          duration: service.details?.duration || 0,
          category: service.details?.category || "",
          price: service.details?.price || 0,
          availability: service.details?.availability || "",
        },
        benefits: service.benefits || [""],
      });
    }
  }, [service]);

  //USE EFFECT TO SHOW NOTIFICATIONS
  useEffect(() => {
    if (updateStatus === "success") {
      dispatch(fetchSingleService(serviceId));

      setMessage({
        show: true,
        message: "Service updated successfully",
        type: "success",
      });

      setIsEditing(false)

      const timer = setTimeout(() => {
        setMessage({
          show: false,
          message: "",
          type: "warning",
        });
      }, 3000);

      return () => clearTimeout(timer);
    } else if (updateStatus === "error") {
      setMessage({
        show: true,
        message: "Unable to update the service",
        type: "warning",
      });
    }
  }, [updateStatus, dispatch, serviceId]);

  //HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("details.")) {
      const detailsField = name.split(".")[1];
      const parsedValue = ["duration", "price"].includes(detailsField)
        ? parseFloat(value) || 0
        : value;

      setFormData((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          [detailsField]: parsedValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  //HANDLE BENEFIT CHANGE
  const handleBenefitChange = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData((prev) => ({
      ...prev,
      benefits: newBenefits,
    }));
  };

  //HANDLE ADD BENEFIT
  const handleAddBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, ""],
    }));
  };

  //HANDLE REMOVE BENEFIT
  const handleRemoveBenefit = (index) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  //HANDLE SUBMIT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateService({ serviceId, formData }));
  };

  return (
    <>
      {fetchByIdStatus === "loading" ? (
        <DetailsLoading />
      ) : (
        <main className="container my-5">
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

          <h1>Details of {service?.title}</h1>

          {isEditing ? (
            <div className="card">
              <div className="card-header">Edit {service?.title}</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Provider</label>
                    <input
                      type="text"
                      name="provider"
                      className="form-control"
                      value={formData.provider}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      name="description"
                      className="form-control"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Duration</label>
                    <input
                      type="number"
                      name="details.duration"
                      className="form-control"
                      value={formData.details.duration}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      name="details.category"
                      className="form-select"
                      value={formData.details.category}
                      onChange={handleChange}
                    >
                      <option value="Consulting">Consulting</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Installation">Installation</option>
                      <option value="Training">Training</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      name="details.price"
                      className="form-control"
                      value={formData.details.price}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      name="details.availability"
                      className="form-select"
                      value={formData.details.availability}
                      onChange={handleChange}
                    >
                      <option value="24/7">24/7</option>
                      <option value="Business Hours">Business Hours</option>
                      <option value="On-Call">On-Call</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Benefits</label>
                    {formData.benefits.map((benefit, index) => (
                      <div className="d-flex gap-2 mb-2" key={index}>
                        <input
                          type="text"
                          className="form-control"
                          value={benefit}
                          onChange={(e) =>
                            handleBenefitChange(index, e.target.value)
                          }
                        />
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => handleRemoveBenefit(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      className="btn btn-secondary"
                      onClick={handleAddBenefit}
                      type="button"
                    >
                      Add Feature
                    </button>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={updateStatus === "loading"}
                    >
                      {updateStatus === "loading" ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Saving...
                        </>
                      ) : (
                        "Save changes"
                      )}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                      disabled={updateStatus === "loading"}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="card mb-4">
              <div className="card-header">{service?.title}</div>
              <div className="card-body">
                <p>
                  <strong>Provider: </strong>
                  {service?.provider}
                </p>
                <p>
                  <strong>Description: </strong>
                  {service?.description}
                </p>
                <p>
                  <strong>Duration: </strong>
                  {service?.details.duration} hours
                </p>
                <p>
                  <strong>Category: </strong>
                  {service?.details.category}
                </p>
                <p>
                  <strong>Price: </strong>
                  ${service?.details.price}
                </p>
                <p>
                  <strong>Availability: </strong>
                  {service?.details.availability}
                </p>
                <div className="mb-3">
                  <h6>Benefits</h6>
                  <ul>
                    {service?.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                <div className="row mb-2">
                  <button
                    className="btn btn-primary
                  "
                    onClick={() => setIsEditing(true)}
                  >
                    Edit details of {service?.title}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </>
  );
}
