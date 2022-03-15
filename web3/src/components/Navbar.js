import React from 'react';
import './Navbar.css'
import injectSheet from 'react-jss';
import ConnectMetamask from "./ConnectMetamask"

const styles ={
  clickable:{
      textDecoration:"none",
      color:"#fff",
      '&:hover': {
          color: '#3191FF'
        }
  }
}

function Navbar(props) {

  return <div className="topnav">
  <div className='menu'>
  <a className={props.menu === "home" ? "active" : ""} href="/">HOME</a>
  <a className={props.menu === "explore" ? "active" : ""} href="/explore">PROJECTS</a>
  <a className={props.menu === "about" ? "active" : ""} href="https://github.com/RafaRed/Vochaa">ABOUT</a>
  </div>
 
  <ConnectMetamask setWallet={props.setWallet}/>
</div>;
}

export default injectSheet(styles)(Navbar);
