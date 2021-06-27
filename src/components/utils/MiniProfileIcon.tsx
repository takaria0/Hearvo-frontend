import React, { useState, useEffect } from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';
import i18n from "../../helpers/i18n";
import styled from 'styled-components';

interface MiniProfileIconProps {
  imgUrl: string;
}

const MiniProfileIcon = (props: MiniProfileIconProps) => {
  return (
    <MiniIconImg src={props.imgUrl} alt="firebase-image" />
  )
}

const MiniIconImg = styled.img`
border-radius: 50%;
width: 30px;
height: 30px;
transform: translateY(8px);
`



export default MiniProfileIcon;