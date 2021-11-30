import { Segment } from 'semantic-ui-react';
import { useRef, useState } from 'react';
import classes from './VehicleLists.module.css';

function NewForm(props) {
  const vehicleName = useRef();
  const vehicleSecurity = useRef();
  const vehicleDesctiption = useRef();
  const vehicleRentPerDay = useRef();
  const [form, setForm] = useState({
    name: '',
    security: '',
    description: '',
    rentPerDay: '',
  });

  const oninput = ({ target }) => {
    let { name, value } = target;
    if (name == 'security' || name == 'rentPerDay') {
      value = parseFloat(value);
      if (typeof value != 'number') return;
    }
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  function submitData(event) {
    event.preventDefault();

    const vehicleData = {
      name: form.name,
      security: form.security,
      description: form.description,
      rentPerDay: form.rentPerDay,
    };

    props.createRent(vehicleData);
  }

  return (
    <div className={classes.formContainer}>
      <form className={`row g-3 ${classes.formCard}`} onSubmit={submitData}>
        <div className="text-center pb-5">
          <h1 className="m-0">Add New Vehicle</h1>
          <p className="text-white-50">
            Kindly fill the form below to add a vehicle for rent!
          </p>
        </div>
        <div className="form-group col-md-12">
          <label className="form-label">Vehicle Name</label>
          <input
            onChange={oninput}
            id="vehicleName"
            htmlFor="name"
            name="name"
            value={form.name}
            type="text"
            ref={vehicleName}
            className="form-control bg-dark text-white border border-dark py-3"
            placeholder="Vehicle Name..."
            required
          />
        </div>
        <div className="form-group col-md-12">
          <label className="form-label">Security</label>
          <input
            onChange={oninput}
            id="vehicleSecurity"
            htmlFor="security"
            name="security"
            value={form.security}
            type="number"
            step="0.0000001"
            ref={vehicleSecurity}
            className="form-control bg-dark text-white border border-dark py-3"
            placeholder="Vehicle Security..."
            required
          />
        </div>
        <div className="form-group col-12">
          <label className="form-label">Vehicle Details</label>
          <input
            onChange={oninput}
            id="vehicleDesctiption"
            type="text"
            name="description"
            value={form.description}
            htmlFor="description"
            ref={vehicleDesctiption}
            className="form-control bg-dark text-white border border-dark py-3"
            placeholder="Vehicle Details..."
            rows="3"
            required
          />
        </div>
        <div className="form-group col-12">
          <label className="form-label">Rent per Day</label>
          <input
            onChange={oninput}
            id="vehiclerentPerDay"
            htmlFor="rentPerDay"
            type="number"
            step="0.0000001"
            name="rentPerDay"
            value={form.rentPerDay}
            ref={vehicleRentPerDay}
            className="form-control bg-dark text-white border border-dark py-3"
            placeholder="Vehicle rent amount..."
            required
          />
        </div>
        <div className="col-12 py-4">
          <button type="submit" className="btn btn-success w-100 py-3">
            Submit!
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewForm;
