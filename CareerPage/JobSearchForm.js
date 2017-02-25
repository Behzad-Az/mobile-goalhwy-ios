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
import CheckBox from 'react-native-check-box';
import DistanceModal from '../Partials/ModalSelect.js';

class JobSearchForm extends Component {
  constructor(props) {
    super(props);
    this.preferenceTags = ['aerospace', 'automation', 'automotive', 'design', 'electrical', 'energy', 'engineer', 'instrumentation', 'manufacturing', 'mechanical', 'military', 'mining', 'naval', 'programming', 'project-management', 'QA/QC', 'R&D', 'robotics', 'software'];
    this.distanceOptions = [
      { value: 10, label: "Within 10km" },
      { value: 20, label: "Within 20km" },
      { value: 30, label: "Within 30km" },
      { value: 50, label: "Within 50km" },
      { value: 100, label: "Within 100km" },
      { value: 9000, label: "Anywhere" }
    ];
    this.state = {
      modalVisible: false,
      postalCode: '',
      jobDistance: '',
      jobDistanceDisplayName: '',
      jobKind: [],
      jobQuery: [],
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
    this.handleUpdateSearch = this.handleUpdateSearch.bind(this);
  }

  componentDidMount() {
    fetch('http://127.0.0.1:19001/api/users/currentuser')
    .then(response => response.json())
    .then(resJSON => resJSON ? this.conditionData(resJSON) : console.log("server error, jobsSearchForm.js - 0", resJSON))
    .catch(err => console.log("Error here jobsSearchForm.js: ", err));
  }

  conditionData(resJSON) {
    let jobQuery = resJSON.userInfo.job_query;
    let jobKind = resJSON.userInfo.job_kind;

    jobKind = jobKind ? jobKind.split(' ') : [];

    if (jobQuery) {
      jobQuery = jobQuery.split(' ');
      jobQuery.forEach(query => {
        if (this.preferenceTags.includes(query)) {
          let index = this.preferenceTags.indexOf(query);
          this.preferenceTags.splice(index, 1);
        }
      });
    } else {
      jobQuery = [];
    }

    this.setState({
      postalCode: resJSON.userInfo.postal_code ? resJSON.userInfo.postal_code.toUpperCase() : '',
      jobDistance: resJSON.userInfo.job_distance ? resJSON.userInfo.job_distance : '',
      jobKind,
      jobQuery,
      jobDistanceDisplayName: this.determineDistanceText(resJSON.userInfo.job_distance)
    });
  }

  determineDistanceText(distance) {
    if (distance) {
      return (distance >= 1000) ? "Anywhere" : `Within ${distance} km`;
    } else {
      return '';
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  handleDistanceSelect(jobDistance, jobDistanceDisplayName) {
    this.setState({ jobDistance, jobDistanceDisplayName });
  }

  handleJobKind(value) {
    let jobKind = this.state.jobKind;
    if (this.state.jobKind.includes(value)) {
      let index = jobKind.indexOf(value);
      jobKind.splice(index, 1);
    } else {
      jobKind.push(value);
    }
    this.setState({ jobKind });
  }

  moveUpTag(selectedTag) {
    let jobQuery = this.state.jobQuery;
    jobQuery.push(selectedTag);
    let index = this.preferenceTags.findIndex(tag => tag === selectedTag);
    this.preferenceTags.splice(index, 1);
    let tagFilterPhrase = '';
    this.setState({ jobQuery, tagFilterPhrase });
  }

  moveDownTag(selectedTag) {
    let jobQuery = this.state.jobQuery;
    let index = jobQuery.find(tag => tag === selectedTag);
    jobQuery.splice(index, 1);
    this.preferenceTags.push(selectedTag);
    this.preferenceTags.sort((a,b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
    this.setState({ jobQuery });
  }

  filterPreferenceTags() {
    let tempArr = this.state.tagFilterPhrase ? this.preferenceTags.filter(tag => tag.includes(this.state.tagFilterPhrase)) : this.preferenceTags;
    return tempArr[0] ?
      tempArr.map((tag, index) =>
      <View key={index} style={styles.tagContainer}>
        <Text style={styles.tagText} onPress={() => this.moveUpTag(tag)}>{tag}</Text>
      </View> ) :
      <Text style={{padding: 5}}>No matching tags found...</Text>;
  }

  handleUpdateSearch() {
    let data = {
      type: "job",
      postal_code: this.state.postalCode,
      job_distance: parseInt(this.state.jobDistance),
      job_kind: this.state.jobKind.join(' '),
      job_query: this.state.jobQuery.join(' ')
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

            <FormNavBar formTitle="Job Search Criteria:" backFcn={this.setModalVisible} />

            <View style={styles.bodyContainer}>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Search Area:</Text>
                <View style={styles.dividedRow}>
                  <View style={{flex: 3, marginRight: 5}}>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={postalCode => this.setState({postalCode})}
                      value={this.state.postalCode}
                      placeholder="Postal Code: e.g. A1A1B1"
                      underlineColorAndroid="rgba(0,0,0,0)"
                    />
                  </View>
                  <View style={{flex: 2, marginLeft: 5}}>
                    <DistanceModal
                      options={this.distanceOptions}
                      handleSelect={this.handleDistanceSelect}
                      btnContent={{ type: 'text', name: this.state.jobDistanceDisplayName || 'Search Range' }}
                      style={styles.selectContainer}
                    />
                    <FontAwesome name="chevron-down" style={{position: 'absolute', top: 5, right: 5, fontSize: 15}} />
                  </View>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Categories:</Text>
                <View style={styles.dividedRow}>
                  <View style={{flex: 1, paddingRight: 5}}>
                    <CheckBox
                      style={styles.checkbox}
                      onClick={() => this.handleJobKind("summer")}
                      isChecked={ this.state.jobKind.includes("summer") }
                      leftText="Part Time"
                    />
                    <CheckBox
                      style={styles.checkbox}
                      onClick={() => this.handleJobKind("junior")}
                      isChecked={ this.state.jobKind.includes("junior") }
                      leftText="Junior"
                    />
                  </View>
                  <View style={{flex: 1, paddingLeft: 5}}>
                    <CheckBox
                      style={styles.checkbox}
                      onClick={() => this.handleJobKind("internship")}
                      isChecked={ this.state.jobKind.includes("internship") }
                      leftText="Intern/Coop"
                    />
                    <CheckBox
                      style={styles.checkbox}
                      onClick={() => this.handleJobKind("senior")}
                      isChecked={ this.state.jobKind.includes("senior") }
                      leftText="Senior"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>My Preferenence Tages:</Text>
                <View style={[styles.tagsContainer, {borderBottomWidth: 1, borderColor: '#004E89'}]}>
                  { this.state.jobQuery.map((tag, index) =>
                    <View key={index} style={styles.tagContainer}>
                      <Text style={styles.tagText} onPress={() => this.moveDownTag(tag)}>{tag}</Text>
                    </View>
                  )}
                  { !this.state.jobQuery[0] && <Text style={{padding: 5}}>Select tags from the list below...</Text> }
                </View>
                <TextInput
                  style={styles.searchInput}
                  onChangeText={tagFilterPhrase => this.setState({tagFilterPhrase})}
                  value={this.state.tagFilterPhrase}
                  placeholder="search for tags"
                  underlineColorAndroid="rgba(0,0,0,0)"
                />
                <View style={styles.tagsContainer}>
                  { this.filterPreferenceTags() }
                </View>
              </View>

              <View style={styles.dividedRow}>
                <View style={[styles.primaryBtnContainer, {marginRight: 5}]}>
                  <Text style={styles.primaryBtn} onPress={this.handleUpdateSearch}>
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

          </ScrollView>
        </Modal>

        <View style={{flex: 1, alignItems: 'center', marginBottom: 5}}>
          <View style={{width: 200, backgroundColor: '#004E89', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5, padding: 5}}>
            <FontAwesome name="search" size={19} color="white" onPress={() => this.setModalVisible(true)} />
            <Text style={{color: 'white', fontWeight: 'bold', paddingLeft: 10}} onPress={() => this.setModalVisible(true)}>Job Search Criteria</Text>
          </View>
        </View>

      </View>
    );
  }
}

export default JobSearchForm;

const styles = StyleSheet.create({
  modalContainer: {
    paddingTop: 25
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
    minHeight: 30,
    paddingTop: 2.5,
    fontSize: 16
  },
  dividedRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
   searchInput: {
    marginTop: 5,
    marginBottom: 5,
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 2,
    paddingBottom: 2,
    borderWidth: .5,
    borderColor: '#999',
    borderRadius: 5,
    backgroundColor: 'white',
    minHeight: 30,
    fontSize: 16
  },
  checkbox: {
    paddingBottom: 5,
    paddingRight: 5,
    paddingLeft: 5,
    flex: 1
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingBottom: 5
  },
  tagContainer: {
    backgroundColor: '#82ABCA',
    margin: 3,
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 10
  },
  tagText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
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
    marginBottom: 5,
    borderWidth: .5,
    borderRadius: 5,
    padding: 4.5,
    borderColor: '#aaa',
    alignItems: 'center'
  }
});
