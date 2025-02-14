import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getServiceStatuses, postService } from "../features/serviceSlice";

export default function AddService() {
  //STATES
  const [message, setMessage] = useState({ show: false, text: "", type: "" });
  const [formData, setFormData] = useState({
    title: "",
    provider: "",
    description: "",
    details: {
      duration: 0,
      category: "Consulting",
      price: 0,
      availability: "24/7",
    },
    benefits: [""],
  });

  //USE NAVIGATE
  const navigate = useNavigate();

  //USE DISPATCH
  const dispatch = useDispatch();

  //SELECITNG STATUSES FROM THE STORE
  const { addStatus } = useSelector(getServiceStatuses);

  //USE EFFECT TO SHOW NOTIFICATIONS
  useEffect(() => {
    if (addStatus === "success") {
      setMessage({
        show: true,
        message: "Service added successfully",
        type: "success",
      });

      setFormData({
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

      const timer = setTimeout(() => {
        setMessage({
          show: false,
          message: "",
          type: "warning",
        });
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    } else if (addStatus === "error") {
      setMessage({
        show: true,
        message: "Unable to add the service",
        type: "warning",
      });
    }
  }, [addStatus, navigate]);

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
    console.log("Submitting data:", formData);

    const cleanedFormData = {
      ...formData,
      benefits: formData.benefits.filter((benefit) => benefit.trim() !== ""),
    };
    console.log("Cleaned data:", cleanedFormData);

    try {
      await dispatch(postService(cleanedFormData));
    } catch (error) {
      console.error("Submission error: ", error);
    }
  };
  return (
    <main className="container my-5">
      <h1>Add New Service</h1>
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
            <option value="">Select Category</option>
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
          <label className="form-label">Availability</label>
          <select
            name="details.availability"
            className="form-select"
            value={formData.details.availability}
            onChange={handleChange}
          >
            <option value="">Select Availability</option>
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
                onChange={(e) => handleBenefitChange(index, e.target.value)}
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
            disabled={addStatus === "loading"}
          >
            {addStatus === "loading" ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Adding...
              </>
            ) : (
              "Add Service"
            )}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/")}
            disabled={addStatus === "loading"}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
