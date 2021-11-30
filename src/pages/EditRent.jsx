import React, { useEffect, useRef, useState } from 'react';
import { Segment } from 'semantic-ui-react';
import useTransactionChecker from '../customHooks/useTransactionChecker';
import { toast } from 'react-toastify';
import formClasses from '../components/VehicleList/VehicleLists.module.css';

function EditRent(props) {
  const [addTransaction] = useTransactionChecker();
  const { match, web3, rentContract, account } = props;

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

  const fromWei = (amount) => {
    console.log(web3.utils.fromWei(amount, 'Ether'));
    return web3.utils.fromWei(amount, 'Ether');
  };
  const toWei = (amount) => {
    return web3.utils.toWei(amount.toString(), 'Ether');
  };

  useEffect(() => {
    const id = match.params.id;

    const init = async () => {
      try {
        const rent = await rentContract.methods.getRent(id).call();
        setForm((prevForm) => ({
          name: rent.name,
          security: fromWei(rent.security),
          description: rent.description,
          rentPerDay: fromWei(rent.rentPerDay),
        }));
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);

  const updateRent = async (e) => {
    e.preventDefault();
    const id = match.params.id;

    try {
      const transactionHash = rentContract.methods
        .editDetails(
          id,
          form.name,
          toWei(form.security),
          form.description,
          toWei(form.rentPerDay)
        )
        .send({ from: account }, async (err, txHash) => {
          toast(
            `Transaction in progress https://ropsten.etherscan.io/tx/${txHash}`
          );

          alert(
            `Transaction in progress, Please wait https://ropsten.etherscan.io/tx/${txHash}`
          );
        });

      // await addTransaction(transactionHash, '/', 'rent updated successfully')
    } catch (error) {
      console.log(error);
      alert('Transaction Failed');
    }
  };

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

  return (
    <div className={formClasses.formContainer}>
      <form className={`row g-3 ${formClasses.formCard}`} onSubmit={updateRent}>
        <div className="text-center pb-5">
          <h1 className="m-0">Edit Vehicle</h1>
          <p className="text-white-50">
            Kindly fill the form to update the vehicle details!
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
            name="rentPerDay"
            value={form.rentPerDay}
            ref={vehicleRentPerDay}
            className="form-control bg-dark text-white border border-dark py-3"
            placeholder="Vehicle rent amount..."
            required
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-success">
            Update!
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRent;
