import VehicleItem from '../components/VehicleList/VehicleItem';
import { useState, useEffect } from 'react';

function VehicleDetails(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState();
  const { match, web3, rentContract, account } = props;

  useEffect(() => {
    if (web3 && rentContract && account) {
      const id = match.params.id;
      const init = async () => {
        try {
          setIsLoading(true);
          const rent = await rentContract.methods.getRent(id).call();
          setSelectedVehicle(rent);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      };
      init();
    }
  }, []);

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  if (selectedVehicle.rentId !== '0') {
    return (
      <VehicleItem
        rentContract={rentContract}
        account={account}
        web3={web3}
        rentId={selectedVehicle.rentId}
        name={selectedVehicle.name}
        security={selectedVehicle.security}
        description={selectedVehicle.description}
        availability={selectedVehicle.availability}
        popularity={selectedVehicle.popularity}
        person={selectedVehicle.person}
        rentPerDay={selectedVehicle.rentPerDay}
        owner={selectedVehicle.owner}
      />
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
        This vehicle does not exist!
      </div>
    );
  }
}

export default VehicleDetails;
