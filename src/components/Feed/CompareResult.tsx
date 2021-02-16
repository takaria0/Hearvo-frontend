import React, { useEffect, useState, useRef } from 'react';
import { Button, Dialog } from '@material-ui/core';
import { useHistory } from "react-router";
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';
import { MyResponsivePie, MyResponsiveBar } from '../../helpers/NivoPlots';
import i18n from "../../helpers/i18n";

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

  useEffect(() => {

  }, []);


  const change = (e: any, elem: any) => {

    switch (e.target.checked) {

      case true:
        if (rawPostObj.length > 1) {
          setErrorMessage(i18n.t("compare.gender"))
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


    axios.post(`/vote_selects/compare`, postObj, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
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
          <button onClick={e => closeDialog()}>{i18n.t("compare.cancel")}</button>
          <div style={{ padding: 10 }}>{i18n.t("compare.description")}</div>
          {selectOption.map((elem: any) => {
            return (
              <div>
                <input type="checkbox" id="scales" name="scales" onChange={e => change(e, elem)} ></input><label htmlFor={elem.title}>{elem.title}</label>
              </div>
            )
          })}
          <div style={{ marginTop: 20 }}>{errorMessage ? "" : <button onClick={e => submit(e)}>{i18n.t("compare.compare")}</button>}</div>
          <div style={{ padding: 10, color: 'red' }}>{errorMessage ? errorMessage : ''}</div>
        </div>
      </Dialog>
    )
  }

  const barPlot = () => {
    const keysVer1 = Object.keys(compareData.result[0]).map((key: string) => (key)).slice(1);
    return (
      <div>
        <div style={{ height: 350 }}>
          <MyResponsiveBar data={compareData.result} keys={keysVer1}></MyResponsiveBar>
        </div>
      </div>
    )
  }

  return (
    <div>
      <button style={{ marginTop: 20 }} onClick={e => setOpenDialog(true)}>{i18n.t("compare.compare")}</button>
      {optionDialog()}
      {isLoading ? "" : barPlot()}
    </div>)
}

export default CompareResult;