import React, { useState, useEffect } from 'react';
import axios from '../Api';
import * as styles from '../css/Home.module.css';
import { Link } from 'react-router-dom'
import { getJwt } from '../../helpers/jwt';
import Header from '../Header/Header';
import SideBar from '../SideBar/SideBar';
import Feed from '../Feed/Feed';
import TopicFollowButtonLoaded from '../Topic/TopicFollowButtonLoaded';
import i18n from "../../helpers/i18n";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { renderToStaticMarkup } from 'react-dom/server';
import 'leaflet/dist/leaflet.css';
import './leaflet-icon-override.css';
import L from 'leaflet';
import { divIcon } from 'leaflet';
import TopicWordCloud from './TopicWordCloud';

const [ imgHeight, imgWidth ] = [40, 40];
const CLOSE_USERS_HEIGHT = 300;

interface ImgIconProps {
  imgUrl: string;
  position: any;
  profileName: string;
}

const ImgIcon = (props: ImgIconProps) => {

  const iconMarkup = renderToStaticMarkup(<MiniProfileImg src={props.imgUrl}></MiniProfileImg>);
  const ImgIcon = divIcon({
    html: iconMarkup,
    iconSize: [imgHeight, imgWidth],
    popupAnchor: [-10, -30],
  });

 return (
  <Marker position={props.position} icon={ImgIcon}>
    <Popup>
      {props.profileName}
    </Popup>
  </Marker>
 )
}

const CloseUsersLeaflet = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [closeUserList, setCloseUserList] = useState<any>([]);
  const [message, setMessage] = useState("");


  const jwt = getJwt();
  let options = {};
  if (!jwt) {
    options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
  } else {
    options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
  }
  useEffect(() => {

    const data = { user_info_id: props.userInfo.id, date: props.date, num_of_users: 7 };
    axios.post("/mlmodels/close_users", data, options)
    .then(res => {

      if (res.data.length < 2) {
        setCloseUserList([]);
        setLoading(false);
      } else {
        setCloseUserList(res.data);
        setLoading(false);
      }
    })
    .catch(err => { setLoading(true); });

  }, [loading, props.date])


  if (loading) return (
      <MapContainer center={[0, 0]} zoom={13} scrollWheelZoom={true} zoomControl={false} style={{ height: CLOSE_USERS_HEIGHT, backgroundColor: "rgb(242, 242, 242)" }} attributionControl={false}>
        <ImgIcon position={[0, 0]} imgUrl={props.userInfo.profile_img_url} profileName={props.userInfo.first_name + " " + props.userInfo.last_name} />
      </MapContainer>
  );

  return (
    <div>
      <MapContainer center={[0, 0]} zoom={13} scrollWheelZoom={true} zoomControl={false} style={{ height: CLOSE_USERS_HEIGHT, backgroundColor: "rgb(242, 242, 242)" }} attributionControl={false}>
        <ImgIcon position={[0, 0]} imgUrl={props.userInfo.profile_img_url} profileName={props.userInfo.first_name + " " + props.userInfo.last_name}/>
        {closeUserList.map((each: any, idx: number) => {
          const radian = (Math.PI*idx)/3;
          const sin = Math.sin(radian);
          const cos = Math.cos(radian);
          const r = (1/100);
          const x = (r*cos);
          const y = (r*sin);
          return (
            <ImgIcon position={[x, y]} imgUrl={each.profile_img_url} profileName={each.profile_name}/>
          )
        })}
      </MapContainer>
      {closeUserList.length < 2 ? "No Close Friends" : ""}
    </div>

  )
}

const CloseUsers = (props: any) => {
  const today = new Date().toISOString().slice(0, 7); // 'YYYY-XX'
  const [date, setDate] = useState<string>(today);

  useEffect(() => {}, [date])

  const changeDate = (newDate: string) => {
    setDate(newDate);
  };

  return (
    <MainDiv>
      <ButtonDiv>
        <BeforeButton onClick={() => {
          let d = new Date(date)
          d.setMonth(d.getMonth() - 1, 1);
          let dateString = d.toISOString().slice(0, 7)
          changeDate(dateString);
          }}>
          Before
        </BeforeButton>
        {date}
        <NextButton onClick={() => {
          let d = new Date(date)
          d.setMonth(d.getMonth() + 1, 1);
          let dateString = d.toISOString().slice(0, 7)
          changeDate(dateString);
          }}>
          Next
        </NextButton>
      </ButtonDiv>
      <CloseUsersLeaflet userInfo={props.userInfo} date={date}/>
      <TopicWordCloud userInfo={props.userInfo} date={date}></TopicWordCloud>
    </MainDiv>
  )
}

const ButtonDiv = styled.div`
justify-content: space-evenly;
display: flex;
`


const NextButton = styled.button`

`

const BeforeButton = styled.button`

`

const MainDiv = styled.div`
margin: 10px 0 0 0;
`

const MiniProfileImg = styled.img`
height: ${imgHeight}px;
width: ${imgWidth}px;
border-radius: 50%;
`


export default CloseUsers;