import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';

import AnswerRow from './AnswerRow.js';
import NewAnswerForm from './NewAnswerForm.js';
import FlagModal from '../Partials/ModalSelect.js';

class QaRow extends React.Component {
  constructor(props) {
    super(props);
    this.flagOptions = [
      { value: 'inappropriate content', label: 'Unrelated' },
      { value: 'other', label: 'Other' }
    ];
    this.state = {
      flagReason: '',
      showAnswers: false
    };
    this.handleFlagSelect = this.handleFlagSelect.bind(this);
  }

  handleFlagSelect(flagReason) {
    fetch(`http://127.0.0.1:19001/api/flags/interview_questions/${this.props.qa.id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ flagReason }),
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.setState({ flagReason }) : console.log("Error in server - 0: ", resJSON))
    .catch(err => console.log("Error here QaRow.js, handleFlagSubmit: ", err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.questionText}>{this.props.qa.question}</Text>
        <Text style={styles.metaInfo}>Posted On: {this.props.qa.question_created_at.slice(0, 10)}</Text>
        <Text style={styles.metaInfo}>Like Count: {this.props.qa.like_count}</Text>
        <View style={styles.btnContainer}>
          <Text style={styles.textBtn} onPress={() => this.setState({ showAnswers: !this.state.showAnswers })}>{this.state.showAnswers ? "Hide Answers" : "Show Answers"}</Text>

          <NewAnswerForm question={this.props.qa} reload={this.props.reload} companyId={this.props.companyId} />

          <FlagModal
            options={this.flagOptions}
            handleSelect={this.handleFlagSelect}
            btnContent={{ type: 'icon', name: 'flag'}}
            style={[styles.textBtn, {color: 'black'}]}
          />

        </View>
        { this.state.showAnswers && this.props.qa.answers.map((ans, index) => <AnswerRow key={index} ans={ans} index={index + 1} /> )}
        { this.state.showAnswers && !this.props.qa.answers[0] && <Text style={{paddingLeft: 2.5}}>No answers posted yet...</Text> }
      </View>
    );
  }
}

export default QaRow;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 5,
    borderTopWidth: .5,
    borderBottomWidth: .5,
    borderColor: '#004E89',
    marginTop: 5
  },
  questionText: {
    padding: 2.5,
    fontWeight: 'bold'
  },
  metaInfo: {
    padding: 2.5,
    fontSize: 11
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 2.5
  },
  textBtn: {
    fontSize: 14,
    paddingTop: 2.5,
    paddingBottom: 2.5,
    paddingRight: 25,
    color: '#004E89'
  }
});
