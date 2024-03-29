import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom'
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';
import i18n from "../../helpers/i18n";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  // TwitterIcon
} from "react-share";
import styled from 'styled-components';



interface InvitePeopleViaTwitterButtonProps {
  text: string;
}

const InvitePeopleViaTwitterButton = (props: InvitePeopleViaTwitterButtonProps) => {
  return (
    <TwitterShareButton title={i18n.t("twitterInvite.text")} url={"https://" + window.location.hostname} >
      <TwitterShareText>
        {props.text}
      </TwitterShareText>
    </TwitterShareButton>
  )
}


interface InvitePeopleViaTwitterButtonDetailProps {
  id: string;
  text: string;
}

const InvitePeopleViaTwitterButtonDetail = (props: InvitePeopleViaTwitterButtonDetailProps) => {
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    axios.get(`/posts?id=${props.id}`, options)
    .then(res => {
      setData(res.data);
      setIsLoading(false);
    })
    .catch(err => {
      setData({});
      setIsLoading(false);
    });
  }, [])

  if (isLoading) return (<span></span>);

  return (
    <TwitterShareButton title={i18n.t("twitterInvite.detailText") + " | Hearvo | " + data.title } url={"https://" + window.location.hostname + "/posts/" + props.id} >
      <TwitterShareText>
        {props.text}
      </TwitterShareText>
    </TwitterShareButton>
  )
}


const TwitterShareText = styled.button`
  outline: none;
  // text-transform: none;
  // transition: none;
  cursor: pointer;
  border: none;
  color: white;
  border-radius: 100px;
  background-color: #3477cc;
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
  padding-right: 20px;
  padding-left: 20px;
  padding-top: 7px;
  padding-bottom: 7px;
`;



export { InvitePeopleViaTwitterButton, InvitePeopleViaTwitterButtonDetail }