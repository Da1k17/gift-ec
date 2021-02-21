import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../reducks/users/operations';
import {getUserId, getUsername} from "../reducks/users/selectors";

const Home = () => {
  const selector = useSelector(state => state);
  const uid = getUserId(selector);
  const username = getUsername(selector);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Home</h2>
      <p>User ID: {uid}</p>
      <p>User Name: {username}</p>
      <button onClick={() => dispatch(signOut())}>Sign Out</button>
    </div>
  )
}

export default Home
