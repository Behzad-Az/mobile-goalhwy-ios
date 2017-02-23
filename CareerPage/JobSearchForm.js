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
import CheckBox from 'react-native-check-box';
import DistanceModal from '../Partials/ModalSelect.js';

class JobSearchForm extends Component {
  constructor(props) {
    super(props);
    this.userId = this.props.userId || 1;
    this.preferenceTags = ['aerospace', 'automation', 'automotive', 'design', 'electrical', 'energy', 'engineer', 'instrumentation', 'manufacturing', 'mechanical', 'military', 'mining', 'naval', 'programming', 'project-management', 'QA/QC', 'R&D', 'robotics', 'software'];
    this.distanceOptions = [
      { value: 10, label: "10km" },
      { value: 20, label: "20km" },
      { value: 30, label: "30km" },
      { value: 50, label: "50km" },
      { value: 100, label: "100km" },
      { value: 9000, label: "All" }
    ];
    this.state = {
      modalVisible: false,
      postal_code: '',
      job_distance: '',
      job_kind: [],
      job_query: [],
      tagFilterPhrase: ''
    };
    this.conditionData = this.conditionData.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.determineDistanceText = this.determineDistanceText.bind(this);
    this.handleDistanceSelect = this.handleDistanceSelect.bind(this);
    this.handleJobKind = this.handleJobKind.bind(this);
    this.moveUpTag = this.moveUpTag.bind(this);
    this.moveDownTag = this.moveDownTag.bind(this);
    this.filterPreferenceTags = this.filterPreferenceTags.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  componentDidMount() {
    fetch(`http://127.0.0.1:19001/api/users/${this.userId}`)
    .then(response => response.json())
    .then(resJSON => resJSON ? this.conditionData(resJSON) : console.log("server error, jobsSearchForm.js - 0", resJSON))
    .catch(err => console.log("Error here jobsSearchForm.js: ", err));
  }

  conditionData(resJSON) {
    let job_query = resJSON.userInfo.job_query;
    let job_kind = resJSON.userInfo.job_kind;

    job_kind = job_kind ? job_kind.split(' ') : [];

    if (job_query) {
      job_query = job_query.split(' ');
      job_query.forEach(query => {
        if (this.preferenceTags.includes(query)) {
          let index = this.preferenceTags.indexOf(query);
          this.preferenceTags.splice(index, 1);
        }
      });
    } else {
      job_query = [];
    }

    this.setState({
      postal_code: resJSON.userInfo.postal_code ? resJSON.userInfo.postal_code.toUpperCase() : '',
      job_distance: resJSON.userInfo.job_distance ? resJSON.userInfo.job_distance : '',
      job_kind: job_kind,
      job_query: job_query
    });
  }

  determineDistanceText() {
    if (this.state.job_distance) {
      return (this.state.job_distance === 9000) ? "All" : `${this.state.job_distance} km`;
    } else {
      return "select search area";
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  handleDistanceSelect(job_distance) {
    this.setState({ job_distance });
  }

  handleJobKind(value) {
    let job_kind = this.state.job_kind;
    if (this.state.job_kind.includes(value)) {
      let index = job_kind.indexOf(value);
      job_kind.splice(index, 1);
    } else {
      job_kind.push(value);
    }
    this.setState({ job_kind });
  }

  moveUpTag(selectedTag) {
    let job_query = this.state.job_query;
    job_query.push(selectedTag);
    let index = this.preferenceTags.findIndex(tag => tag === selectedTag);
    this.preferenceTags.splice(index, 1);
    let tagFilterPhrase = '';
    this.setState({ job_query, tagFilterPhrase });
  }

  moveDownTag(selectedTag) {
    let job_query = this.state.job_query;
    let index = job_query.find(tag => tag === selectedTag);
    job_query.splice(index, 1);
    this.preferenceTags.push(selectedTag);
    this.preferenceTags.sort((a,b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
    this.setState({ job_query });
  }

  filterPreferenceTags() {
    let tempArr = this.state.tagFilterPhrase ? this.preferenceTags.filter(tag => tag.includes(this.state.tagFilterPhrase)) : this.preferenceTags;
    return tempArr[0] ?
      tempArr.map((tag, index) => <Text key={index} style={styles.tag} onPress={() => this.moveUpTag(tag)}>{tag}</Text>) :
      <Text style={{paddingLeft: 5}}>No matching tags found...</Text>;
  }

  updateSearch() {
    let data = {
      type: "job",
      postal_code: this.state.postal_code,
      job_distance: parseInt(this.state.job_distance),
      job_kind: this.state.job_kind.join(' '),
      job_query: this.state.job_query.join(' ')
    };
    fetch(`http://127.0.0.1:19001/api/users/${this.state.user_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.props.reload() : console.log("Error in server - 0: ", resJSON))
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
          onRequestClose={() => this.setModalVisible(false)}
        >
          <ScrollView style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Job Search Criteria:</Text>

            <View style={styles.inputCotainer}>
              <Text style={styles.inputLabel}>Search Area:</Text>
              <View style={styles.dividedRow}>
                <View style={{flex: 1, marginRight: 5}}>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={postal_code => this.setState({postal_code})}
                    value={this.state.postal_code}
                    placeholder="Postal Code"
                    underlineColorAndroid="rgba(0,0,0,0)"
                  />
                </View>
                <View style={{flex: 1, marginLeft: 5}}>
                  <DistanceModal
                    options={this.distanceOptions}
                    handleSelect={this.handleDistanceSelect}
                    btnContent={{ type: 'text', name: this.determineDistanceText() }}
                    style={styles.selectContainer}
                  />
                  <FontAwesome name="chevron-down" style={{position: 'absolute', top: 7, right: 7, fontSize: 15, zIndex: -1}} />
                </View>
              </View>
            </View>

            <View style={styles.inputCotainer}>
              <Text style={styles.inputLabel}>Categories:</Text>
              <View style={styles.dividedRow}>
                <View style={{flex: 1, paddingRight: 5}}>
                  <CheckBox
                    style={styles.checkbox}
                    onClick={() => this.handleJobKind("summer")}
                    isChecked={ this.state.job_kind.includes("summer") }
                    leftText="Part Time"
                  />
                  <CheckBox
                    style={styles.checkbox}
                    onClick={() => this.handleJobKind("junior")}
                    isChecked={ this.state.job_kind.includes("junior") }
                    leftText="Junior"
                  />
                </View>
                <View style={{flex: 1, paddingLeft: 5}}>
                  <CheckBox
                    style={styles.checkbox}
                    onClick={() => this.handleJobKind("internship")}
                    isChecked={ this.state.job_kind.includes("internship") }
                    leftText="Intern/Coop"
                  />
                  <CheckBox
                    style={styles.checkbox}
                    onClick={() => this.handleJobKind("senior")}
                    isChecked={ this.state.job_kind.includes("senior") }
                    leftText="Senior"
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputCotainer}>
              <Text style={styles.inputLabel}>My Preferenence Tages:</Text>
              <View style={[styles.tagContainer, {borderBottomWidth: 1, borderColor: '#004E89'}]}>
                { this.state.job_query.map((tag, index) =>
                  <Text key={index} style={styles.tag} onPress={() => this.moveDownTag(tag)}>{tag}</Text>
                )}
                { !this.state.job_query[0] && <Text>Select tags from the list below...</Text> }
              </View>
              <TextInput
                style={[styles.textInput, {marginTop: 10}]}
                onChangeText={tagFilterPhrase => this.setState({tagFilterPhrase})}
                value={this.state.tagFilterPhrase}
                placeholder="search for tags"
                underlineColorAndroid="rgba(0,0,0,0)"
              />
              <View style={styles.tagContainer}>
                { this.filterPreferenceTags() }
              </View>
            </View>

            <View style={[styles.dividedRow, {marginTop: 10, marginBottom: 10}]}>
              <View style={{flex: 1}}>
                <Text onPress={this.updateSearch} style={[styles.primaryBtn, {marginRight: 5}]}>
                  Update
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text onPress={() => this.setModalVisible(false)} style={[styles.primaryBtn, {marginLeft: 5}]}>
                  Go Back
                </Text>
              </View>
            </View>

          </ScrollView>
        </Modal>

        <View style={{alignItems: 'center'}}>
          <Text style={[styles.primaryBtn, {width: 200}]} onPress={() => this.setModalVisible(true)}>
            <FontAwesome name="search" size={19} color="white" /> Job Search Criteria
          </Text>
        </View>
      </View>
    );
  }
}

export default JobSearchForm;

const styles = StyleSheet.create({
  modalContainer: {
    padding: 10
  },
  modalHeader: {
    color: '#004E89',
    fontWeight: 'bold',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#004E89'
  },
  inputCotainer: {
    marginTop: 10,
    padding: 5,
    borderWidth: .5,
    borderRadius: 5,
    borderColor: '#aaa'
  },
  selectContainer: {
    marginBottom: 5,
    borderWidth: .5,
    borderRadius: 5,
    padding: 4.5,
    borderColor: '#aaa',
    alignItems: 'center'
  },
  inputLabel: {
    color: '#004E89',
    fontWeight: 'bold',
    marginBottom: 5
  },
  dividedRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  primaryBtn: {
    color: 'white',
    backgroundColor: '#004E89',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5
  },
  textInput: {
    marginBottom: 5,
    paddingRight: 5,
    paddingLeft: 5,
    borderWidth: .5,
    borderColor: '#aaa',
    borderRadius: 5
  },
  checkbox: {
    paddingBottom: 5,
    paddingRight: 5,
    paddingLeft: 5,
    flex: 1
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingBottom: 5
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
