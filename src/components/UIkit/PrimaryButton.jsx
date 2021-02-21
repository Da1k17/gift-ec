import React from 'react';
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles({
  "button": {
    backgroundColor: "#00E6D6",
    color: "#000",
    fontSize: "16px",
    height: 48,
    marginBottom: 16,
    width: 256
  }
})

const PrimaryButton = (props) => {
  const classes = useStyles();

  return (
    <Button className={classes.button} variant="contained" onClick={() => props.onClick()} >
      {props.label}
    </Button>
  )
}

export default PrimaryButton

