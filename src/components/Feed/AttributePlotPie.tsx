import React, { useEffect, useState, useRef } from 'react';
import { MyResponsivePie, MyResponsiveBar } from '../../helpers/NivoPlots';
import i18n from "../../helpers/i18n";

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
      { id: '0-9', value: props.ageDist["0_9"]  },
      { id: '10-19', value: props.ageDist["10_19"]},
      { id: '20-29', value: props.ageDist["20_29"] },
      { id: '30-39', value: props.ageDist["30_39"] },
      { id: '40-49', value: props.ageDist["40_49"] },
      { id: '50-59', value: props.ageDist["50_59"] },
      { id: '60-69', value: props.ageDist["60_69"] },
      { id: '70-79', value: props.ageDist["70_79"] },
      { id: '80-89', value: props.ageDist["80_89"] },
      { id: '90-99', value: props.ageDist["90_99"] },
      { id: '100-109', value: props.ageDist["100_109"] },
      { id: '110-119', value: props.ageDist["110_119"] },
    ]
  return (
    <div>
      <div>
          <h4 style={{ textAlign: 'center' }}>{i18n.t("eachPost.votersAttributes")}</h4>
          <h5 style={{ textAlign: 'center' }}>{i18n.t("eachPost.gender")}</h5>
          <div style={{height: 300}}> 
            <MyResponsivePie data={genderData} colors={{ datum: 'data.color' }} legends={[
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
            <MyResponsivePie data={ageData} colors={{ "scheme": "set3" }} legends={
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
              ]}></MyResponsivePie>
          </div>
      </div>
    </div>
  )
};


export default AttributePlotPie;