import React, {useState,useEffect} from 'react';
import { useWeb3React } from "@web3-react/core"
import injectSheet from 'react-jss';
import { injected } from "./Connectors"

const styles ={
  clickable:{
      backgroundColor: "#3191FF",
      '&:hover': {
        backgroundColor: '#40a9ff'
        }
  },
  logged:{
    backgroundColor: "#4982c4"
  }
}

function ConnectMetamask(props) {
    const { active, account, library, connector, activate, deactivate } = useWeb3React()
    const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React()
    const [loaded, setLoaded] = useState(false)


    async function restoureConnection(){

        injected.isAuthorized().then((isAuthorized) => {setLoaded(true)
            if (isAuthorized && !networkActive && !networkError) {
              activateNetwork(injected)
            }});
    }
    async function connect() {
        try {
            
          await activate(injected)
        } catch (ex) {
          console.log(ex)
        }
      }
    
      async function disconnect() {
        try {
            deactivate();
            injected.deactivate()
        } catch (ex) {
          console.log(ex)
        }
      }

      restoureConnection();
      useEffect(() =>{

        if(props.setWallet !== undefined){
          props.setWallet(account)
        }
        
      });
  
  return  active ? <button className={["metamask",props.classes.logged].join(' ')}>{account}</button> : <button onClick={connect} className={["metamask",props.classes.clickable].join(' ')} >Connect to MetaMask</button>
  
}

export default injectSheet(styles)(ConnectMetamask);
