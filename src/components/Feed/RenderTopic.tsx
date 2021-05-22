import React, { useEffect, useState, useRef } from "react";
import * as styles from "../../css/Feed.module.css";
import { RouteComponentProps, Link, Redirect } from "react-router-dom";

const RenderTopic = (props: any) => {
  if (props.topics.length === 0) return <span></span>;

  return (
    <div style={{ color: "black" }}>
      &nbsp;&nbsp;
      {props.topics.map((elem: any) => {
        return (
          <span style={{}}>
            <Link
              className={styles.topic_link}
              to={`/topic?tp=${elem.topic.topic}`}
              key={`/topic?tp=${elem.topic.topic}`}
            >
              <small
                style={{
                  border: "",
                  borderRadius: "7px",
                  padding: "2px",
                  backgroundColor: "#D3D3D3",
                }}
              >
                {elem.topic.topic}
              </small>
            </Link>
            {"  "}
          </span>
        );
      })}
    </div>
  );
};

export default RenderTopic;
