
import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from "react-helmet";


const EachPostHelmet = (props: any) => (
  <Helmet
    title={"Hearvo | " + props.data.title}
    description={props.data.content.slice(0, 300)}
    link={"https://" + window.location.hostname + "/posts/" + props.data.id}
  >
  </Helmet>
)

export default EachPostHelmet;