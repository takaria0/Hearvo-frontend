import React, { useEffect, useState, useRef } from 'react';
import { MyResponsivePie, MyResponsiveBar } from '../../../helpers/NivoPlots';
import i18n from "../../../helpers/i18n";
import { CollectionsBookmarkRounded } from '@material-ui/icons';
import { Bar, HorizontalBar } from 'react-chartjs-2';

const moment = require('moment-timezone');
moment.tz.setDefault('Etc/UTC');

interface AttributePlotPiePlops  {
  genderDist: any;
  ageDist: any;
}

const AttributePlotPie = (props: AttributePlotPiePlops) => {
    let totalVote = Number(props.genderDist.male) + Number(props.genderDist.female) + Number(props.genderDist.others);  
    const genderData = [
      { id: i18n.t("eachPost.male"), value: props.genderDist.male, color: "hsla(220, 64%, 50%, 1)" },
      { id: i18n.t("eachPost.female"), value: props.genderDist.female, color: "hsla(0, 56%, 50%, 1)" },
      { id: i18n.t("eachPost.others"), value: props.genderDist.others, color: "hsla(114, 100%, 23%, 1)" }];

    const ageData = [
      { x: '0-9', y: props.ageDist["0_9"] * 100 / totalVote, },
      { x: '10-19', y: props.ageDist["10_19"] * 100 / totalVote, },
      { x: '20-29', y: props.ageDist["20_29"] * 100 / totalVote, },
      { x: '30-39', y: props.ageDist["30_39"] * 100 / totalVote, },
      { x: '40-49', y: props.ageDist["40_49"] * 100 / totalVote,},
      { x: '50-59', y: props.ageDist["50_59"] * 100 / totalVote, },
      { x: '60-69', y: props.ageDist["60_69"] * 100 / totalVote,},
      { x: '70-79', y: props.ageDist["70_79"] * 100 / totalVote,},
      { x: '80-89', y: props.ageDist["80_89"] * 100 / totalVote,},
      { x: '90-99', y: props.ageDist["90_99"] * 100 / totalVote,},
      { x: '100-109', y: props.ageDist["100_109"] * 100 / totalVote,},
      { x: '110-119', y: props.ageDist["110_119"] * 100 / totalVote,},
    ];

  const mediaQueryMin900 = window.matchMedia('(min-width: 900px)')
  const margin = mediaQueryMin900.matches ?
    { top: 50, right: 200, bottom: 50, left: 160 } : { top: 50, right: 150, bottom: 50, left: 100 };
  const keysVer1 = ageData.map((obj: any) => (obj.label));
  const data = {
    labels: ageData.map((obj: any) => (obj.x)),
    datasets: [
      {
        label: i18n.t("eachPost.age"),
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        borderColor: 'rgba(0, 0, 255, 0.1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: ageData.map((obj: any) => (obj.y.toFixed(1))),
      }
    ]
  };

  return (
    <div>
      <div>
          <h4 style={{ textAlign: 'center' }}>{i18n.t("eachPost.votersAttributes")}</h4>
          <h5 style={{ textAlign: 'center' }}>{i18n.t("eachPost.gender")}</h5>
          <div style={{height: 300}}> 
            
            {/* <MyResponsivePie data={genderData} colors={{ datum: 'data.color' }} legends={[ */}
          <MyResponsivePie data={genderData} colors={{ "scheme": 'set3' }} legends={[
              {
                anchor: 'top-left',
                direction: 'column',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                // symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000'
                    }
                  }
                ]
              }
            ]}></MyResponsivePie>
          </div>
          <h5 style={{ textAlign: 'center' }}>{i18n.t("eachPost.age")}</h5>
          <div style={{ height: 300 }}> 
          {/* <MyResponsiveBar 
            data={ageData}
            keys={JSON.parse(JSON.stringify(keysVer1))}
            margin={margin}
          ></MyResponsiveBar> */}
          <HorizontalBar
            data={data}
            width={100}
            height={50}
            options={
            {
                scales: {
                  xAxes: [{
                    ticks: {max: 100},
                    gridLines: {
                      drawOnChartArea: false
                    }
                  }],
                  yAxes: [{
                    gridLines: {
                      drawOnChartArea: false
                    }
                  }]
                },
              maintainAspectRatio: false 
            }
            }
          />
            {/* <MyResponsivePie data={ageData} colors={{ "scheme": "set3" }} legends={
              [
              {
                anchor: 'top-left',
                direction: 'column',
                justify: false,
                translateX: 0,
                translateY: 0,
                itemWidth: 100,
                itemHeight: 20,
                itemsSpacing: 0,
                symbolSize: 20,
                itemDirection: 'left-to-right'
              }
              ]}></MyResponsivePie> */}
          </div>
      </div>
    </div>
  )
};


export default AttributePlotPie;