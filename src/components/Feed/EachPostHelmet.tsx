
import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from "react-helmet";


const EachPostHelmet = (props: any) => (
  <Helmet
    meta={[
    { name: 'twitter:card', content: "summary" },
    { name: 'twitter:creator', content: "@hearvo" },
    { name: 'twitter:title', content: "Hearvo | " + props.data.title },
    { name: 'twitter:description', content: props.data.content },
      // { name: 'twitter:image', content: props.data. },
    { property: 'og:title', content: props.data.title },
    { property: 'og:site_name', content: "Hearvo" },
    { property: 'og:type', content: "website" },
    { property: 'og:url', content: "https://" + window.location.hostname + "/posts/" + props.data.id },
      { property: 'og:description', content: props.data.content },
    // { property: 'og:image', content: post.image },
    // { property: 'og:site_name', content: "Fishii.shop" },

    { name: 'viewport', content: 'width=device-width, maximum-scale=1' },
    ]}
  >
    <title>{"Hearvo | " + props.data.title}</title>
    <link rel="canonical" href={"https://" + window.location.hostname + "/posts/" + props.data.id} />
    {/* <meta property="description" content={props.data.content.slice(0, 300)} /> */}
    {/* <meta property="og:type" content="article" /> */}
    
  </Helmet>
)

export default EachPostHelmet;