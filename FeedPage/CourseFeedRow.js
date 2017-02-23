import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';

class CourseFeedRow extends React.Component {
  constructor(props) {
    super(props);
    this.determineIcon = this.determineIcon.bind(this);
  }

  determineIcon(feedCategory) {
    switch (feedCategory) {
      case "docRevision":
        return "file-text";
      case "tutorLog":
        return "slideshare";
      default:
        return "question-circle-o";
    }
  }

  render() {

    return (
      <View style={styles.feedContainer}>

        <View style={styles.dividedRow}>
          <View style={{flex: 1, padding: 5}}>
            <FontAwesome name={this.determineIcon(this.props.feed.category)} style={styles.iconStyle} />
          </View>

          <View style={{flex: 6, padding: 5}}>
            <Text style={styles.headerText}>{this.props.feed.prefix} {this.props.feed.suffix}</Text>
            <Text style={styles.posterText}>By {this.props.feed.commenter_name}</Text>
            <Text>{this.props.feed.content}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default CourseFeedRow;

const styles = StyleSheet.create({
  feedContainer: {
    marginBottom: 5,
    backgroundColor: 'white',
    borderTopWidth: .5,
    borderBottomWidth: .5,
    borderColor: '#004E89'
  },
  dividedRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  iconStyle: {
    fontSize: 35,
    color: '#004E89',
    textAlign: 'center'
  },
  headerText: {
    color: '#004E89',
    fontWeight: 'bold',
    paddingBottom: 2
  },
  posterText: {
    fontStyle: 'italic',
    fontSize: 13,
    paddingBottom: 2
  }
});
