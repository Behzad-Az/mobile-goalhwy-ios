import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';
import { Actions } from 'react-native-router-flux';

import NewDocForm from './NewDocForm.js';
import NewAssistForm from './NewAssistForm.js';

class TopRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptionStatus: this.props.courseInfo.subscriptionStatus,
      tutor_status: this.props.courseInfo.tutor_status,
      assistReqOpen: this.props.courseInfo.assistReqOpen
    };
    this.handleUnsubscribe = this.handleUnsubscribe.bind(this);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.handleTutorStatus = this.handleTutorStatus.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    nextProps.courseInfo.subscriptionStatus !== this.state.subscriptionStatus ? this.setState({ subscriptionStatus: nextProps.courseInfo.subscriptionStatus }) : '';
    nextProps.courseInfo.tutor_status !== this.state.tutor_status ? this.setState({ tutor_status: nextProps.courseInfo.tutor_status }) : '';
    nextProps.courseInfo.assistReqOpen !== this.state.assistReqOpen ? this.setState({ assistReqOpen: nextProps.courseInfo.assistReqOpen }) : '';
  }

  handleUnsubscribe() {
    fetch(`http://127.0.0.1:19001/api/users/currentuser/courses/${this.props.courseInfo.id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.setState({ subscriptionStatus: false, tutor_status: false, assistReqOpen: false }) : console.log("Error in server, TopRow.js - 0: ", resJSON))
    .catch(err => console.log("Error here: TopRow.js ", err));

  }

  handleSubscribe() {
    fetch(`http://127.0.0.1:19001/api/users/currentuser/courses/${this.props.courseInfo.id}`, {
        method: 'POST',
        body: JSON.stringify({ course_id: this.props.courseInfo.id })
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.setState({ subscriptionStatus: true }) : console.log("Error in server - 0: TopRow.js: ", resJSON))
    .catch(err => console.log("Error here: TopRow.js: ", err));
  }

  handleTutorStatus() {
    let tutor_status = !this.state.tutor_status;
    fetch(`http://127.0.0.1:19001/api/users/currentuser/courses/${this.props.courseInfo.id}/tutor`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tutor_status }),
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.setState({ tutor_status }) : console.log("Error in server - 0: TopRow.js: ", resJSON))
    .catch(err => console.log("Error here: TopRow.js: ", err));
  }

  render() {
    return (
      <View style={[styles.dividedRow, {maxHeight: 50}]}>

        <View style={{flex: 1}}>
          <NewDocForm />
        </View>

        <View style={{flex: 1}}>
          <TouchableHighlight
            style={styles.headerBtnContainer}
            onPress={() => Actions.CourseReviewPage({ courseId: this.props.courseInfo.id })}>
            <FontAwesome name="star" style={styles.headerBtn} />
          </TouchableHighlight>
        </View>

        <View style={{flex: 1}}>
          <TouchableHighlight
            style={styles.headerBtnContainer}
            onPress={this.state.subscriptionStatus ? this.handleUnsubscribe : this.handleSubscribe}>
            <FontAwesome name="check-circle" style={[styles.headerBtn, {color: this.state.subscriptionStatus ? "green" : "white"}]} />
          </TouchableHighlight>
        </View>

        <View style={{flex: 1}}>
          <NewAssistForm
            courseInfo={this.props.courseInfo}
            subscriptionStatus={this.state.subscriptionStatus} />
        </View>

        <View style={{flex: 1}}>
          <TouchableHighlight
            style={[styles.headerBtnContainer, {backgroundColor: this.state.subscriptionStatus ? "#004E89" : "#bbb"}]}
            onPress={this.handleTutorStatus}
            disabled={!this.state.subscriptionStatus}>
            <FontAwesome name="slideshare" style={[styles.headerBtn, {color: this.state.tutor_status ? "green" : "white"}]} />
          </TouchableHighlight>
        </View>

      </View>
    );
  }
}

export default TopRow;

const styles = StyleSheet.create({
  dividedRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  headerBtnContainer: {
    padding: 5,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 5,
    backgroundColor: '#004E89'
  },
  headerBtn: {
    textAlign: 'center',
    fontSize: 19,
    color: 'white'
  }
});
