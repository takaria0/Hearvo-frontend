import React, { useEffect, useState, useRef } from "react";
import i18n from "../../../helpers/i18n";
import * as styles from "../../../css/Feed.module.css";

interface AttributePlotBarPlops {
  genderDist: any;
  ageDist: any;
  total_vote: number;
  type: string;
}

const AttributePlotBarEach = (props: AttributePlotBarPlops) => {
  let x: any;
  let y: any;
  const totalVote =
    Number(props.genderDist.male) +
    Number(props.genderDist.female) +
    Number(props.genderDist.others);
  switch (props.type) {
    case "gender":
      x = [
        (props.genderDist.male * 100) / totalVote,
        (props.genderDist.female * 100) / totalVote,
        (props.genderDist.others * 100) / totalVote,
      ];
      y = [
        i18n.t("eachPost.male"),
        i18n.t("eachPost.female"),
        i18n.t("eachPost.others"),
      ];
      break;

    case "age":
      x = [
        (props.ageDist["0_9"] * 100) / totalVote,
        (props.ageDist["10_19"] * 100) / totalVote,
        (props.ageDist["20_29"] * 100) / totalVote,
        (props.ageDist["30_39"] * 100) / totalVote,
        (props.ageDist["40_49"] * 100) / totalVote,
        (props.ageDist["50_59"] * 100) / totalVote,
        (props.ageDist["60_69"] * 100) / totalVote,
        (props.ageDist["70_79"] * 100) / totalVote,
        (props.ageDist["80_89"] * 100) / totalVote,
        (props.ageDist["90_99"] * 100) / totalVote,
        (props.ageDist["100_109"] * 100) / totalVote,
        (props.ageDist["110_119"] * 100) / totalVote,
      ];

      y = [
        "0-9",
        "10-19",
        "20-29",
        "30-39",
        "40-49",
        "50-59",
        "60-69",
        "70-79",
        "80-89",
        "90-99",
        "100-109",
        "110-119",
      ];

      break;
  }

  return (
    <div>
      <ul className={styles.vote_ul}>
        <div>
          {y.map((label: string, idx: number) => {
            x[idx] = Math.round(x[idx]);
            const backGroundColor = "rgba(0, 0, 255, 0.1)";

            return (
              <div
                style={{
                  border: "solid 1px",
                  borderRadius: "5px",
                  marginBottom: "5px",
                }}
              >
                <div
                  style={{
                    paddingLeft: "2px",
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    backgroundColor: backGroundColor,
                    width: `${isNaN(x[idx]) ? 0 : x[idx]}%`,
                  }}
                >
                  <div style={{ whiteSpace: "nowrap", padding: 2 }}>
                    <div style={{ textAlign: "left" }}>
                      {label} {isNaN(x[idx]) ? 0 : x[idx]}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ul>
    </div>
  );
};

const AttributePlotBar = (props: any) => {
  return (
    <div>
      <h4 style={{ textAlign: "center" }}>
        {i18n.t("eachPost.votersAttributes")}
      </h4>
      <h5 style={{ textAlign: "center" }}>{i18n.t("eachPost.gender")}</h5>
      <div className={styles.vote_section}>
        <AttributePlotBarEach
          ageDist={props.ageDist}
          genderDist={props.genderDist}
          total_vote={props.totalVote}
          type="gender"
        />
      </div>
      <h5 style={{ textAlign: "center" }}>{i18n.t("eachPost.age")}</h5>
      <div className={styles.vote_section}>
        <AttributePlotBarEach
          ageDist={props.ageDist}
          genderDist={props.genderDist}
          total_vote={props.totalVote}
          type="age"
        />
      </div>
    </div>
  );
};

export default AttributePlotBar;
