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
import ReactWordcloud from 'react-wordcloud';

// import 'tippy.js/dist/tippy.css';
// import 'tippy.js/animations/scale.css';

// const [ imgHeight, imgWidth ] = [50, 50];

// interface ImgIconProps {
//   imgUrl: string;
//   position: any;
//   profileName: string;
// }
interface Options {
  rotations: number,
  rotationAngles: [number, number];
  fontSizes: [number, number];
  deterministic: boolean;
}

interface Words {
  text: string;
  value: number;
}

const options: Options = {
  rotations: 2,
  rotationAngles: [0, 0],
  fontSizes: [10, 100],
  deterministic: true,
};

const WordCloud = (props: any) => {

  const [words, setWords] = useState<Words[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }
    axios.get(`/topics?wordcloud=${props.date}`, options)
      .then(res => {
        setWords(res.data);
        setLoading(false);
      }).catch(err => {
        setLoading(false);
      })
  }, [loading, props.date]);

// const words = [
//   {
//     text: 'told',
//     value: 164,
//   },
//   {
//     text: 'mistake',
//     value: 11,
//   },
//   {
//     text: 'thought',
//     value: 16,
//   },
//   {
//     text: 'bad',
//     value: 17,
//   },
// ];

// const size: [number, number] = [800, 300];

  if (loading) return <ReactWordcloud words={words} options={options} />

  return <ReactWordcloud words={words} options={options} />
}


const TopicWordCloud = (props: any) => {

  useEffect(() => {}, [props.date])

  return (
    <MainDiv>
      <WordCloud userInfo={props.userInfo}  date={props.date}/>
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


export default TopicWordCloud;