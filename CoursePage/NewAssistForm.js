import React, { Component } from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableHighlight
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';
import FormNavBar from '../Navbar/FormNavBar.js';
import ClosureSelect from '../Partials/ModalSelect.js';

class NewAssistForm extends Component {
  constructor(props) {
    super(props);
    this.closureOptions = [
      { value: 'Resolved on my own', label: 'Resolved on my own' },
      { value: 'Resolved with tutor', label: 'Resolved with tutor' },
      { value: 'No longer needed', label: 'No longer needed' },
      { value: 'Other', label: 'Other' }
    ];
    this.state = {
      modalVisible: false,
      height: 0,
      issueDesc: this.props.courseInfo.latestAssistRequest,
      assistReqOpen: this.props.courseInfo.assistReqOpen,
      closureReason: ''
    };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.handleClosureSelect = this.handleClosureSelect.bind(this);
    this.formFooterOptions = this.formFooterOptions.bind(this);
    this.handleNewRequestAssist = this.handleNewRequestAssist.bind(this);
    this.handleUpdateRequestAssist = this.handleUpdateRequestAssist.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courseInfo.latestAssistRequest !== this.state.issueDesc || nextProps.courseInfo.assistReqOpen !== this.state.assistReqOpen) {
      this.setState({
        issueDesc: nextProps.courseInfo.latestAssistRequest,
        assistReqOpen: nextProps.courseInfo.assistReqOpen
      });
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  handleClosureSelect(closureReason) {
    this.setState({ closureReason });
  }

  formFooterOptions() {
    if (this.state.assistReqOpen) {
      return (
        <View>

          <View>
            <ClosureSelect
              options={this.closureOptions}
              handleSelect={this.handleClosureSelect}
              btnContent={{ type: 'text', name: this.state.closureReason ? this.state.closureReason : 'Select outcome to close the issue' }}
              style={[styles.selectContainer, {color: this.state.closureReason ? 'black' : '#004E89', fontWeight: this.state.closureReason ? 'normal' : 'bold'}]}
            />
            <FontAwesome name="chevron-down" style={{position: 'absolute', top: 5, right: 5, fontSize: 15}} />
          </View>

          <View style={styles.dividedRow}>
            <View style={[styles.primaryBtnContainer, {marginRight: 5}]}>
              <Text style={styles.primaryBtn} onPress={this.handleUpdateRequestAssist}>
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
    let data = { issue_desc: this.state.issueDesc };
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
      issue_desc: this.state.issueDesc,
      closure_reason: this.state.closureReason
    };
    let newState = this.state.closureReason ? { assistReqOpen: false, issueDesc: '' } : { assistReqOpen: true };
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
                  onChangeText={issueDesc => this.setState({issueDesc})}
                  value={this.state.issueDesc}
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
  },
  selectContainer: {
    marginBottom: 10,
    borderWidth: .5,
    borderRadius: 5,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 5,
    borderColor: '#aaa',
    alignItems: 'center'
  }
});
