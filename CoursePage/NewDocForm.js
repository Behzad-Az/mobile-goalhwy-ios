import React, { Component } from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  View,
  ScrollView,
  TextInput,
  Picker,
  TouchableHighlight
} from 'react-native';

import { ImagePicker } from 'exponent';
import { FontAwesome } from '@exponent/vector-icons';

import FormNavBar from '../Navbar/FormNavBar.js';

class NewDocForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      title: '',
      type: '',
      rev_desc: 'New Upload',
      file_path: ''
    };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    this.handleNewDocPost = this.handleNewDocPost.bind(this);
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  validateForm() {
    return this.state.title &&
           this.state.rev_desc &&
           this.state.file_path &&
           this.state.type
  }

  selectPhotoTapped = async() => {

    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4,3]
    });

    // let pickerResult = await ImagePicker.launchImageLibraryAsync({
    //   allowsEditing: true,
    //   aspect: [4,3]
    // });
  }

  handleNewDocPost() {
    // $.ajax({
    //   method: 'POST',
    //   url: `/api/courses/${this.props.courseId}`,
    //   data: this.state,
    //   success: response => {
    //     if (response) {
    //       this.reactAlert.showAlert("New document saved", "info");
    //       HandleModal('new-doc-form');
    //       this.props.reload(this.props.courseId);
    //     } else {
    //       this.reactAlert.showAlert("error in uploading document", "error");
    //     }
    //   }
    // });
  }

  render() {
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
        >
          <ScrollView style={styles.modalContainer}>

            <FormNavBar formTitle="New Document Form:" backFcn={this.setModalVisible} />

            <View style={styles.bodyContainer}>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Document Title:</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={title => this.setState({title})}
                  value={this.state.title}
                  placeholder="Example: Lab 1 - Electromagnetism"
                  underlineColorAndroid="#004E89"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, {marginBottom: 5}]}>Upload the Document:</Text>
                <View style={styles.dividedRow}>

                  <View style={{flex: 1, alignItems: 'center'}}>
                    <View style={styles.uploadBtnContainer}>
                      <FontAwesome name="files-o" size={40} style={styles.uploadBtn} />
                      <Text style={styles.uploadBtn} onPress={this.selectPhotoTapped}>
                        From Files
                      </Text>
                    </View>
                  </View>

                  <View style={{flex: 1, alignItems: 'center'}}>
                    <View style={styles.uploadBtnContainer}>
                      <FontAwesome name="camera" size={40} style={styles.uploadBtn} />
                      <Text style={styles.uploadBtn} onPress={this.selectPhotoTapped}>
                        From Camera
                      </Text>
                    </View>
                  </View>

                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Revision Comment:</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={rev_desc => this.setState({rev_desc})}
                  value={this.state.rev_desc}
                  placeholder="Example: New Upload"
                  underlineColorAndroid="#004E89"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Document Type:</Text>
                <Picker
                  selectedValue={this.state.type}
                  onValueChange={type => this.setState({type})}
                  itemStyle={{fontSize: 16}}>
                  <Picker.Item label="-" value="" />
                  <Picker.Item label="Assignment / Report" value="asg_report" />
                  <Picker.Item label="Lecture Note" value="lecture_note" />
                  <Picker.Item label="Sample Question" value="sample_question" />
                </Picker>
              </View>

              <View style={styles.dividedRow}>
                <View style={[styles.primaryBtnContainer, {marginRight: 5}]}>
                  <Text style={styles.primaryBtn} onPress={() => this.setModalVisible(false)}>
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

        <TouchableHighlight
          onPress={() => this.setModalVisible(true)}
          style={styles.headerBtnContainer}>
          <FontAwesome name="upload" style={styles.headerBtn} />
        </TouchableHighlight>

      </View>
    );
  }
}

export default NewDocForm;

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
    justifyContent: 'space-between',
    marginBottom: 5
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
  headerBtnContainer: {
    padding: 5,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 5,
    backgroundColor: '#004E89'
  },
  headerBtn: {
    textAlign: 'center',
    fontSize: 19,
    color: 'white'
  },
  uploadBtnContainer: {
    width: 110,
    maxHeight: 80,
    padding: 5,
    borderWidth: .5,
    borderRadius: 5,
    borderColor: '#bbb',
    backgroundColor: '#eee'
  },
  uploadBtn: {
    textAlign: 'center',
    paddingTop: 5
  }
});
