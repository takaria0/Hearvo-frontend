import React, { useEffect, useState, useRef } from 'react';
import { MyResponsivePie, MyResponsiveBar } from '../../helpers/NivoPlots';
import i18n from "../../helpers/i18n";
import { CollectionsBookmarkRounded } from '@material-ui/icons';

const moment = require('moment-timezone');
moment.tz.setDefault('Etc/UTC');

interface AttributePlotPiePlops  {
  genderDist: any;
  ageDist: any;
}

const AttributePlotPie = (props: AttributePlotPiePlops) => {
    const genderData = [
      { id: i18n.t("eachPost.male"), value: props.genderDist.male, color: "hsla(220, 64%, 50%, 1)" },
      { id: i18n.t("eachPost.female"), value: props.genderDist.female, color: "hsla(0, 56%, 50%, 1)" },
      { id: i18n.t("eachPost.others"), value: props.genderDist.others, color: "hsla(114, 100%, 23%, 1)" }];

    const ageData = [
      { label: '0-9', y: props.ageDist["0_9"]  },
      { label: '10-19', y: props.ageDist["10_19"]},
      { label: '20-29', y: props.ageDist["20_29"] },
      { label: '30-39', y: props.ageDist["30_39"] },
      { label: '40-49', y: props.ageDist["40_49"] },
      { label: '50-59', y: props.ageDist["50_59"] },
      { label: '60-69', y: props.ageDist["60_69"] },
      { label: '70-79', y: props.ageDist["70_79"] },
      { label: '80-89', y: props.ageDist["80_89"] },
      { label: '90-99', y: props.ageDist["90_99"] },
      { label: '100-109', y: props.ageDist["100_109"] },
      { label: '110-119', y: props.ageDist["110_119"] },
    ];

  const mediaQueryMin900 = window.matchMedia('(min-width: 900px)')
  const margin = mediaQueryMin900.matches ?
    { top: 50, right: 200, bottom: 50, left: 160 } : { top: 50, right: 150, bottom: 50, left: 100 };
  const keysVer1 = ageData.map((obj: any) => (obj.label));
  console.log('ageData', ageData);

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
          <MyResponsiveBar 
            data={ageData}
            keys={JSON.parse(JSON.stringify(keysVer1))}
            margin={margin}
          ></MyResponsiveBar>
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