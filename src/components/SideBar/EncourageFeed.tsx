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



interface EncourageFeedProps {
}

const EncourageFeed = (props: EncourageFeedProps) => {
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    axios.get(`/users?left_votes_for_close_users=true`, options)
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

  if(data.complete) {
    return (
    <MainDiv>
      <InnerMainDiv>
        Cast 10 votes to check your close users! Left votes: 0, COMPLETE!
      </InnerMainDiv>
    </MainDiv>
    )
  }

  return (
    <MainDiv>
      <InnerMainDiv>
        Cast 10 votes to check your close users! Left votes: {data.left_votes}
      </InnerMainDiv>
    </MainDiv>
  )
}


const MainDiv = styled.div`
margin-top: 10px;
margin-bottom: -10px;
border-radius: 10px;
background-color: #fff;
border: solid 0px black;
`;

const InnerMainDiv = styled.div`
padding: 5px 10px 5px 10px;
`;


export default EncourageFeed;