import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { FontAwesome } from '@exponent/vector-icons';

class InstPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAlreadySubscribed: this.props.currUserCourseIds.includes(this.props.course.id)
    };
    this.handleSubscription = this.handleSubscription.bind(this);
  }

  handleSubscription() {
    let subStatus = !this.state.userAlreadySubscribed;
    let userId = 1;
    let course_id = this.props.course.id;

    if (subStatus) {
      fetch(`http://127.0.0.1:19001/api/users/${userId}/courses/${course_id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course_id }),
      })
      .then(response => response.json())
      .then(resJSON => resJSON ? this.setState({ userAlreadySubscribed: subStatus }) : console.log("Error in server - 0: ", resJSON))
      .catch(err => console.log("Error here: CourseRow.js: ", err));

    } else {
      fetch(`http://127.0.0.1:19001/api/users/${userId}/courses/${course_id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(resJSON => resJSON ? this.setState({ userAlreadySubscribed: subStatus }) : console.log("Error in server - 0: ", resJSON))
      .catch(err => console.log("Error here: CourseRow.js: ", err));
    }
  }

  render() {
    return (
      <View style={styles.dividedRow}>
        <Text style={{flex: 9}} onPress={() => Actions.CoursePage({ courseId: this.props.course.id })}>
          {this.props.course.displayName}
        </Text>
        <FontAwesome
          name="check-circle"
          style={[styles.subBtn, {color: this.state.userAlreadySubscribed ? "green" : "black"}]}
          onPress={this.handleSubscription} />
      </View>
    );
  }
}

export default InstPage;

const styles = StyleSheet.create({
  dividedRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    backgroundColor: 'white',
    borderTopWidth: .5,
    borderBottomWidth: .5,
    borderColor: '#004E89',
    padding: 5
  },
  subBtn: {
    flex: 1,
    fontSize: 25
  }
});
