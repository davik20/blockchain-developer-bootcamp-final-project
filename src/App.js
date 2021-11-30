import { use } from 'chai';
import React, { useEffect, useState } from 'react';
import Main from './Main';
import getWeb3 from './functions/getWeb3';
import Rent from './build/contracts/Rent.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useTransactionChecker from './customHooks/useTransactionChecker';
import { useHistory } from 'react-router-dom';

function App() {
  const [ update, updateState] = React.useState();
  const history = useHistory()
  const [web3, setWeb3] = useState(null);
  const [rentContract, setRentContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(false);
  const [addTransaction] = useTransactionChecker();
  const [chainId, setChainId] = useState(null)


  const forceUpdate = ()=> {
   const res =  Math.random() * 40000000
   console.log('updating')
   updateState(res)
  }
  useEffect(()=> {
    if(window.ethereum){
      window.ethereum.request({ method: 'eth_chainId' }).then(chainId => {
        if(chainId === "0x3" || chainId === "0x539"){
          setChainId(chainId)
        }else {
          setChainId(undefined)
        }
    
      })


    window.ethereum.on('chainChanged', (chainId) => {
      console.log(chainId)
      if(chainId === "0x3" || chainId === "0x539"){
        setChainId(chainId)
      }else {
        setChainId(undefined)
      }
      
    });

    window.ethereum.on('accountsChanged', (accounts) => {
      window.location = "/blockchain-developer-bootcamp-final-project/"
    });
    }
   
      
   

   
   }, [])

  useEffect(() => {
    const init = async () => {
 
      try {
        const web3 = await getWeb3();
        setWeb3(web3);
        if (!web3) {
          throw web3;
        }
        if (window.ethereum) {
          await window.ethereum.enable();
        }

        const id = await web3.eth.net.getId();
      
        console.log(Rent.networks[id]);
        let address;
        const devAddress = Rent.networks[id].address;
       address = chainId === "0x3" ? "0xDfa17507e5a1547227a9f7D3658ab2b029554c4f" : devAddress
        
       console.log(devAddress)
        const rent = new web3.eth.Contract(Rent.abi,address);
        setRentContract(rent);

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.log(error);
        setError(
          'Please use a metamask enabled browser and connect with the ropsten testnet'
        );
      }
    };
    if(window.ethereum){
      init();
    }else {
      setError(
        'Please use a metamask enabled browser and connect with the ropsten testnet'
      );
    }
  
  }, [chainId]);
  return (
    <div>
      {rentContract && web3 && account && (
        <React.Fragment>
          <ToastContainer />
          {web3 && chainId  && account ? (
            <Main web3={web3} account={account} rentContract={rentContract} forceUpdate={forceUpdate} />
          ) : (
            <div
              style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: '1.2rem',
                // color: "rgba(0,0,0, .5)",
              }}
            >
              {' '}
              {
                'Please use this Dapp in a Metamask enabled Chrome Desktop Browser'
              }{' '}
            </div>
          )}
        </React.Fragment>
      )}

      {error && (
        <div
          style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: '1.2rem',
            // color: "rgba(0,0,0, .5)",
          }}
        >
          {' '}
         
        </div>
      )}
    </div>
  );
}

export default App;
