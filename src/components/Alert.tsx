import React, { useContext, useEffect, useState } from 'react';

import CountryContext from '../helpers/context';
import i18n from "../helpers/i18n";

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { LocalConvenienceStoreTwoTone } from '@material-ui/icons';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));


export default function CustomizedSnackbars() {
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const judgeCountry = useContext(CountryContext);
    const [isClosed, setIsClosed] = useState<any>();

    // const setIsClosed = () => {
    //     localStorage.setItem("isClosed", JSON.stringify(true));
    // }

    useEffect(() => {
        setIsClosed(localStorage.getItem("isClosed"));
    })

    const handleClose = () => {
        localStorage.setItem("isClosed", JSON.stringify(true));
        setOpen(false);
    };

    if (judgeCountry.country === process.env.REACT_APP_COUNTRY) {
        return (
            <div className={classes.root}>
                <Snackbar open={!isClosed} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="warning">
                        {i18n.t("alert.outside")}
                    </Alert>
                </Snackbar>
            </div>
        );
    } else {
        return (
            <div></div>
        )
    }
}