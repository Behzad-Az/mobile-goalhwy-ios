import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text
} from 'react-native';

import { Actions } from 'react-native-router-flux';

class IndexRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Text style={styles.courseTitle} onPress={() => Actions.CoursePage({ courseId: this.props.course.id })}>
        {this.props.course.prefix} {this.props.course.suffix}
      </Text>
    );
  }
}

export default IndexRow;

const styles = StyleSheet.create({
  courseTitle: {
    padding: 5,
    fontWeight: 'bold',
    backgroundColor: 'white',
    borderBottomWidth: .5,
    borderColor: '#004E89'
    // borderLeftWidth: .5,
    // borderRightWidth: .5
  }
});
