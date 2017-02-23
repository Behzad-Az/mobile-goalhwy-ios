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
import ModalSelect from '../Partials/ModalSelect.js';
import SelectInstModal from '../RegisterLoginPage/SelectInst.js';

class EditProfileForm extends Component {
  constructor(props) {
    super(props);
    this.userYearOptions = [
      { value: 1, label: 1}, { value: 2, label: 2}, { value: 3, label: 3}, { value: 4, label: 4}, { value: 5, label: 5}, { value: 6, label: 6}
    ];
    this.state = {
      pageError: false,
      modalVisible: false,
      userId: this.props.userInfo.userId,
      username: this.props.userInfo.username,
      email: this.props.userInfo.email,
      instId: this.props.userInfo.instId,
      instDisplayName: this.props.userInfo.instDisplayName,
      progId: this.props.userInfo.progId,
      progDisplayName: this.props.userInfo.progDisplayName,
      userYear: this.props.userInfo.user_year,
      instProgDropDownList: [],
      usernameAvaialble: false,
      emailAvaialble: false
    };
    this.conditionData = this.conditionData.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.selectInst = this.selectInst.bind(this);
    this.selectProgram = this.selectProgram.bind(this);
    this.selectUserYear = this.selectUserYear.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  componentDidMount() {
    fetch('http://127.0.0.1:19001/api/institutions_programs')
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(err => {
      console.log("Error here: EditProfileForm.js: ", err);
      this.setState({ pageError: true });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.userInfo);
  }

  conditionData(resJSON) {
    if (resJSON) {
      let instProgDropDownList = resJSON.map(inst => {
        let value = inst.id;
        let label = inst.inst_short_name ? inst.inst_long_name + ` (${inst.inst_short_name})` : inst.inst_long_name;
        let programs = inst.programs.map(program => {
          let value = program.prog_id;
          let label = program.prog_short_name ? program.prog_long_name + ` (${program.prog_short_name})` : program.prog_long_name;
          return { value, label };
        });
        return {value, label, programs};
      });
      this.setState({ instProgDropDownList });
    } else {
      console.log("Error here: EditProfileForm.js: ", err);
      this.setState({ pageError: true });
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  selectInst(instId, instDisplayName) {
    if (instId !== this.state.instId) {
      this.setState({ instId, instDisplayName, progId: '', progDisplayName: '' });
    }
  }

  selectProgram(progId, progDisplayName) {
    this.setState({ progId, progDisplayName });
  }

  selectUserYear(userYear) {
    this.setState({ userYear });
  }

  updateProfile() {
    let data = {
      type: "profile",
      username: this.state.username.toLowerCase(),
      email: this.state.email.toLowerCase(),
      userYear: this.state.userYear,
      instId: this.state.instId,
      progId: this.state.progId
    };
    fetch(`http://127.0.0.1:19001/api/users/${this.state.userId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.props.reload() : this.props.setMessage("Could not update profile."))
    .catch(err => this.props.setMessage("Could not update profile."));
    this.setModalVisible(false);
  }

  render() {
    let programList = this.state.instProgDropDownList[0] && this.state.instId ?
                      this.state.instProgDropDownList.find(item => item.value === this.state.instId).programs :
                      [];
    return (
      <View style={{position: 'absolute', top: 10, right: 10}}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
        >
          <ScrollView style={styles.modalContainer}>
            <Text style={styles.modalHeader}>New User:</Text>

            <View style={styles.inputCotainer}>
              <Text style={styles.inputLabel}>Username:</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={username => this.setState({username})}
                value={this.state.username}
                placeholder="Enter username"
                underlineColorAndroid="rgba(0,0,0,0)"
              />
            </View>

            <View style={styles.inputCotainer}>
              <Text style={styles.inputLabel}>Email:</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={email => this.setState({email})}
                value={this.state.email}
                placeholder="Enter email"
                underlineColorAndroid="rgba(0,0,0,0)"
                keyboardType="email-address"
              />
            </View>

            <View>
              <SelectInstModal
                instList={this.state.instProgDropDownList}
                selectInst={this.selectInst}
                btnContent={this.state.instDisplayName || 'Primary Institution:'}
                style={[styles.selectContainer, {color: this.state.instDisplayName ? 'black' : '#004E89', fontWeight: this.state.instDisplayName ? 'normal' : 'bold'}]}
              />
              <FontAwesome name="chevron-down" style={{position: 'absolute', top: 7, right: 7, fontSize: 15, zIndex: -1}} />
            </View>

            <View>
              <ModalSelect
                options={programList}
                handleSelect={this.selectProgram}
                btnContent={{ type: 'text', name: this.state.progDisplayName || 'Primary Program:' }}
                style={[styles.selectContainer, {color: this.state.progDisplayName ? 'black' : '#004E89', fontWeight: this.state.progDisplayName ? 'normal' : 'bold'}]}
              />
              <FontAwesome name="chevron-down" style={{position: 'absolute', top: 7, right: 7, fontSize: 15, zIndex: -1}} />
            </View>

            <View>
              <ModalSelect
                options={this.userYearOptions}
                handleSelect={this.selectUserYear}
                btnContent={{ type: 'text', name: this.state.userYear || 'Academic Year:' }}
                style={[styles.selectContainer, {color: this.state.userYear ? 'black' : '#004E89', fontWeight: this.state.userYear ? 'normal' : 'bold'}]}
              />
              <FontAwesome name="chevron-down" style={{position: 'absolute', top: 7, right: 7, fontSize: 15, zIndex: -1}} />
            </View>

            <View style={styles.dividedRow}>
              <View style={{flex: 1}}>
                <Text style={[styles.primaryBtn, {marginRight: 5}]} onPress={this.updateProfile}>
                  Update
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

        <Text style={this.props.style} onPress={() => this.setModalVisible(true)}>Edit</Text>

      </View>
    );
  }
}

export default EditProfileForm;

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
