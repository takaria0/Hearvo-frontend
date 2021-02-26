import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom'
import axios from './Api';
import { getJwt } from '../helpers/jwt';
import i18n from "../helpers/i18n";
import TopicFollowButton from './TopicFollowButton';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import RenderTopic from './Feed/RenderTopic';



const DetailInfo = (props: any) => {

  return (
    <div style={{  marginTop: 20, borderWidth: 2, borderRadius: 5, backgroundColor: 'white', padding: 5}}>
      <small><Link to="/tos">{i18n.t("sidebar.tos")}</Link>  <Link to="/privacy">{i18n.t("sidebar.privacy")}</Link></small>
  </div>
  )
}

const TrendingTopics = (props: any) => {
  const [popularTopic, setPopularTopic] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const jwt = getJwt();
    axios.get("/topics?sidebar=true", { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
      .then(res => {
        setPopularTopic(res.data);
        setIsLoading(false);
      }).catch(err => {
        setIsLoading(false);
      })

  }, []);


  if (isLoading) { return (<div><h3>{i18n.t("sidebar.trending")}</h3></div>) }

  return (
    <div>
      <h3>{i18n.t("sidebar.trending")}</h3>
      <div style={{ fontFamily: 'monospace, serif', border: 'none', borderWidth: 2, borderRadius: 5, backgroundColor: 'white' }}>

        <div style={{ padding: 10, paddingTop: 10, paddingBottom: 20 }}>
          {popularTopic.map((elem: any, idx: number) => {
            const topic = elem.topic.length > 8 ? elem.topic.slice(0, 8) + ".." : elem.topic;
            return (
              <div style={{ height: '45px', border: 'none', borderWidth: '1px', paddingRight: 5, paddingBottom: 0, marginBottom: 5, borderRadius: 10, paddingLeft: 5, wordWrap: "break-word" }}>

                <Link to={`/topic?tp=${elem.topic}`} style={{ textDecoration: 'none', }}>
                  <span style={{ fontSize: 14 }}>{idx + 1} {topic}</span></Link>

                <span style={{ float: 'right', textAlign: 'right' }}>
                  <TopicFollowButton topicWord={elem.topic}></TopicFollowButton>

                </span>
                <div style={{ paddingBottom: 3 }}></div>
                <hr></hr>
              </div>)
          })}
        </div>
      </div>
      <DetailInfo></DetailInfo>
    </div>
  )
}


const RelatedPosts = (props: any) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const jwt = getJwt();
    axios.get(`/posts?related_post_id=${props.postId}`, { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
      .then(res => {
        setRelatedPosts(res.data.posts);
        setIsLoading(false);
      }).catch(err => {
        setIsLoading(false);
      })

  }, []);

  if (isLoading) { return (<div><h3>{i18n.t("sidebar.relatedPosts")}</h3></div>) }

  if (relatedPosts.length === 0) {
    return (
      <div>
        <h3>
          {i18n.t("sidebar.relatedPosts")}
        </h3>
        {i18n.t("sidebar.noContent")}
      </div>
    )
  }

  return (
    <div>
      <h3>
        {i18n.t("sidebar.relatedPosts")}
      </h3>
      {relatedPosts.map((elem: any) => {
        const title = elem.title.length > 30 ? elem.title.slice(0, 30) + ".." : elem.title;
        return (
          <div style={{marginBottom: 5}}>
            <div style={{border: 'solid', borderWidth: 1, borderRadius: 6, backgroundColor: 'white', padding: 10}}>
              <Link to={`/posts/${elem.id}`} style={{textDecoration: 'none'}}>
                <div>
                  {title}
                  {/* <div style={{transform: 'translateX(-10px)'}}><RenderTopic topics={elem.topics.slice(0,3)}/></div> */}
                </div>
              </Link>
              <div style={{ marginTop: 5}}>
                <span>
                <EqualizerIcon style={{ fontSize: 20 }} />
                  {elem.total_vote}&nbsp;
                </span>
                <span>
                  <ChatBubbleIcon style={{ fontSize: 20 }} />&nbsp;{elem.comments.length}&nbsp;
                </span >
                <span>
                  {elem.vote_period_end ? i18n.t("eachPost.voteEnd") : ""}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>

  )
}


const SideBar = (props: any) => {

  const currentFirstURL = window.location.pathname.split("/").length > 1 ? window.location.pathname.split("/")[1] : "";
  const [currentUrl, setCurrentUrl] = useState(currentFirstURL);

  useEffect(() => {
    const updateUrl = window.location.pathname.split("/").length > 1 ? window.location.pathname.split("/")[1] : "";
    setCurrentUrl(updateUrl);
  }, [])

  switch (currentUrl) {
    case "posts":
      const postId = window.location.pathname.split("/")[2];
      return (
        <RelatedPosts postId={postId}/>
      )
    break;

    default:
      return (
        <TrendingTopics />
      )
    break;
  }


}

export default SideBar;