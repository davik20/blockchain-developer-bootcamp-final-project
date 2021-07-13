import React, {useEffect, useState} from 'react'
import { Card, Button } from 'semantic-ui-react'
import {useHistory} from 'react-router-dom';
import useTransactionChecker from '../../customHooks/useTransactionChecker';
import { toast } from 'react-toastify';
function VehicleItem(props) {
  const {rentContract, account, web3} = props
  const [hasRented, setHasRented] = useState(false)
  const [isRenting, setIsRenting] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const history = useHistory()
 
  const[addTransaction]  = useTransactionChecker(web3)
  
  useEffect(()=> {
     const init = async()=> {
      const {rentContract, account, owner,security, rentPerDay} = props
        const rented= await rentContract.methods.rented(account).call()
        const isRenting = await rentContract.methods.isRenting(account).call()

        if(isRenting == true){
          setIsRenting(true)
        }

        if(rented == props.rentId){
          setHasRented(true)
        }

        if(owner == account){
          setIsOwner(true)
        }
     
     }

     init()

  }, [])

  const unlistVehicle = async(rentId)=> {
    const {rentContract, account} = props
    
    try {
      const transactionHash = rentContract.methods.deleteRent(rentId).send({from: account}, async(err, txHash)=> {
        toast(`Transaction in progress Please Wait https://ropsten.etherscan.io/tx/${txHash}`)
          
          alert(`Transaction in progress https://ropsten.etherscan.io/tx/${txHash}`)
      });

      // await addTransaction(transactionHash, "/my-cars", "Rent Deleted Successfully")
    
    } catch (error) {
        // alert(error.message)
        console.log(error)
        alert('transaction failed');
    }
  }

  const toWei = (amount)=> {
    console.log(web3.utils.toWei(amount, 'Ether'))
    return web3.utils.toWei(amount, 'Ether')
  }
  const rentVehicle = async(rentId)=> {
    const {rentContract, account, owner,security, rentPerDay} = props
    console.log(owner)
    if(isOwner){
      alert("You are the owner of this Car, You cannot rent it")
      return
    }
     if(isRenting == true){
      alert('You are already renting a car, please return')
      return;
    }
     if(hasRented == true){
      alert('You already rented this car')
    }
    if(props.availability == 0){
      alert('This car has been rented out already')
      return;
    }

    if(props.availability == -1){
      alert ('This car is in Maintenance');
      return;
    }
    
      try {
    let value = parseInt(security) + parseInt(rentPerDay)
    
    
    console.log(value)
    alert(`You are about to pay ${value.toFixed(4)}Eth to rent this car`)
    const transactionHash  =  await rentContract.methods.takeRent(rentId, 1 ).send({from: account, value: toWei(value.toString()) }, async(err, txHash)=> {
      toast(`Transaction in progress Please Wait https://ropsten.etherscan.io/tx/${txHash}`)
        
        alert(`Transaction in progress https://ropsten.etherscan.io/tx/${txHash}`)
    });

    //  await addTransaction(transactionHash , "/", "Vehicle has been rented Successfully")
   

   
      } catch (error) {
        console.log(error)
        alert('transaction failed');
        
      }

  }

  const returnVehicle =async(rentId)=> {
    const {rentContract, account, owner,security, rentPerDay} = props
    try {
      const transactionHash =  await rentContract.methods.returnRent(rentId).send({from: account}, async(err, txHash)=> {
        toast(`Transaction in progress Please Wait https://ropsten.etherscan.io/tx/${txHash}`)
          
          alert(`Transaction in progress https://ropsten.etherscan.io/tx/${txHash}`)
      });

      // await addTransaction(transactionHash, "/", 'Vehicle returned successfully')
    } catch (error) {
      console.log(error)
      alert('transaction failed');
    }


  }

  const takeToMaintain = async (rentId) => {
    const {rentContract, account, owner,security, rentPerDay} = props
    try {
        await rentContract.methods.takeToMaintenance(rentId).send({from: account}, async(err, txHash)=> {
          toast(`Transaction in progress Please Wait https://ropsten.etherscan.io/tx/${txHash}`)
          
          alert(`Transaction in progress https://ropsten.etherscan.io/tx/${txHash}`)

          //  await addTransaction(txHash, "/my-cars", 'vehicle taken for Maintenance')
        });
      
      
    } catch (error) {
      console.log(error)
      alert('transaction failed');
    }
  }
  const removeFromMaintain = async (rentId) => {
    const {rentContract, account, owner,security, rentPerDay} = props
    try {
       rentContract.methods.removeFromMaintenance(rentId).send({from: account}, async(err, txHash)=> {
        toast(`Transaction in progress Please Wait https://ropsten.etherscan.io/tx/${txHash}`)
          
          alert(`Transaction in progress https://ropsten.etherscan.io/tx/${txHash}`)
      });

      
      // await addTransaction(transactionHash, '/my-cars', 'vehicle removed from Maintenance')

    } catch (error) {
      console.log(error)
      alert('transaction failed');
    }
  }

  return (
    <React.Fragment>
      <h2>{props.name}</h2>
      <Card.Group>
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
            <Card.Header>{props.person == "0x0000000000000000000000000000000000000000" ? "No leaser Yet" : props.person}</Card.Header>
            <Card.Meta>Address of the Leaser</Card.Meta>
            <Card.Description>
              This person is the Leaser of the vehile
            </Card.Description>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>Security Amount</Card.Header>
            <Card.Meta>You must pay atleast this much Eth to rent the vehicle</Card.Meta>
            <Card.Description>
              Minimum Security to pay(Eth): {props.security}
            </Card.Description>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>Availability</Card.Header>
            <Card.Meta style={{color: 'blue'}}>{props.availability == 1 ? 'Available' : props.availability == -1 ? 'In Maintenance': `Rented Out ${hasRented ? ' By you' : "To someone else"}`}</Card.Meta>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>Details</Card.Header>
            <Card.Meta>Given below is a complete details of the vehicle</Card.Meta>
            <Card.Description>
              {props.description}
            </Card.Description>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>Popularity</Card.Header>
            <Card.Meta>Number of times the vehicle has been rented: {props.popularity}</Card.Meta>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>Rent per Day</Card.Header>
            <Card.Description>
              {props.rentPerDay} ETH
            </Card.Description>
          </Card.Content>
        </Card>
      </Card.Group>
    {isOwner && <><Button onClick={()=> history.push(`/rent/${props.rentId}/edit`)} basic color='teal' content='Edit Details' />
    {props.availability == 1 && isOwner && <Button onClick={()=> takeToMaintain(props.rentId)} color='blue'>Take to Maintenance</Button>}
    {props.availability == -1 && isOwner && <Button onClick={()=> removeFromMaintain(props.rentId)} color='blue'>Remove From Maintenance</Button>}
    <Button onClick={()=>unlistVehicle(props.rentId)} basic color='red' content='Unlist Vehicle' />
    </>}
      {!hasRented && !isOwner && <Button onClick={()=>rentVehicle(props.rentId)} basic color='purple' content='Rent Vehicle' />}
      {hasRented && <Button onClick={()=>returnVehicle(props.rentId)} basic color='purple' content='Return Vehicle' />}
      {/* <input type="text" pattern="[0-9]*"
        onInput={this.handleChange.bind(this)} value={this.state.total} /> */}
    </React.Fragment>
  );
}

export default VehicleItem;