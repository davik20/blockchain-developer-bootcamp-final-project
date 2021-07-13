import React, {useEffect, useState} from 'react'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import getWeb3 from '../functions/getWeb3';

function useTransactionChecker(web3) {

    const [transactionBlock, setTransactionBlock] = useState({
        set: false,
        block: '',
        redirect: '',
        alert: ''
    })
    const [status, setStatus]  = useState(null)
    // const [web3, setWeb3] = useState(null)
    useEffect(() => {
        // check for transaction completion
        // const init = async()=> {

        //     try {
        //         const web3 = await getWeb3()
        //     setWeb3(web3)
        //     } catch (error) {
        //         console.log(error)
        //     }
            
        // }

        // init()
       
        // update transaction status
        return () => {
        
        }
    }, [])

    useEffect(() => {
      if(transactionBlock.set == true){
         if(transactionBlock.block == null){
             toast ("An Error Occured")
         }
         if(transactionBlock){
             toast(transactionBlock.alert)
         }
        
         setTimeout(()=> {
            window.location = transactionBlock.redirect
         }, 2000)
         setTransactionBlock((prevTransactionBlock)=> ({
             ...prevTransactionBlock,
             set: false
         }))
        }
        
    }, [transactionBlock])

  
    const addTransaction = async(tH , redirect, alert) => {
                let runInterval = true
                let isMyTxPending;
                toast.warning(`Transaction added,Please Wait for mining`)

            //     const pendingTransactions = await web3.eth.getPendingTransactions()
            //     console.log(pendingTransactions)

            //   const interval =  setInterval(()=> {
            //     console.log('checking')
            //     if(runInterval == true){
            //          isMyTxPending = pendingTransactions.filter((tx) => {
            //             if(tx === tH) {
            //             return true;
            //           } else {
            //             return false;
            //           }})

            //           if(isMyTxPending == false){
            //               runInterval = false;
            //               clearInterval(interval)
            //               console.log('succeeded')
            //           }
            //     }
              
            //     }, 1000)

                
                //  console.log(tx)
                //  const tR   =  web3.eth.getTransactionReceipt(tx).then((result)=> console.log(result));
                 
            // Get transaction details
    
        // console.log(tR)
        // setTransactionBlock({
        //     set: true,
        //     // block: reciept.blockNumber,
        //     redirect,
        //     alert
        // })


       
    }

    return [addTransaction]
}

export default useTransactionChecker
