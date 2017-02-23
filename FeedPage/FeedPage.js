import React from 'react';
import {
  ScrollView,
  Text,
  View,
  Dimensions
} from 'react-native';

import CourseFeedRow from './CourseFeedRow.js';

class FeedPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      courseFeeds: []
    };
    this.conditionData = this.conditionData.bind(this);
    this.determineFeedCategory = this.determineFeedCategory.bind(this);
  }

  componentWillMount() {
    fetch(`http://127.0.0.1:19001/api/users/${this.props.userId}/feed`)
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(err => {
      console.log("Error here: FeedPage.js: fetch error: ", err);
      this.setState({ dataLoaded: true, pageError: true });
    });
  }

  determineFeedCategory(feed) {
    if (feed.doc_id) return "docRevision";
    else if (feed.tutor_log_id) return "tutorLog";
    else return "other";
  }

  conditionData(resJSON) {
    if (resJSON) {
      resJSON.forEach(feed => feed.category = this.determineFeedCategory(feed));
      this.setState({ courseFeeds: resJSON, dataLoaded: true });
    } else {
      console.log("Error here: FeedPage.js: server error: ", err);
      this.setState({ dataLoaded: true, pageError: true });
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={{marginTop: 89, minHeight: Dimensions.get('window').height - 89, backgroundColor: '#ddd', paddingTop: 5 }}>
          { this.state.courseFeeds.map((feed, index) => <CourseFeedRow key={index} feed={feed} />) }
        </View>
      </ScrollView>
    );
  }
}

export default FeedPage;
