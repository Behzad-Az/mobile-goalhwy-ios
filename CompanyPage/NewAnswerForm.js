import React, { Component } from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  View,
  ScrollView,
  TextInput
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';
import FormNavBar from '../Navbar/FormNavBar.js';
import OutcomeModal from '../Partials/ModalSelect.js';

class NewQuestionForm extends Component {
  constructor(props) {
    super(props);
    this.outcomeOptions = [
      { value: 'Got the job', label: 'Got the job' },
      { value: 'Unsuccessful', label: 'Unsuccessful' },
      { value: 'Unknown', label: 'Do not know' },
      { value: 'Unknown', label: 'Rather not share' }
    ];
    this.state = {
      modalVisible: false,
      answerBoxHeight: 0,
      answer: '',
      outcome: ''
    };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.handleNewInterviewQuestion = this.handleNewInterviewQuestion.bind(this);
    this.handleOutcomeSelect = this.handleOutcomeSelect.bind(this);
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  handleNewInterviewQuestion() {
    let data = {
      answer: this.state.answer,
      outcome: this.state.outcome
    };
    fetch(`http://127.0.0.1:19001/api/companies/${this.props.companyId}/questions/${this.props.question.id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.props.reload() : console.log("Error in server, NewQuestionForm.js: ", resJSON))
    .catch(err => console.log("Error here in NewQuestionForm.js: ", err));
    this.setModalVisible(false);
  }

  handleOutcomeSelect(outcome) {
    this.setState({ outcome });
  }

  render() {
    let title = this.props.question.question.length > 35 ? `${this.props.question.question.slice(0, 35)}... ` : this.props.question.question;
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
        >
          <ScrollView style={styles.modalContainer}>

            <FormNavBar
              formTitle={`${title} - New Answer`}
              backFcn={this.setModalVisible} />

            <View style={styles.bodyContainer}>

              <View style={[styles.inputContainer, {minHeight: 200}]}>
                <Text style={styles.inputLabel}>What was your answer?</Text>
                <TextInput
                  style={[styles.textInput, {height: this.state.answerBoxHeight}]}
                  multiline
                  onChangeText={answer => this.setState({answer})}
                  value={this.state.answer}
                  placeholder="Summarize your answer here (optional)"
                  underlineColorAndroid="rgba(0,0,0,0)"
                  onContentSizeChange={event => {
                    this.setState({answerBoxHeight: event.nativeEvent.contentSize.height});
                  }}
                />
              </View>

              <View>
                <OutcomeModal
                  options={this.outcomeOptions}
                  handleSelect={this.handleOutcomeSelect}
                  btnContent={{ type: 'text', name: this.state.outcome || 'What was the outcome?' }}
                  style={[styles.selectContainer, {color: this.state.outcome ? 'black' : '#004E89', fontWeight: this.state.outcome ? 'normal' : 'bold'}]}
                />
                <FontAwesome name="chevron-down" style={{position: 'absolute', top: 5, right: 5, fontSize: 15}} />
              </View>

              <View style={styles.dividedRow}>
                <View style={[styles.primaryBtnContainer, {marginRight: 5}]}>
                  <Text style={styles.primaryBtn} onPress={this.handleNewInterviewQuestion}>
                    Submit
                  </Text>
                </View>
                <View style={[styles.primaryBtnContainer, {marginLeft: 5}]}>
                  <Text style={styles.primaryBtn} onPress={() => this.setModalVisible(false)}>
                    Cancel
                  </Text>
                </View>
              </View>

            </View>

          </ScrollView>
        </Modal>

        <Text style={styles.textBtn} onPress={() => this.setModalVisible(true)}>Post New Answer</Text>

      </View>
    );
  }
}

export default NewQuestionForm;

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
  },
  textBtn: {
    fontSize: 14,
    paddingTop: 2.5,
    paddingBottom: 2.5,
    paddingRight: 25,
    color: '#004E89'
  }
});
