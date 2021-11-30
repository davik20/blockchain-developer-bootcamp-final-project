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
      const loading =  toast.loading("Creating vehicle rental in progress")
   await rentContract.methods.createRent(name, description, toWei(security), toWei(rentPerDay)).send({from: account}, async(err, txHash)=> {
     toast.dismiss(loading)
      toast.success(`Rental created successfully`)
        

    });

    setTimeout(()=> {
      window.location = "/my-cars"
    },3000)
     

     
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