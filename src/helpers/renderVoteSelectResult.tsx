import React, { useEffect, useState, useRef } from "react";
import * as styles from "../css/Feed.module.css";

export const renderVoteSelectResult = (data: any, layout: any) => {
  const x = data[0].x;
  const y = data[0].y;
  const myVoteId = data[0].myVote?.vote_select_id || null;
  const voteIdList = data[0].voteIdList || [];

  return (
    <div>
      <ul className={styles.vote_ul}>
        <div>
          {y.map((label: string, idx: number) => {
            x[idx] = Math.round(x[idx]);
            const vote_select_id = voteIdList.length > 0 ? voteIdList[idx] : "";
            const backGroundColor =
              myVoteId === vote_select_id
                ? "rgba(0, 0, 255, 0.3)"
                : "rgba(0, 0, 255, 0.1)";

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
                      <span style={{ textAlign: "left" }}>{label} &nbsp;</span>
                      <span style={{ textAlign: "right" }}>
                        {isNaN(x[idx]) ? 0 : x[idx]}%
                      </span>
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
