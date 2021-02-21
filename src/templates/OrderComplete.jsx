import React from 'react';
import {useDispatch} from "react-redux";
import {push} from "connected-react-router";
import {PrimaryButton} from "../components/UIkit/index";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    fontSize: "1.563rem",
    textAlign: "center"
  }
})

const OrderComplete = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <section className="c-section-wrapin">
      <h2 className={classes.root}>お買い上げありがとうございました</h2>
      <div className="module-spacer--medium"/>
      <PrimaryButton label={"ホームに戻る"} onClick={() => dispatch(push("/"))} />
    </section>
  )
}

export default OrderComplete
