import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';
import FlagModal from '../Partials/ModalSelect.js';

class RevisionRow extends React.Component {
  constructor(props) {
    super(props);
    this.flagOptions = [
      { value: 'inappropriate content', label: 'Inappropriate content' },
      { value: 'does not belong to this course', label: 'Does not belong to this course' },
      { value: 'corrupted file or unreadable', label: 'Corrupted file or unreadable' },
      { value: 'other', label: 'Other' }
    ];
    this.state = {
      flagReason: ''
    };
    this.handleFlagSelect = this.handleFlagSelect.bind(this);
  }

  handleFlagSelect(flagReason) {
    fetch(`http://127.0.0.1:19001/api/flags/revisions/${this.props.rev.id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ flagReason }),
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.setState({ flagReason }) : console.log("Error in server - 0: ", resJSON))
    .catch(err => console.log("Error here: ", err));
  }

  render() {
    return (
      <View style={styles.container}>

        <Text style={styles.revTitle}>{this.props.rev.title}</Text>
        <Text style={styles.revDesc}>"{this.props.rev.rev_desc}"</Text>

        <View style={styles.btnRow}>
          <FontAwesome name="download" style={[styles.actionBtn, {fontSize: 30}]} />
          <FlagModal
              options={this.flagOptions}
              handleSelect={this.handleFlagSelect}
              btnContent={{ type: 'icon', name: 'flag'}}
              style={[styles.actionBtn, {fontSize: 13, paddingBottom: 5}]}
            />
        </View>

      </View>
    );
  }
}

export default RevisionRow;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderTopWidth: .5,
    borderBottomWidth: .5,
    borderColor: '#004E89',
    backgroundColor: 'white',
    marginTop: 5
  },
  revTitle: {
    fontWeight: 'bold',
    paddingBottom: 5
  },
  revDesc: {
    fontStyle: 'italic',
    paddingBottom: 5
  },
  actionBtn: {
    paddingRight: 15,
    textAlign: 'center'
  },
  btnRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  }
});
