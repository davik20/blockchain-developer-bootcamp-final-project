import NewForm from '../components/VehicleList/NewForm';
import { useHistory } from 'react-router-dom';
import useTransactionChecker from '../customHooks/useTransactionChecker';
import { toast } from 'react-toastify';
function Form({web3, rentContract, account}) {
  const history = useHistory();
  const [addTransaction] = useTransactionChecker()

  const toWei = (amount)=> {
    
    return web3.utils.toWei(amount.toString(), 'Ether')
  }

  async function createRent({name, description, security, rentPerDay}) {
     try {
     const tx =   rentContract.methods.createRent(name, description, toWei(security), toWei(rentPerDay)).send({from: account}, async(err, txHash)=> {
      toast(`Transaction in progress Please wait https://ropsten.etherscan.io/tx/${txHash}`)
        
        alert(`Transaction in progress, Please Wait https://ropsten.etherscan.io/tx/${txHash}`)
    });

     
    //  await  addTransaction(tx, "/my-cars", "Rent Created Successfully")
     
     } catch (error) {
       console.log(error)
       alert("You are not allowed to create Rentals")
     } 
  }

  return (
    <NewForm createRent={createRent} />
  )
}

export default Form;