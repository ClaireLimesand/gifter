import React, { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from "react-router";
import LogOutButton from '../LogOutButton/LogOutButton';
import {useDispatch, useSelector} from 'react-redux';
import useReduxStore from '../../hooks/useReduxStore';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import Stack from '@mui/material/Stack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { Link } from 'react-router-dom';
import BottomNav from '../BottomNav/BottomNav';
import MuiButton from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import { spacing } from "@material-ui/system";

function EditPage() {

    const Button = styled(MuiButton)(spacing);
    const history = useHistory();
    const dispatch = useDispatch();
    const params = useParams();

    console.log('params', params)

    const editEventReducer = useSelector(store => store.editEventReducer)

    useEffect(() => {
        dispatch({
            type: 'FETCH_EVENT',
            payload: params.event_id
        })
    }, [params.id]);

    console.log('params', params)

    const handleNameChange = (event) => {
        dispatch({
            type: 'EDIT_EVENT_NAME',
            payload: event.target.value
        })
    };
    
    const handleDateChange = (newValue) => {
        let eventDate = newValue
        console.log('*****', newValue)
        dispatch({
            type: 'EDIT_EVENT_DATE',
            payload: newValue
        })
    };

    const handleSaveButton = (event) => {
        event.preventDefault()
        dispatch({
            type: 'EDIT_EVENT',
            payload: {
                id: params.event_id,
                name: editEventReducer.name,
                date: editEventReducer.date
            }
        })
        dispatch({
            type: 'FETCH_FRIEND_DETAILS',
            payload: params.friend_id
        })
        Swal.fire({
            text: "This event has been edited",
            icon: "success",
        });
        history.push(`/friendpage/${params.friend_id}`)
    };

    const handleDeleteEvent = (id) => {
        dispatch({
            type: 'DELETE_EVENT',
            payload: id
        })
        dispatch({
            type: 'FETCH_FRIEND_DETAILS',
            payload: params.friend_id
        })
        Swal.fire({
            text: "This event has been deleted",
            icon: "success",
        });
        history.push(`/friendpage/${params.friend_id}`);
    }

    return (
    <div className="container">
        <h3>Edit this event:</h3>
            
            <TextField 
                style = {{width: '100%'}}
                value={editEventReducer.name || ""}
                onChange={handleNameChange}
                label="Event Name"
            >
                {editEventReducer.name}
            </TextField>
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={2}>
                <MobileDatePicker
                    label="Event date"
                    inputFormat="MM/dd/yyyy"
                    value={editEventReducer.date || null}
                    onChange={(newValue) => {handleDateChange(newValue)}}
                    renderInput={(params) => <TextField {...params} />}
                />
                </Stack>
            </LocalizationProvider>

            <Button 
                variant="contained" 
                onClick={handleSaveButton}
            >
            Save
            </Button>
            
            <Button 
                variant="contained" 
                onClick={() => handleDeleteEvent(params.event_id)}
            >
                Delete
            </Button>

        < BottomNav />
    </div>
    );
}

// this allows us to use <App /> in index.js
export default EditPage;