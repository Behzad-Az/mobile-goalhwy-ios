import React, { Component } from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  View,
  ScrollView,
  TextInput,
  Picker
} from 'react-native';

import { ImagePicker } from 'exponent';
import { FontAwesome } from '@exponent/vector-icons';

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
            <Text style={styles.modalHeader}>New Document Form:</Text>

            <View style={styles.inputCotainer}>
              <Text style={styles.inputLabel}>Document Title:</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={title => this.setState({title})}
                value={this.state.title}
                placeholder="Example: Lab 1 - Electromagnetism"
                underlineColorAndroid="#004E89"
              />
            </View>

            <View style={styles.inputCotainer}>
              <Text style={[styles.inputLabel, {marginBottom: 5}]}>Upload the Document:</Text>
              <View style={styles.dividedRow}>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Text style={styles.uploadBtn}>
                    <FontAwesome name="files-o" size={40} color="black" />
                    From Files
                  </Text>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Text style={styles.uploadBtn} onPress={this.selectPhotoTapped}>
                    <FontAwesome name="camera" size={40} color="black" />
                    From Camera
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.inputCotainer}>
              <Text style={styles.inputLabel}>Revision Comment:</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={rev_desc => this.setState({rev_desc})}
                value={this.state.rev_desc}
                placeholder="Example: New Upload"
                underlineColorAndroid="#004E89"
              />
            </View>

            <View style={styles.selectContainer}>
              <Picker
                selectedValue={this.state.type}
                onValueChange={type => this.setState({type})}
                style={{color: '#004E89'}}>
                <Picker.Item label="Document Type:" value="" />
                <Picker.Item label="Assignment / Report" value="asg_report" />
                <Picker.Item label="Lecture Note" value="lecture_note" />
                <Picker.Item label="Sample Question" value="sample_question" />
              </Picker>
            </View>

            <View style={[styles.dividedRow, {marginTop: 10}]}>
              <View style={{flex: 1}}>
                <Text onPress={() => this.setModalVisible(!this.state.modalVisible)} style={[styles.primaryBtn, {marginRight: 5}]}>
                  Submit
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text onPress={() => this.setModalVisible(!this.state.modalVisible)} style={[styles.primaryBtn, {marginLeft: 5}]}>
                  Go Back
                </Text>
              </View>
            </View>

          </ScrollView>
        </Modal>
        <Text style={styles.headerBtn} onPress={() => this.setModalVisible(true)}>
          <FontAwesome name="upload" size={19} color="white" />
        </Text>
      </View>
    );
  }
}

export default NewDocForm;

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
    fontWeight: 'bold'
  },
  dividedRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerBtn: {
    color: 'white',
    backgroundColor: '#004E89',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    marginRight: 5,
    marginLeft: 5
  },
  uploadBtn: {
    maxWidth: 80,
    maxHeight: 80,
    padding: 5,
    borderWidth: .5,
    borderRadius: 5,
    borderColor: '#bbb',
    textAlign: 'center',
    backgroundColor: '#eee'
  },
  textInput: {
    height: 40,
    paddingRight: 5,
    paddingLeft: 5
  },
  primaryBtn: {
    color: 'white',
    backgroundColor: '#004E89',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 10
  }
});
