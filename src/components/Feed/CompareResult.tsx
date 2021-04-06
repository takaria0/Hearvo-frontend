import React, { useEffect, useState, useRef } from 'react';
import { Button, Dialog, Checkbox, FormControlLabel } from '@material-ui/core';
import { useHistory } from "react-router";
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';
import { MyResponsivePie, MyResponsiveBar } from '../../helpers/NivoPlots';
import i18n from "../../helpers/i18n";
import { createMuiTheme } from '@material-ui/core/styles'
import {MuiThemeProvider} from '@material-ui/core/styles'

import CloseIcon from '@material-ui/icons/Close';

import * as styles from "../../css/CompareResult.module.css"

const CompareResult = (props: any) => {
  let initialSelectOption: any;
  if (Array.isArray(props.data)) {
    initialSelectOption = props.data.map((elem: any) => { return { title: elem.title, value: elem.id, type: "post_id" } });
  } else {
    initialSelectOption = [{ title: props.data.title, value: props.data.id, type: "post_id" }];
  }

  initialSelectOption.push({ title: i18n.t("compare.gender"), value: "gender", type: "gender" });
  initialSelectOption.push({ title: i18n.t("compare.age"), value: "age", type: "age" });

  const jwt = getJwt();
  const [compareData, setCompareData] = useState<any>([]);
  const [selectOption, setSelectOption] = useState<any>(initialSelectOption);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [rawPostObj, setRawPostObj] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [firstTitle, setFirstTitle] = useState("");
  const [secondTitle, setSecondTitle] = useState("");

  useEffect(() => {

  }, []);

  const change = (e: any, elem: any) => {

    switch (e.target.checked) {

      case true:
        if (rawPostObj.length > 1) {
          setErrorMessage(i18n.t("compare.selectTwo"))
          return
        }
        setRawPostObj([...rawPostObj, { title: elem.title, value: elem.value, type: elem.type }])
        break;

      case false:
        if (rawPostObj.length > 1) {
          setErrorMessage("")
        }
        const deleteRawPostObj = rawPostObj.filter((raw: any) => (raw.value !== elem.value));
        setRawPostObj(deleteRawPostObj);
        break;

    }
  }

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#3477cc',
        light: '#70a5ff',
        dark: '#004c9a',
        contrastText: '#ffffff'
      }
    }
  })

  const submit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setRawPostObj([]);
    setCompareData([]);
    if (rawPostObj.length !== 2) {
      setErrorMessage(i18n.t("compare.selectTwo"));
      return
    }



    const first_target = {
      type: rawPostObj[0].type, data: rawPostObj[0].value
    }
    const second_target = {
      type: rawPostObj[1].type, data: rawPostObj[1].value
    }

    const postObj = { parent_id: initialSelectOption[0].value, first_target, second_target };
    
    setFirstTitle(rawPostObj[0].title);
    setSecondTitle(rawPostObj[1].title);
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }

    axios.post(`/vote_selects/compare`, postObj, options)
      .then(res => {
        setCompareData(res.data);
        setIsLoading(false);
        setOpenDialog(false);
      })
      .catch(err => {
        setOpenDialog(true);
      })
  }

  const closeDialog = () => {
    setOpenDialog(false);
    setRawPostObj([]);
    // setCompareData([]);
    setErrorMessage("");
  }

  const optionDialog = () => {
    return (
      <Dialog open={openDialog}>
        <div style={{ margin: 30 }}>
          <button className={styles.close_button}onClick={e => closeDialog()}><CloseIcon /></button>
          <div style={{ padding: 10 }}>{i18n.t("compare.description")}</div>
          {selectOption.map((elem: any) => {
            return (
              <div>
                {/* <input type="checkbox" id="scales" name="scales" onChange={e => change(e, elem)} ></input><label htmlFor={elem.title}>{elem.title}</label> */}
                <MuiThemeProvider theme={theme}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        // checked={state.checkedB}
                        className={styles.compare_checkbox}
                        disableRipple
                        onChange={e => change(e, elem)}
                        name="check"
                        color='primary'
                      />
                    }
                    label={elem.title}
                  />
                </MuiThemeProvider>
              </div>
            )
          })}
          <div style={{ marginTop: 20 }}>{errorMessage ? "" : 
          // <button onClick={e => submit(e)}>{i18n.t("compare.compare")}</button>
          <Button disableRipple disableElevation className={styles.compare_button} variant="contained" onClick={e => submit(e)}>
          {i18n.t("compare.compare")}
          </Button>
          }</div>
          <div style={{ padding: 10, color: 'red' }}>{errorMessage ? errorMessage : ''}</div>
        </div>
      </Dialog>
    )
  }

  const barPlot = () => {

    const mediaQueryMin900 = window.matchMedia('(min-width: 900px)')
    const margin = mediaQueryMin900.matches ? 
    { top: 50, right: 200, bottom: 50, left: 160 } : { top: 50, right: 150, bottom: 50, left: 100 } ;
    const keysVer1 = Object.keys(compareData.result[0]).map((key: string) => (key)).slice(1);

    return (
      <div>
        <div>
          {firstTitle ? 
          <div>
            {firstTitle} vs {secondTitle}
          </div> 
          : ""}
        </div>
        <div style={{ height: 350 }}>
          <MyResponsiveBar data={JSON.parse(JSON.stringify(compareData.result))} keys={JSON.parse(JSON.stringify(keysVer1))} margin={margin}></MyResponsiveBar>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* <button style={{ border: 'solid', borderRadius: 20, borderWidth: 1, marginTop: 20, marginBottom: 10, color: 'white', backgroundColor: '#01B1F8', padding: 10, paddingRight: 20, paddingLeft: 20 }} onClick={e => setOpenDialog(true)}>{i18n.t("compare.compare")}</button> */}
      <div style={{marginBottom: 10, textAlign: 'right', marginRight: 20}}>
        <Button disableRipple disableElevation className={styles.compare_button} variant="contained" onClick={e => setOpenDialog(true)}>
          {i18n.t("compare.compare")}
        </Button>
      </div>
      {optionDialog()}
      {isLoading ? "" : barPlot()}
    </div>)
}

export default CompareResult;