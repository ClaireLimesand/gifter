import React, { useEffect } from 'react';
import { useHistory } from "react-router";
import LogOutButton from '../LogOutButton/LogOutButton';
import {useDispatch, useSelector} from 'react-redux';
import useReduxStore from '../../hooks/useReduxStore';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Card } from '@mui/material';
import { CardHeader } from '@mui/material';
import { CardContent } from '@mui/material';
import { Divider } from '@mui/material';
import MuiButton from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import { spacing } from "@material-ui/system";
import BottomNav from '../BottomNav/BottomNav';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

import './UserPage.css';

function UserPage() {

  const Button = styled(MuiButton)(spacing);
  const history = useHistory();
  const dispatch = useDispatch();
  const store = useReduxStore();

  const user = useSelector((store) => store.user);
  const friendsReducer = useSelector((store) => store.friendsReducer);

  useEffect(() => {
    dispatch({ type: 'FETCH_FRIENDS' });
  }, []);

  const goToFriend = (friend) => {
    console.log(friend.id)
    history.push(`/friendpage/${friend.id}`);
} 

  return (
    <div className="container">
    <Box sx={{ fontSize: 18, textAlign: 'center' }}>

      <h2 className="introduction">Welcome, {user.username}!</h2>
      
      <Grid container 
            spacing={2}
            direction="column"
            justifyContent="center"
            alignItems="stretch"
      >

      {
      store.friendsReducer.map((friend, i) => (
        <Grid 
          key={i} 
          item xs={6}
          justify="center"
          alignItems="center"
          align="center"
        >
          <Card variant="outlined" text-align="center" onClick={()=>{goToFriend(friend)}}>
            <CardContent className={"MuiCardContent-root"}>
              <Grid container 
                justify="center"
                alignItems="center"
      
              >
                <label>
                  {friend.name}
                </label>
                < NavigateNextRoundedIcon />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
          ))
        }
      </Grid>

      <Box textAlign="center"> 
        <LogOutButton className="btn" />
      </Box>

      <BottomNav />

    </Box>
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
