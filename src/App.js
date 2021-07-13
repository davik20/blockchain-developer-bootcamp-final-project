import { use } from 'chai'
import React, {useEffect, useState} from 'react'
import Main from './Main'
import getWeb3 from './functions/getWeb3'
import Rent from './build/contracts/Rent.json'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useTransactionChecker from './customHooks/useTransactionChecker'

function App() {
  const [web3, setWeb3] = useState(null)
  const [rentContract, setRentContract] = useState(null)
  const [account, setAccount] = useState(null)
  const [error, setError] = useState(false);
  const [addTransaction] = useTransactionChecker()

  useEffect(() => {
    
    const init = async()=> {
        
       console.log(window.innerHeight)
        try {
          const web3 = await getWeb3()
          setWeb3(web3)
          if(!web3){
            throw(web3)
          }
          if(window.ethereum){
            await window.ethereum.enable();
          }
         

          const id = await web3.eth.net.getId()
          console.log(Rent.networks[id])
          const ropstenAddress = "0x4684e6478287Dd97B0Aa217911e2601A737a43Ca"
          const devAddress = Rent.networks[id].address;
          const rent = new web3.eth.Contract(Rent.abi, devAddress)
          setRentContract(rent)



          const accounts = await web3.eth.getAccounts()
          setAccount(accounts[0])
        } catch (error) {
          console.log(error)
          setError('Please use a metamask enabled browser and connect with the ropsten testnet  ')
          
        }
       
    }
     
    init()
  }, [])
  return (
    <div>
    {rentContract && web3 && account && 
    <React.Fragment>
      <ToastContainer />
    {window.innerWidth > 500 ?  <Main web3={web3} account={account} rentContract={rentContract}/> : <div style={{height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '1.2rem', color: 'rgba(0,0,0, .5)'}}> {'Please use this Dapp in a Metamask enabled Chrome Desktop Browser'} </div> }
    </React.Fragment>}

    {error && <div style={{height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '1.2rem', color: 'rgba(0,0,0, .5)'}}> {error} </div>}
    </div>
  )
}

export default App
