import VehicleItem from './VehicleItem';
import classes from './VehicleLists.module.css';

function Vehicle({ rentdetail, web3, rentContract, account }) {
  return (
    <ul className={classes.list}>
      {rentdetail.map((rentdetail) => (
        <VehicleItem
          rentContract={rentContract}
          account={account}
          web3={web3}
          rentId={rentdetail.rentId}
          name={rentdetail.name}
          security={rentdetail.security}
          description={rentdetail.description}
          availability={rentdetail.availability}
          popularity={rentdetail.popularity}
          person={rentdetail.person}
          rentPerDay={rentdetail.rentPerDay}
          owner={rentdetail.owner}
        />
      ))}
    </ul>
  );
}

export default Vehicle;
