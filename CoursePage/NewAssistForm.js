import React, { Component } from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  View,
  ScrollView,
  TextInput,
  Picker,
  TouchableHighlight
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';
import FormNavBar from '../Navbar/FormNavBar.js';

class NewAssistForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      height: 0,
      issue_desc: this.props.courseInfo.latestAssistRequest,
      assistReqOpen: this.props.courseInfo.assistReqOpen,
      closureReason: ''
    };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.formFooterOptions = this.formFooterOptions.bind(this);
    this.handleNewRequestAssist = this.handleNewRequestAssist.bind(this);
    this.handleUpdateRequestAssist = this.handleUpdateRequestAssist.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    nextProps.courseInfo.latestAssistRequest !== this.state.issue_desc ? this.setState({ issue_desc: nextProps.courseInfo.latestAssistRequest }) : '';
    nextProps.courseInfo.assistReqOpen !== this.state.assistReqOpen ? this.setState({ assistReqOpen: nextProps.courseInfo.assistReqOpen }) : '';
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  validateForm() {
    return this.state.issue_desc &&
           this.state.issue_desc.length <= 400
  }

  formFooterOptions() {
    if (this.state.assistReqOpen) {
      return (
        <View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Select outcome to close the issue?</Text>
            <Picker
              selectedValue={this.state.closureReason}
              onValueChange={closureReason => this.setState({closureReason})}
              itemStyle={{fontSize: 16}}>
              <Picker.Item label="-" value="" />
              <Picker.Item label="Resolved on my own" value="Resolved on my own" />
              <Picker.Item label="Resolved with tutor" value="Resolved with tutor" />
              <Picker.Item label="No longer needed" value="No longer needed" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <View style={styles.dividedRow}>
            <View style={[styles.primaryBtnContainer, {marginRight: 5}]}>
              <Text style={styles.primaryBtn} onPress={this.handleNewRequestAssist}>
                Update
              </Text>
            </View>
            <View style={[styles.primaryBtnContainer, {marginLeft: 5}]}>
              <Text style={styles.primaryBtn} onPress={() => this.setModalVisible(false)}>
                Cancel
              </Text>
            </View>
          </View>

        </View>
      );
    } else {
      return (
        <View style={styles.dividedRow}>
          <View style={[styles.primaryBtnContainer, {marginRight: 5}]}>
            <Text style={styles.primaryBtn} onPress={this.handleNewRequestAssist}>
              Submit
            </Text>
          </View>
          <View style={[styles.primaryBtnContainer, {marginLeft: 5}]}>
            <Text style={styles.primaryBtn} onPress={() => this.setModalVisible(false)}>
              Cancel
            </Text>
          </View>
        </View>
      );
    }
  }

  handleNewRequestAssist() {
    let data = {...this.state};
    delete data.height;
    delete data.modalVisible;
    fetch(`http://127.0.0.1:19001/api/users/${this.props.courseInfo.user_id}/courses/${this.props.courseInfo.id}/tutorlog`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.setState({ assistReqOpen: true }) : console.log("Error in server - 0: ", resJSON))
    .catch(err => console.log("Error here: ", err));
    this.setModalVisible(false);
  }

  handleUpdateRequestAssist() {
    let data = {
      action: this.state.closureReason ? 'close' : 'update',
      issue_desc: this.state.issue_desc,
      closure_reason: this.state.closureReason
    };
    let newState = this.state.closureReason ? { assistReqOpen: false, issue_desc: '' } : { assistReqOpen: true };

    fetch(`http://127.0.0.1:19001/api/users/${this.props.courseInfo.user_id}/courses/${this.props.courseInfo.id}/tutorlog/update`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.setState(newState) : console.log("Error in server - 0: ", resJSON))
    .catch(err => console.log("Error here: ", err));
    this.setModalVisible(false);
  }

  render() {
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
        >
          <ScrollView style={styles.modalContainer}>

            <FormNavBar formTitle="Request Assistance:" backFcn={this.setModalVisible} />

            <View style={styles.bodyContainer}>
              <View style={[styles.inputContainer, {minHeight: 200}]}>
                <Text style={styles.inputLabel}>Describe your question / issue?</Text>
                <TextInput
                  style={[styles.textInput, {height: this.state.height}]}
                  multiline
                  onChangeText={issue_desc => this.setState({issue_desc})}
                  value={this.state.issue_desc}
                  placeholder="How may one of our tutors assist you?"
                  underlineColorAndroid="rgba(0,0,0,0)"
                  onContentSizeChange={event => {
                    this.setState({height: event.nativeEvent.contentSize.height});
                  }}
                />
              </View>
              { this.formFooterOptions() }
            </View>

          </ScrollView>
        </Modal>

        <TouchableHighlight
          onPress={() => this.setModalVisible(true)}
          disabled={!this.props.subscriptionStatus}
          style={[styles.headerBtnContainer, {backgroundColor: this.props.subscriptionStatus ? "#004E89" : "#bbb"}]}>
          <FontAwesome name="bell" style={[styles.headerBtn, {color: this.state.assistReqOpen ? "green" : "white"}]} />
        </TouchableHighlight>

      </View>
    );
  }
}

export default NewAssistForm;

const styles = StyleSheet.create({
  modalContainer: {
    paddingTop: 25,
  },
  bodyContainer: {
    padding: 10
  },
  inputContainer: {
    marginBottom: 10,
    padding: 5,
    borderWidth: .5,
    borderRadius: 5,
    borderColor: '#aaa'
  },
  inputLabel: {
    color: '#004E89',
    fontWeight: 'bold',
    paddingTop: 2.5
  },
  textInput: {
    paddingTop: 2.5,
    fontSize: 16
  },
  dividedRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerBtnContainer: {
    padding: 5,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 5
  },
  headerBtn: {
    textAlign: 'center',
    fontSize: 19
  },
  primaryBtnContainer: {
    backgroundColor: '#004E89',
    flex: 1,
    borderRadius: 5,
    borderColor: '#004E89',
    borderWidth: .5,
    padding: 5
  },
  primaryBtn: {
    color: 'white',
    textAlign: 'center'
  }
});
