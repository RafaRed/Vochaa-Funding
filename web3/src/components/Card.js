import React from "react";
import "./Card.css";
import injectSheet from 'react-jss';
import { Link } from 'react-router-dom'

const styles ={
    button:{
        '&:hover': {
            backgroundColor: '#40a9ff'
          }
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
        <Link to={props.link}>
        <button type="button" className={classes.button}>{props.button}</button>
        </Link>
      </div>
    </div>
  );
}

export default injectSheet(styles)(Card);
