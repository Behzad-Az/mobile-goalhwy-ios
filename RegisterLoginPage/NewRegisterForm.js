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
import SelectInstModal from './SelectInst.js';
import FormNavBar from '../Navbar/FormNavBar.js';

class NewRegisterForm extends Component {
  constructor(props) {
    super(props);
    this.userYearOptions = [
      { value: 1, label: 'Year 1'}, { value: 2, label: 'Year 2'}, { value: 3, label: 'Year 3'}, { value: 4, label: 'Year 4'}, { value: 5, label: 'Year 5'}, { value: 6, label: 'Year 6'}
    ];
    this.state = {
      pageError: false,
      modalVisible: false,
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      instId: '',
      instDisplayName: '',
      progId: '',
      progDisplayName: '',
      userYear: '',
      instProgDropDownList: [],
      usernameAvaialble: false,
      emailAvaialble: false
    };
    this.conditionData = this.conditionData.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.selectInst = this.selectInst.bind(this);
    this.selectProgram = this.selectProgram.bind(this);
    this.selectUserYear = this.selectUserYear.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  componentDidMount() {
    fetch('http://127.0.0.1:19001/api/institutions_programs')
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(err => {
      console.log("Error here: NewRegisterForm.js: ", err);
      this.setState({ pageError: true });
    });
  }

  conditionData(resJSON) {
    if (resJSON) {
      let instProgDropDownList = resJSON.map(inst => {
        let value = inst.id;
        let label = inst.inst_display_name;
        let programs = inst.programs.map(prog => {
          let value = prog.prog_id;
          let label = prog.prog_display_name;
          return { value, label };
        });
        return {value, label, programs};
      });
      this.setState({ instProgDropDownList });
    } else {
      console.log("Error here: NewRegisterForm.js: ", err);
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

  handleRegister() {
    let data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm,
      instId: this.state.instId,
      progId: this.state.progId,
      userYear: this.state.userYear
    };
    fetch('http://127.0.0.1:19001/api/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.props.setMessage("Registration successfull. Please login.") : console.log("Error in server NewRegisterForm.js - 0: ", resJSON))
    .catch(err => console.log("Error here: NewRegisterForm.js ", err));
    this.setModalVisible(false);
  }

  render() {
    let programList = this.state.instId ?
                      this.state.instProgDropDownList.find(item => item.value === this.state.instId).programs :
                      [];
    return (
      <View style={{flex: 1}}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
        >
          <ScrollView style={styles.modalContainer}>

            <FormNavBar formTitle="New User Registration:" backFcn={this.setModalVisible} />

            <View style={styles.bodyContainer}>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username:</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={username => this.setState({username})}
                  value={this.state.username}
                  placeholder="Enter username"
                  underlineColorAndroid="rgba(0,0,0,0)"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email:</Text>
                <TextInput
                  style={styles.textInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={email => this.setState({email})}
                  value={this.state.email}
                  placeholder="Enter email"
                  underlineColorAndroid="rgba(0,0,0,0)"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password:</Text>
                <TextInput
                  style={styles.textInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={password => this.setState({password})}
                  value={this.state.password}
                  placeholder="Enter password"
                  underlineColorAndroid="rgba(0,0,0,0)"
                  secureTextEntry={true}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password:</Text>
                <TextInput
                  style={styles.textInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={passwordConfirm => this.setState({passwordConfirm})}
                  value={this.state.passwordConfirm}
                  placeholder="Confirm password"
                  underlineColorAndroid="rgba(0,0,0,0)"
                  secureTextEntry={true}
                />
              </View>

              <View>
                <SelectInstModal
                  instList={this.state.instProgDropDownList}
                  selectInst={this.selectInst}
                  btnContent={this.state.instDisplayName || 'Primary Institution:'}
                  style={[styles.selectContainer, {color: this.state.instDisplayName ? 'black' : '#004E89', fontWeight: this.state.instDisplayName ? 'normal' : 'bold'}]}
                />
                <FontAwesome name="chevron-down" style={{position: 'absolute', top: 7, right: 7, fontSize: 15}} />
              </View>

              <View>
                <ModalSelect
                  options={this.state.instDisplayName ? programList : [{ value: '', label: 'Select institution first.' }]}
                  handleSelect={this.selectProgram}
                  btnContent={{ type: 'text', name: this.state.progDisplayName || 'Primary Program:' }}
                  style={[styles.selectContainer, {color: this.state.progDisplayName ? 'black' : '#004E89', fontWeight: this.state.progDisplayName ? 'normal' : 'bold'}]}
                />
                <FontAwesome name="chevron-down" style={{position: 'absolute', top: 7, right: 7, fontSize: 15}} />
              </View>

              <View>
                <ModalSelect
                  options={this.userYearOptions}
                  handleSelect={this.selectUserYear}
                  btnContent={{ type: 'text', name: `Year ${this.state.userYear}` || 'Academic Year:' }}
                  style={[styles.selectContainer, {color: this.state.userYear ? 'black' : '#004E89', fontWeight: this.state.userYear ? 'normal' : 'bold'}]}
                />
                <FontAwesome name="chevron-down" style={{position: 'absolute', top: 7, right: 7, fontSize: 15}} />
              </View>

              <View style={styles.dividedRow}>
                <View style={[styles.primaryBtnContainer, {marginRight: 5}]}>
                  <Text style={styles.primaryBtn} onPress={this.handleRegister}>
                    Register
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

        <Text style={this.props.style} onPress={() => this.setModalVisible(true)}>Register</Text>

      </View>
    );
  }
}

export default NewRegisterForm;

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
