import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

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

        <View style={styles.dividedRow}>
          <TouchableOpacity style={{ flex: 4 }}>
            <Text style={[{backgroundColor: '#004E89'}, styles.lowerBtn]}>Download</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <FlagModal
              options={this.flagOptions}
              handleSelect={this.handleFlagSelect}
              btnContent={{ type: 'icon', name: 'flag'}}
              style={styles.flagBtn}
            />
          </View>
        </View>

        <View style={{marginBottom: 35}}>
          <Text style={styles.revTitle}>{this.props.rev.title}</Text>
          <Text style={styles.revDesc}>"{this.props.rev.rev_desc}"</Text>
        </View>

      </View>
    );
  }
}

export default RevisionRow;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderTopWidth: .5,
    borderBottomWidth: .5,
    borderColor: '#004E89',
    backgroundColor: 'white',
    marginTop: 5
  },
  revTitle: {
    fontWeight: 'bold'
  },
  revDesc: {
    fontStyle: 'italic'
  },
  dividedRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    position: 'absolute',
    bottom: 5,
    left: 5
  },
  lowerBtn: {
    color: 'white',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    margin: 5
  },
  flagBtn: {
    fontSize: 19,
    padding: 5,
    textAlign: 'center',
    margin: 5
  }
});
