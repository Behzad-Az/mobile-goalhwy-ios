import React from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  View,
  ScrollView,
  TextInput,
  DatePickerAndroid,
  TouchableHighlight
} from 'react-native';

import RadioInput from '../Partials/RadioInput.js';
import AndroidDatePicker from '../Partials/AndroidDatePicker';
import AutoCompleteTextInput from '../Partials/AutoCompleteTextInput.js';

import { FontAwesome } from '@exponent/vector-icons';

class NewCourseReviewForm extends React.Component {
  constructor(props) {
    super(props);
    this.workLoadOptions = [{label: 'Too Much', value: 1}, {label: 'Too Little', value: 2}, {label: 'Fair', value: 3}];
    this.evalOptions = [{label: 'Too Hard', value: 1}, {label: 'Too Easy', value: 2}, {label: 'Fair', value: 3}];
    this.profOptions = [{label: 'Not Good', value: 1}, {label: 'Below Average', value: 2}, {label: 'Average', value: 3}, {label: 'Above Average', value: 4}, {label: 'Excellent!', value: 5}];
    this.state = {
      modalVisible: false,
      start_year: '',
      start_month: '',
      workload_rating: '',
      fairness_rating: '',
      prof_rating: '',
      overall_rating: '',
      review_desc: '',
      prof_name: '',
      descBoxHeight: 150
    };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleProfAutoSuggest = this.handleProfAutoSuggest.bind(this);
    this.handleNewReview = this.handleNewReview.bind(this);
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  handleRadioChange(type, value) {
    let obj = {};
    obj[type] = value;
    this.setState(obj)
  }

  handleProfAutoSuggest(prof_name) {
    this.setState({ prof_name });
  }

  showPicker = async (stateKey, options) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    try {
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({ start_year: year, start_month: months[month] });
      }
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  };

  handleNewReview() {
    let data = { ...this.state };
    delete data.modalVisible;
    delete data.descBoxHeight;

    fetch(`http://127.0.0.1:19001/api/courses/${this.props.courseId}/reviews`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.props.reload() : console.log("Error in server - 0: NewCourseReviewForm.js: ", resJSON))
    .catch(err => console.log("Error here: NewCourseReviewForm.js: ", err));
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

            <Text style={styles.modalHeader}>New Course Review:</Text>

            <View style={styles.inputCotainer}>
              <TouchableHighlight
                hitSlop={{top: 50, bottom: 50, left: 50, right: 50}}
                style={{position: 'absolute', right: 10, top: 10}}
                onPress={this.showPicker.bind(this, 'spinner', {date: new Date(), minDate: new Date(2007, 1, 1),
                maxDate: new Date(), mode: 'spinner'})}>
                <Text><FontAwesome name="calendar" size={30} color="black" /></Text>
              </TouchableHighlight>
              <Text style={styles.inputLabel}>When did you start?</Text>
              <Text style={styles.textInput}>{this.state.start_month} {this.state.start_year}</Text>
            </View>

            <View style={styles.inputCotainer}>
              <Text style={styles.inputLabel}>How was the workload?</Text>
              <RadioInput handleRadioChange={this.handleRadioChange} type="workload_rating" options={this.workLoadOptions} horizontal />
            </View>

            <View style={styles.inputCotainer}>
              <Text style={styles.inputLabel}>How was the evaluation?</Text>
              <RadioInput handleRadioChange={this.handleRadioChange} type="fairness_rating" options={this.evalOptions} horizontal />
            </View>

            <View style={styles.inputCotainer}>
              <Text style={styles.inputLabel}>How was the instructor?</Text>
              <RadioInput handleRadioChange={this.handleRadioChange} type="prof_rating" options={this.profOptions} />
            </View>

            <View style={styles.inputCotainer}>
              <Text style={styles.inputLabel}>Overall satisfaction with the course?</Text>
              <View style={styles.dividedRow}>
                { [1, 2, 3, 4, 5].map(num =>
                  <View key={num} style={{flex: 1}}>
                    <Text style={{textAlign: 'center'}} onPress={() => this.setState({ overall_rating: num })}>
                      <FontAwesome name={this.state.overall_rating >= num ? "star" : "star-o"} size={25} />
                    </Text>
                    <Text style={{textAlign: 'center'}}>{num}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.inputCotainer, {minHeight: 150}]}>
              <Text style={styles.inputLabel}>Instructor's name (optional):</Text>
              <AutoCompleteTextInput
                placeholder="We'll auto-suggest some results :)"
                data={this.props.profs}
                handleChange={this.handleProfAutoSuggest}
              />
            </View>

            <View style={[styles.inputCotainer, {minHeight: 150}]}>
              <Text style={styles.inputLabel}>Feel free to ellaborate (optional):</Text>
              <TextInput
                style={[styles.textInput, {height: this.state.descBoxHeight}]}
                multiline
                onChangeText={review_desc => this.setState({review_desc})}
                value={this.state.review_desc}
                placeholder="Provide context for your review (optional)..."
                underlineColorAndroid="rgba(0,0,0,0)"
                onContentSizeChange={event => {
                  this.setState({descBoxHeight: event.nativeEvent.contentSize.height});
                }}
              />
            </View>

            <View style={[styles.dividedRow, {marginTop: 10, marginBottom: 10}]}>
              <View style={{flex: 1}}>
                <Text onPress={this.handleNewReview} style={[styles.primaryBtn, {marginRight: 5}]}>
                  Submit
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

        <FontAwesome name="plus" style={this.props.style} onPress={() => this.setModalVisible(true)} />

      </View>

    );
  }

}

export default NewCourseReviewForm;

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
    borderWidth: .5,
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 10,
    borderColor: '#aaa'
  },
  inputLabel: {
    color: '#004E89',
    fontWeight: 'bold',
    marginBottom: 10
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
    marginBottom: 10
  },
  textInput: {
    paddingRight: 5,
    paddingLeft: 5
  }
});

