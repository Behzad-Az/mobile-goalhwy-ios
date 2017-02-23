import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';
import FlagModal from '../Partials/ModalSelect.js';

class AnswerRow extends React.Component {
  constructor(props) {
    super(props);
    this.flagOptions = [
      { value: 'inappropriate content', label: 'Unrelated' },
      { value: 'other', label: 'Other' }
    ];
    this.state = {
      flagReason: ''
    };
    this.handleFlagSelect = this.handleFlagSelect.bind(this);
  }

  handleFlagSelect(flagReason) {
    fetch(`http://127.0.0.1:19001/api/flags/interview_answers/${this.props.ans.id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ flagReason }),
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.setState({ flagReason }) : console.log("Error in server - 0: ", resJSON))
    .catch(err => console.log("Error here AnswerRow.js, handleFlagSubmit: ", err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Answer #{this.props.index} | Outcome: {this.props.ans.outcome}</Text>
        <Text style={styles.metaInfo}>Posted On: {this.props.ans.answer_created_at.slice(0, 10)}</Text>
        <Text style={styles.answerText}>{this.props.ans.answer}</Text>
        <View style={styles.flagBtn}>
          <FlagModal
            options={this.flagOptions}
            handleSelect={this.handleFlagSelect}
            btnContent={{ type: 'icon', name: 'flag'}}
            style={{fontSize: 14, color: 'black'}}
          />
        </View>
      </View>
    );
  }
}

export default AnswerRow;

const styles = StyleSheet.create({
  container: {
    borderTopWidth: .5,
    padding: 2.5,
    borderColor: '#004E89',
  },
  headerText: {
    padding: 2.5,
    fontWeight: 'bold'
  },
  metaInfo: {
    padding: 2.5,
    fontSize: 11
  },
  answerText: {
    padding: 2.5
  },
  flagBtn: {
    position: 'absolute',
    top: 7,
    right: 7
  }
});
