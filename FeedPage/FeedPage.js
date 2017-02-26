import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Dimensions
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import CourseFeedRow from './CourseFeedRow.js';

class FeedPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      courseFeeds: [],
      instId: ''
    };
    this.conditionData = this.conditionData.bind(this);
    this.determineFeedCategory = this.determineFeedCategory.bind(this);
  }

  componentWillMount() {
    fetch('http://127.0.0.1:19001/api/users/currentuser/feed')
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
      resJSON.courseFeeds.forEach(feed => feed.category = this.determineFeedCategory(feed));
      resJSON.dataLoaded = true;
      this.setState(resJSON);
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
          { !this.state.courseFeeds[0] &&
            <Text style={styles.textBtn} onPress={() => Actions.InstPage({ instId: this.state.instId })}>
              To get updates, click here to select and subscribe to at least one course.
            </Text> }
        </View>
      </ScrollView>
    );
  }
}

export default FeedPage;

const styles = StyleSheet.create({
  textBtn: {
    padding: 5,
    textAlign: 'center',
    color: '#004E89'
  }
});
