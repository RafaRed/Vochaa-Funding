import React from "react";
import "./Card.css";
import injectSheet from 'react-jss';
import { Link } from 'react-router-dom'

const styles ={
    button:{
        '&:hover': {
            backgroundColor: '#40a9ff'
          }
    },
    disabled:{
      '&:hover': {
          backgroundColor: '#c1c1c1'
        }
  }
}

function DisplayButton({enabledclass,disabledclass,button,checkwhitelisted,whitelisted,link}){

  if(checkwhitelisted === true){
    if(whitelisted){
      return (<Link to={link}>
        <button type="button" className={enabledclass}>{button}</button>
        </Link>)
    }
    else{
      return (<button type="button" className={disabledclass}>{button}</button>)
    }
  }
  else{
    return (<Link to={link}>
        <button type="button" className={enabledclass}>{button}</button>
        </Link>)
  }
}

function Card(props) {
  const classes = props.classes
  return (
    <div className="card">
      <img src={props.img} />
      <div className="info">
        <h1>{props.name}</h1>
        <p className="desc">{props.desc}</p>
        <DisplayButton enabledclass={classes.button} disabledclass={[classes.disabled, "buttonDisabled"].join(' ')} button={props.button} checkwhitelisted={props.checkwhitelisted} whitelisted={props.whitelisted} link={props.link}></DisplayButton>
        
      </div>
    </div>
  );
}

export default injectSheet(styles)(Card);
