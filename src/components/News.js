import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
    };
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )}- NewsWorld`;
  }
  async updateNews() {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(70);
    console.log(parsedData);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  }
  async componentDidMount() {
    this.updateNews();
  }
  // handlePrevClick = async () => {
  //   console.log("previous");
  //   this.setState({ page: this.state.page - 1 });
  //   this.updateNews();
  // };

  // handleNextClick = async () => {
  //   console.log("next");
  //   this.setState({ page: this.state.page + 1 });
  //   this.updateNews();
  // };

  // fetchMoreData = async () => {
  //   this.setState({ page: this.state.page + 1 });
  //   const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=c94a04ee13c345d4875516646c3d833e&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    
  //   let data = await fetch(url);
  //   let parsedData = await data.json();
  //   console.log(parsedData);
  //   this.setState({
  //     articles: this.state.articles.concat(parsedData.articles),
  //     totalResults: parsedData.totalResults,
      
  //   });
  // };
  fetchMoreData = async () => {
    const nextPage = this.state.page + 1;
    const remainingResults = this.state.totalResults - (nextPage - 1) * this.props.pageSize;
    const pageSize = Math.min(this.props.pageSize, remainingResults);
    
    if (pageSize <= 0) {
      return; // No more articles to fetch
    }
  
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${nextPage}&pageSize=${pageSize}`;
    
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    
    this.setState((prevState) => ({
      articles: [...prevState.articles, ...parsedData.articles],
      page: nextPage,
      loading: false,
    }));
  };
  

  render() {
    console.log("render");
    
    
    return (
      <div className="conatiner">
        <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>
          {" "}
          NewsWorld - Top {this.capitalizeFirstLetter(this.props.category)}{" "}
          Headlines{" "}
        </h1> 
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="conatiner" >  

          
           <div className="row">
              {this.state.articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.id}>
                    <NewsItem
                      title={element.title && element.title.slice(0, 50)}
                      description={
                        element.description && element.description.slice(0, 100)
                      }
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
        
      </div>
    );
  }
}
export default News;
