import React, { Component } from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  View,
  ScrollView,
  TextInput,
  PickerIOS
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';
import FormNavBar from '../Navbar/FormNavBar.js';

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
      courseDesc: '',
      courseYear: '',
      modalVisible: false
    };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.handleNewCoursePost = this.handleNewCoursePost.bind(this);
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  handleNewCoursePost() {
    let data = {
      prefix: this.state.prefix,
      suffix: this.state.suffix,
      course_desc: this.state.courseDesc,
      course_year: this.state.courseYear,
      inst_id: this.props.instId
    };
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
    let PickerItem = PickerIOS.Item;
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
        >
          <ScrollView style={styles.modalContainer}>

            <FormNavBar formTitle="New Course:" backFcn={this.setModalVisible} />

            <View style={styles.bodyContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Prefix:</Text>
                <TextInput
                  style={styles.textInput}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  onChangeText={prefix => this.setState({prefix})}
                  value={this.state.prefix}
                  placeholder="Example: MATH"
                  underlineColorAndroid="rgba(0,0,0,0)"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Suffix:</Text>
                <TextInput
                  style={styles.textInput}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  onChangeText={suffix => this.setState({suffix})}
                  value={this.state.suffix}
                  placeholder="Example: 101"
                  underlineColorAndroid="rgba(0,0,0,0)"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Title:</Text>
                <TextInput
                  style={styles.textInput}
                  autoCapitalize="sentences"
                  onChangeText={courseDesc => this.setState({courseDesc})}
                  value={this.state.courseDesc}
                  placeholder="Example: Introducion to calculus"
                  underlineColorAndroid="rgba(0,0,0,0)"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Select Academic Year:</Text>
                <PickerIOS
                  selectedValue={this.state.courseYear}
                  itemStyle={{fontSize: 16}}
                  onValueChange={courseYear => this.setState({ courseYear })}>
                  { this.courseYearOptions.map((courseYear, index) =>
                    <PickerItem
                      key={index}
                      value={courseYear.value}
                      label={`Year ${courseYear.label}`}
                    />)}
                </PickerIOS>
              </View>

              <View style={styles.dividedRow}>
                <View style={[styles.primaryBtnContainer, {marginRight: 5}]}>
                  <Text style={styles.primaryBtn} onPress={this.handleNewCoursePost}>
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
    paddingTop: 25
  },
  bodyContainer: {
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
  textInput: {
    paddingRight: 5,
    paddingLeft: 5,
    height: 25
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
