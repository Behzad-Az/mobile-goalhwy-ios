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
import CourseYearSelect from '../Partials/ModalSelect.js';

class NewCourseForm extends Component {
  constructor(props) {
    super(props);
    this.courseYearOptions = [
      { value: 1, label: 1 }, { value: 2, label: 2 }, { value: 3, label: 3 },
      { value: 4, label: 4 }, { value: 5, label: 5 }, { value: 6, label: 6 }
    ];
    this.state = {
      prefix: '',
      suffix: '',
      course_desc: '',
      course_year: '',
      modalVisible: false
    };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.handleCourseYearSelect = this.handleCourseYearSelect.bind(this);
    this.handleNewCoursePost = this.handleNewCoursePost.bind(this);
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  handleCourseYearSelect(course_year) {
    this.setState({ course_year });
  }

  handleNewCoursePost() {
    let data = {
      ...this.state,
      inst_id: this.props.instId
    };
    delete data.modalVisible;
    fetch('http://127.0.0.1:19001/api/courses', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.props.reload() : console.log("Error in server, NewCourseForm.js: ", resJSON))
    .catch(err => console.log("Error here in NewCourseForm.js: ", err));
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
            <Text style={styles.modalHeader}>New Course:</Text>

            <View style={styles.inputCotainer}>
              <Text style={styles.inputLabel}>Prefix:</Text>
              <TextInput
                style={styles.textInput}
                autoCapitalize="characters"
                onChangeText={prefix => this.setState({prefix})}
                value={this.state.prefix}
                placeholder="Example: MATH"
                underlineColorAndroid="rgba(0,0,0,0)"
              />
            </View>

            <View style={styles.inputCotainer}>
              <Text style={styles.inputLabel}>Suffix:</Text>
              <TextInput
                style={styles.textInput}
                autoCapitalize="characters"
                onChangeText={suffix => this.setState({suffix})}
                value={this.state.suffix}
                placeholder="Example: 101"
                underlineColorAndroid="rgba(0,0,0,0)"
              />
            </View>

            <View style={styles.inputCotainer}>
              <Text style={styles.inputLabel}>Title:</Text>
              <TextInput
                style={styles.textInput}
                autoCapitalize="sentences"
                onChangeText={course_desc => this.setState({course_desc})}
                value={this.state.course_desc}
                placeholder="Example: Introducion to calculus"
                underlineColorAndroid="rgba(0,0,0,0)"
              />
            </View>

            <View>
              <CourseYearSelect
                options={this.courseYearOptions}
                handleSelect={this.handleCourseYearSelect}
                btnContent={{ type: 'text', name: this.state.course_year || 'Select academic year' }}
                style={[styles.selectContainer, {color: this.state.course_year ? 'black' : '#004E89', fontWeight: this.state.course_year ? 'normal' : 'bold'}]}
              />
              <FontAwesome name="chevron-down" style={{position: 'absolute', top: 7, right: 7, fontSize: 15, zIndex: -1}} />
            </View>

            <View style={styles.dividedRow}>
              <View style={{flex: 1}}>
                <Text style={[styles.primaryBtn, {marginRight: 5}]} onPress={this.handleNewCoursePost}>
                  Submit
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.primaryBtn, {marginLeft: 5}]} onPress={() => this.setModalVisible(false)}>
                  Go Back
                </Text>
              </View>
            </View>

          </ScrollView>
        </Modal>

        <Text style={styles.textBtn} onPress={() => this.setModalVisible(true)}>
          No matching course could be found. Click to add a new course and invite your peers.
        </Text>

      </View>
    );
  }
}

export default NewCourseForm;

const styles = StyleSheet.create({
  modalContainer: {
    padding: 10
  },
  modalHeader: {
    color: '#004E89',
    fontWeight: 'bold',
    paddingBottom: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#004E89'
  },
  inputCotainer: {
    marginBottom: 10,
    padding: 5,
    borderWidth: .5,
    borderRadius: 5,
    borderColor: '#aaa'
  },
  inputLabel: {
    color: '#004E89',
    fontWeight: 'bold',
    paddingTop: 2.5,
    paddingRight: 5,
    paddingLeft: 5,
    paddingBottom: 5
  },
  dividedRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  primaryBtn: {
    color: 'white',
    backgroundColor: '#004E89',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center'
  },
  textInput: {
    paddingRight: 5,
    paddingLeft: 5
  },
  textBtn: {
    padding: 5,
    textAlign: 'center',
    color: '#004E89'
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
