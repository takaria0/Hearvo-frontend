import React from 'react';


type PostType = {
  post_id: number;
  title: string,
  content: string;
}

const someData: PostType[] = [
  {
    post_id: 1,
    title: "What do you think about Trump?",
    content: "Folks, I want you to answer this question"
  },
  {
    post_id: 2,
    title: "How much money do you make?",
    content: "Folks, I want you to answer this question"
  },
];


const categoryData = [
  "popular",
  "latest",
  "science",
  "IT",
  "environment",
  "politics",
]



type FeedProps = {
  service: string;
};
type FeedState = {
};

type FeedListProps = {
  // using `interface` is also ok
  data: PostType[];
};
type FeedListState = {
};

type FeedCategoryProps = {
  data: Array<string>;
};
type FeedCategoryState = {
};


 
// Feed posts
class FeedList extends React.Component<FeedListProps, FeedListState> {
  
  render() {
    return (
      <div className="feed-list">
        <h1>Feed</h1>
        <ul>
          {
            this.props.data.map((da) => {
              return (
                <li>
                  {da.title}:
                  {da.content}
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  }
}

// Category
class FeedCategory extends React.Component<FeedCategoryProps, FeedCategoryState> {

  render() {
    return (
      <div className="feed-category">
        <h1>Category</h1>
        <ul>
          {
          this.props.data.map((data)=> {
            return (
            <li>
              {data}
            </li>
            )
          })
          }
        </ul>
      </div>
    );
  }
}


// Base Component
class Feed extends React.Component<FeedProps, FeedState> {

  componentDidMount() {
    
  }

  render() {
    return (
      <div className="feed">
        <FeedCategory data={categoryData}></FeedCategory>
        <h1>Shopping List for {this.props.service}</h1>
        <FeedList data={someData}></FeedList>
      </div>
    );
  }
}

export default Feed;