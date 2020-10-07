import React from 'react';
import Markdown from 'react-markdown';
import Spinner from 'react-bootstrap/Spinner';

import common from './aigis_common.js';
import {base_url as url} from '../data/url.json';


const contentURL = [
  url,
  'top_page.md',
].join('');
const historyURL = [
  url,
  'history.txt',
].join('');

const loadingStyle = {
  marginTop: '10%',
  textAlign: 'center',
};
const containerStyle = {
  textAlign: 'center',
};
const textContainerStyle = {
  background: '#fafafa',
  border: 'solid 1px #ddd',
  borderRadius: '5px',
  boxShadow: '10px 5px 5px gray',
  padding: '20px',
  margin: 'auto',
  marginTop: '20px',
  textAlign: 'left',
  width: '60%',
};
const textStyle = {
  marginTop: '10px',
  overflowY: 'scroll',
  maxHeight: '200px',
};

class HomeView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      history: '',
    };
  }

  componentDidMount() {
    common.loadTextData(contentURL).then((txt) => {
      this.setState({content: txt});
    });
    common.loadTextData(historyURL).then((txt) => {
      const history = txt.split('\n').reverse().
        join('\n');
      this.setState({history: history});
    });
  }

  render() {
    return (
      <div>
        {
          this.state.content.length === 0 &&
          <div style={loadingStyle}>
            <Spinner animation="border" />
          </div>
        }
        {
          this.state.content.length > 0 &&
          <div style={containerStyle}>
            <div style={textContainerStyle}>
              <Markdown
                source={this.state.content}
              />
            </div>
          </div>
        }
        {
          this.state.history.length > 0 &&
          <div style={containerStyle}>
            <div style={textContainerStyle}>
              <h3>
                {common.text.history}
              </h3>
              <div style={textStyle}>
                {this.state.history}
              </div>
            </div>
          </div>
        }
      </div>
    );
  }

}

HomeView.propTypes = {};

export default HomeView;
