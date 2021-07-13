
import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3  from "web3";
import {mnemonic} from '../secrets.json'

// import detectEthereumProvider from '@metamask/detect-provider';



function getWeb3(){
      
      return new Promise(async(resolve, reject)=> {
      
        try {
            if(true){
                const provider = new  HDWalletProvider(
                    mnemonic,
                    'https://ropsten.infura.io/v3/3ee5b26be9d9451b96c018232c629555'
            )
                const web3 = new Web3(window.ethereum);
                
                 resolve(web3)
             }else {
                 reject('Please use a metamask enabled browser')
             }
        } catch (error) {
            console.log(error)
            reject("Please use a metamask enabled browser")
            alert('Please use a metamask enabled browser')
        }
          
      })


    


}

export default getWeb3