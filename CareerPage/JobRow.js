import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import FlagModal from '../Partials/ModalSelect.js';

class RevisionRow extends React.Component {
  constructor(props) {
    super(props);
    this.flagOptions = [
      { value: 'expired link', label: 'Expired link' },
      { value: 'poor categorization', label: 'Poor categorization' },
      { value: 'other', label: 'Other' }
    ];
    this.state = {
      flagReason: ''
    };
    this.handleFlagSelect = this.handleFlagSelect.bind(this);
  }

  handleFlagSelect(flagReason) {
    fetch(`http://127.0.0.1:19001/api/flags/jobs/${this.props.job.id}`, {
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

        <View style={{position: 'absolute', right: 5, zIndex: 1}}>
          <Text style={styles.applyBtn}>Apply</Text>
          <FlagModal
            options={this.flagOptions}
            handleSelect={this.handleFlagSelect}
            btnContent={{ type: 'icon', name: 'flag'}}
            style={styles.flagBtn}
          />
        </View>

        <View style={styles.dividedRow}>
          <View style={{flex: 1}}>
            <Image
              source={require('../public/images/pdf-logo.png')}
              fadeDuration={0}
              style={{ width: 50, height: 50 }} />
          </View>
          <View style={{flex: 4}}>
            <Text style={{fontWeight: 'bold', paddingBottom: 5}}>{this.props.job.title}</Text>
            <Text style={styles.textBtn} onPress={() => Actions.CompanyPage({ companyId: this.props.job.company_id })}>
              @ {this.props.job.company}
            </Text>
            <Text style={{fontSize: 12, paddingBottom: 5}}>Job Level: {this.props.job.kind}</Text>
            <View style={styles.tagContainer}>
              { this.props.job.tags.map((tag, index) => <Text key={index} style={styles.tag}>{tag}</Text> )}
            </View>
          </View>
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
    marginBottom: 5,
    borderColor: '#004E89',
    backgroundColor: 'white'
  },
  dividedRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  applyBtn: {
    color: 'white',
    backgroundColor: '#004E89',
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 2,
    paddingBottom: 5,
    borderRadius: 5,
    textAlign: 'center',
    marginTop: 5,
    fontSize: 13,
  },
  flagBtn: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10
  },
  textBtn: {
    paddingBottom: 5,
    color: '#004E89'
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  tag: {
    backgroundColor: '#82ABCA',
    color: 'white',
    fontWeight: 'bold',
    margin: 3,
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 10,
    fontSize: 10
  }
});
