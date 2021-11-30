import React, { useEffect, useState} from 'react';
import { Card, Button } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import useTransactionChecker from '../../customHooks/useTransactionChecker';
import { toast } from 'react-toastify';

function VehicleItem(props) {

  const { rentContract, account, web3 , forceUpdate} = props;
  const [hasRented, setHasRented] = useState(false);
  const [isRenting, setIsRenting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const history = useHistory();

  const [addTransaction] = useTransactionChecker(web3);

  useEffect(() => {
    const init = async () => {
      const { rentContract, account, owner, security, rentPerDay } = props;
      const rented = await rentContract.methods.rented(account).call();
      const isRenting = await rentContract.methods.isRenting(account).call();

      if (isRenting == true) {
        setIsRenting(true);
      }

      if (rented == props.rentId) {
        setHasRented(true);
      }

      if (owner == account) {
        setIsOwner(true);
      }
    };

    init();
  }, []);

  const unlistVehicle = async (rentId) => {
    const { rentContract, account } = props;

    try {
      const loading = toast.loading("Unlisting in progress")
       await rentContract.methods
        .deleteRent(rentId)
        .send({ from: account }, async (err, txHash) => {
         

          
        });

        toast.dismiss(loading)
        toast.success(
          `Vehicle unlisted successfully`
        )

        setTimeout(()=> {
          history.push(`/blockchain-developer-bootcamp-final-project/my-cars`)

        },3000)

      
    } catch (error) {
      // alert(error.message)
      console.log(error);
      alert('transaction failed');
    }
  };

  const toWei = (amount) => {
    // console.log(web3.utils.toWei(amount, 'Ether'));
    return web3.utils.toWei(amount, 'Ether');
  };
  const toEther = (amount) => {
    return web3.utils.fromWei(amount, 'ether');
  };
  const rentVehicle = async (rentId) => {
    const { rentContract, account, owner, security, rentPerDay } = props;
    // console.log(props)
    // console.log(owner);
    if (isOwner) {
      alert('You are the owner of this Car, You cannot rent it');
      return;
    }
    if (isRenting == true) {
      alert('You are already renting a car, please return');
      return;
    }
    if (hasRented == true) {
      alert('You already rented this car');
    }
    if (props.availability == 0) {
      alert('This car has been rented out already');
      return;
    }

    if (props.availability == -1) {
      alert('This car is in Maintenance');
      return;
    }

    try {
      let value = parseFloat(toEther(security)) + parseFloat(toEther(rentPerDay));
      // console.log(parseFloat(security));
      // console.log(value);
      // console.log(parseInt(security) + parseInt(rentPerDay))
      alert(`You are about to pay ${value.toFixed(4)}Eth to rent this car`);
      const loading =  toast.loading("Vehicle rent in progress")
      await rentContract.methods
        .takeRent(rentId, 1)
        .send(
          { from: account, value: (parseInt(security) + parseInt(rentPerDay))},
          async (err, txHash) => {
           
            
          }
        );

        toast.dismiss(loading);
        toast.success(
         "Vehicle returned successfully"
          
        );

        setTimeout(()=> {
          forceUpdate()
          
        },3000)

      //  await addTransaction(transactionHash , "/", "Vehicle has been rented Successfully")
    } catch (error) {
      console.log(error);
      alert('transaction failed');
    }
  };

  const returnVehicle = async (rentId) => {
    const { rentContract, account, owner, security, rentPerDay } = props;
    try {
      const loading =  toast.loading("Vehicle return in progress")
       await rentContract.methods
        .returnRent(rentId)
        .send({ from: account }, async (err, txHash) => {
         
         
        })

        toast.dismiss(loading)
        toast.success(
          `Vehicle return successful`
        );

        setTimeout(()=> {
          forceUpdate()
             
        },3000)
        

      // await addTransaction(transactionHash, "/", 'Vehicle returned successfully')
    } catch (error) {
      console.log(error);
      alert('transaction failed');
    }
  };

  const takeToMaintain = async (rentId) => {
    const { rentContract, account, owner, security, rentPerDay } = props;
    try {
      const loading =  toast.loading("Taking to maintenance")
      await rentContract.methods
        .takeToMaintenance(rentId)
        .send({ from: account }, async (err, txHash) => {
         
        })
        
        setTimeout(()=> {
          forceUpdate()
        },3000)
     
        toast.dismiss(loading)
        toast.success(
          `Car successfully taken to maintenance`
        );
    } catch (error) {
      console.log(error);
      alert('transaction failed');
    }
  };
  const removeFromMaintain = async (rentId) => {
    const { rentContract, account, owner, security, rentPerDay } = props;
    try {

     const loading =  toast.loading("Removing from maintenance")
      await rentContract.methods
        .removeFromMaintenance(rentId)
        .send({ from: account }, async (err, txHash) => {
         
        });

        toast.dismiss(loading);
        toast.success(
          `Car successfully removed from maintenance`
        );

        setTimeout(()=> {
          forceUpdate()
        },3000)
        


    } catch (error) {
      console.log(error);
      alert('transaction failed');
    }
  };

  const shorten = (string) => {
    let start = string.substring(0, 10);
    let end = string.substring(string.length - 1 - 6, string.length);
    const result = `${start}....${end}`;
    return result;
  };

  return (
    <React.Fragment>
      <div
        className="d-flex flex-column flex-md-row justify-content-between"
        style={{ paddingTop: '6rem' }}
      >
        <h2 className="fs-2 header-font fw-bold mb-1">{props.name}</h2>
        <div>
          {isOwner && (
            <>
              <Button
                onClick={() => history.push(`/blockchain-developer-bootcamp-final-project/rent/${props.rentId}/edit`)}
                basic
                color="teal"
                content="Edit Details"
                className="py-3 me-2"
              />
              {props.availability == 1 && isOwner && (
                <Button
                  onClick={() => takeToMaintain(props.rentId)}
                  color="blue"
                  className="py-3 me-2"
                >
                  Take to Maintenance
                </Button>
              )}
              {props.availability == -1 && isOwner && (
                <Button
                  onClick={() => removeFromMaintain(props.rentId)}
                  color="blue"
                  className="py-3 me-2"
                >
                  Remove From Maintenance
                </Button>
              )}
              <Button
                onClick={() => unlistVehicle(props.rentId)}
                basic
                color="red"
                content="Unlist Vehicle"
                className="py-3 me-2 mt-1"
              />
            </>
          )}
          {!hasRented && !isOwner && (
            <Button
              onClick={() => rentVehicle(props.rentId)}
              basic
              color="purple"
              content="Rent Vehicle"
              className="py-3 me-2"
            />
          )}
          {hasRented && (
            <Button
              onClick={() => returnVehicle(props.rentId)}
              basic
              color="purple"
              content="Return Vehicle"
              className="py-3 me-2"
            />
          )}
        </div>
      </div>
      <hr />
      <div
        className="my-5 shadow-lg mx-auto px-1 py-5 mb-5 p-md-5"
        style={{ maxWidth: '786px' }}
      >
        <h3>
          Owner's Address: <span className="fs-6"> {props.owner} </span>
        </h3>
        <h5 className="fs-5">
          Leaser Address:{' '}
          {props.person == '0x0000000000000000000000000000000000000000' ? (
            <span className="text-danger"> No leaser Yet </span>
          ) : (
            <span className="app-color fs-6"> {props.person} </span>
          )}
        </h5>
        <h5 className="fs-5">
          {' '}
          Minimum Security to pay(Eth):{' '}
          <span className="text-white-50">
            {' '}
            {toEther(props.security)} ETH{' '}
          </span>{' '}
        </h5>
        <p className="fs-5">
          Availability:{' '}
          {props.availability == 1 ? (
            <span className="badge bg-success"> Available </span>
          ) : props.availability == -1 ? (
            <span className="badge bg-info"> In Maintenance </span>
          ) : (
            <span className="badge bg-danger">
              {' '}
              Rented Out {hasRented ? ' By you' : 'To someone else'}{' '}
            </span>
          )}
        </p>
        <p className="fs-5">
          Number of times the vehicle has been rented: {props.popularity}
        </p>
        <p className="fs-5">
          Rent Per Day:{' '}
          <span className="text-white-50">
            {' '}
            {toEther(props.rentPerDay)} ETH{' '}
          </span>
        </p>
        <p className="lh-base fs-5">
          <span className="fw-bold">Description</span>
          <br /> <br />
          <span className="text-white-50">{props.description}</span>
        </p>
      </div>
      {/* <Card.Group>
        <Card>
          <Card.Content>
            <Card.Header>{props.owner}</Card.Header>
            <Card.Meta>Address of the Owner</Card.Meta>
            <Card.Description>
              This person is the owner and the lessor(rentee) of the vehicle.
            </Card.Description>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>
              {props.person == '0x0000000000000000000000000000000000000000'
                ? 'No leaser Yet'
                : props.person}
            </Card.Header>
            <Card.Meta>Address of the Leaser</Card.Meta>
            <Card.Description>
              This person is the Leaser of the vehile
            </Card.Description>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>Security Amount</Card.Header>
            <Card.Meta>
              You must pay atleast this much Eth to rent the vehicle
            </Card.Meta>
            <Card.Description>
              Minimum Security to pay(Eth): {props.security}
            </Card.Description>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>Availability</Card.Header>
            <Card.Meta style={{ color: 'blue' }}>
              {props.availability == 1
                ? 'Available'
                : props.availability == -1
                ? 'In Maintenance'
                : `Rented Out ${hasRented ? ' By you' : 'To someone else'}`}
            </Card.Meta>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>Details</Card.Header>
            <Card.Meta>
              Given below is a complete details of the vehicle
            </Card.Meta>
            <Card.Description>{props.description}</Card.Description>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>Popularity</Card.Header>
            <Card.Meta>
              Number of times the vehicle has been rented: {props.popularity}
            </Card.Meta>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>Rent per Day</Card.Header>
            <Card.Description>{props.rentPerDay} ETH</Card.Description>
          </Card.Content>
        </Card>
      </Card.Group> */}

      {/* <input type="text" pattern="[0-9]*"
        onInput={this.handleChange.bind(this)} value={this.state.total} /> */}
    </React.Fragment>
  );
}

export default VehicleItem;
