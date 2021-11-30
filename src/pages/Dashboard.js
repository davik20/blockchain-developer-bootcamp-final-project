import { useState, useEffect } from 'react';
import VehicleLists from '../components/VehicleList/VehicleLists';
import { Link } from 'react-router-dom';
import vehicleIcon from '../assets/icons/electric-vehicle.png';
import { load } from 'dotenv';

function Dashboard({ web3, rentContract, account }) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedvehicles, setLoadedvehicles] = useState([]);

  useEffect(() => {
    if (web3 && rentContract && account) {
      const init = async () => {
        try {
          const fromWei = (amount) => {
            console.log(web3.utils.fromWei(amount, 'Ether'));
            return web3.utils.fromWei(amount, 'Ether');
          };

          setIsLoading(true);
          let loadedvehicles = await rentContract.methods.getAllRent().call();

          let loadedVehicles = loadedvehicles.filter((loadedVehicle) => {
            console.log(account);
            if (
              loadedVehicle.exists == true &&
              loadedVehicle.owner != account
            ) {
              return {
                ...loadedVehicle,
                security: fromWei(loadedVehicle.security),
                rentPerDay: fromWei(loadedVehicle.rentPerDay),
              };
            }
          });

          loadedVehicles = loadedVehicles.map((loadedVehicle) => {
            return {
              ...loadedVehicle,
              security: fromWei(loadedVehicle.security),
              rentPerDay: fromWei(loadedVehicle.rentPerDay),
            };
          });
          console.log(loadedVehicles);
          setLoadedvehicles(loadedVehicles);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      };

      init();
    }
  }, [web3, rentContract, account]);

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  if (loadedvehicles.length > 0) {
    return (
      <div>
        <div
          style={{
            maxWidth: '1040px',
            margin: '2rem auto',
            padding: '5rem 1rem',
          }}
          className="text-center"
        >
          <h1
            className="header-font mb-5 dashboard-header"
            style={{
              maxWidth: '840px',
              margin: '2rem auto',
              fontWeight: '800',
              // fontSize: '3.5rem',
              color: '#e1e1e1',
            }}
          >
            Decentralized And Easy Way To{' '}
            <span className="app-underline"> Rent A Vehicle </span>{' '}
          </h1>
          <p className="fs-4 lh-base">
            V-Rent is a platform that enables you to rent verified and reliable
            vehicles using blockchain technology. The platform provides a wide
            variety of vehicles to select from, while enabling you earn by
            providing your vehicle for rental.
          </p>
        </div>
        <div className="bg-dark w-100 border-bottom border-5 border-info p-2 py-5 p-md-5 d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="d-flex align-items-center ">
            <div>
              <img src={vehicleIcon} width={50} alt="🙂" />
            </div>
            <div className="d-flex flex-column ms-4">
              <h3 className="mb-1 header-font fs-5">
                Rent your vehicle Today.
              </h3>
              <p className="fs-6">
                Keep track of the status of your vehicles and manage your
                requests.
              </p>
            </div>
          </div>

          <div className="mt-3 md-mt-0">
            <Link to="/blockchain-developer-bootcamp-final-project/new-rent">
              {' '}
              <button className="btn btn-info py-3 px-4 text-white me-2 mb-1">
                Add Rental
              </button>
            </Link>
            <Link to="/blockchain-developer-bootcamp-final-project/my-cars">
              <button className="btn btn-outline-danger py-3 mb-1">
                Manage Vehicles
              </button>
            </Link>
          </div>
        </div>
        <div
          style={{ maxWidth: '1040px', margin: '1rem auto', padding: '5rem 0' }}
        >
          <div className="my-5">
            <h3 className="header-font fw-bold fs-2 app-color">
              Vehicle Listings
            </h3>
            <hr />
          </div>
          <VehicleLists
            account={account}
            rentContract={rentContract}
            web3={web3}
            rentdetail={loadedvehicles}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: 'vw',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '2rem',
        }}
      >
        There are no Cars available for rent
      </div>
    );
  }
}

export default Dashboard;
