import VehicleLists from '../components/VehicleList/VehicleLists';
import { useState, useEffect } from 'react';
import { load } from 'dotenv';

function Cars({ web3, rentContract, account, forceUpdate }) {
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
              loadedVehicle.owner == account
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
  }, [web3, rentContract, account, forceUpdate]);

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  if (loadedvehicles.length > 0) {
    return (
      <div style={{ maxWidth: '768px', margin: '3rem auto' }}>
        <div>
          <h3 className="fw-bold fs-1 app-color header-font">MY CARS</h3>
          <hr />
        </div>
        <VehicleLists
          account={account}
          rentContract={rentContract}
          web3={web3}
          rentdetail={loadedvehicles}
          forceUpdate={forceUpdate}
        />
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
        You have no rentals, Please Create
      </div>
    );
  }
}

export default Cars;
