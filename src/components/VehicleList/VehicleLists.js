import VehicleItem from './VehicleItem';
import classes from './VehicleLists.module.css';
import { useHistory } from 'react-router-dom';
import Truncate from '../Truncate';

function VehicleLists({ rentdetail, web3, rentContract, account }) {
  const history = useHistory();

  return (
    <div>
      {rentdetail.map((rentdetail) => (
        <div
          onClick={() => history.push(`/detail/${rentdetail.rentId}`)}
          key={rentdetail.rentId}
          className={classes.rentCard}
        >
          <div className={classes.rentCardBg}></div>
          <h3 className="mt-0 app-color fw-bold fs-3">{rentdetail.name}</h3>
          <p>
            Owner: <span className="text-white-50">{rentdetail.owner}</span>
          </p>
          <p>
            <Truncate text={rentdetail.description} length={100} />
          </p>
          <p className="fs-5 text-white-50">
            {rentdetail.rentPerDay} ETH Per day
          </p>
          <div className="text-end">
            <button className={classes.viewButton}>View Details </button>
          </div>
        </div>
        // <VehicleItem
        //   rentContract={rentContract}
        //   account={account}
        //   web3={web3}
        //   rentId={rentdetail.rentId}
        //   name={rentdetail.name}
        //   security={rentdetail.security}
        //   description={rentdetail.description}
        //   availability={rentdetail.availability}
        //   popularity={rentdetail.popularity}
        //   person={rentdetail.person}
        //   rentPerDay={rentdetail.rentPerDay}
        //   owner={rentdetail.owner}
        // />
      ))}
    </div>
  );
}

export default VehicleLists;
