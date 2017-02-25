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

class SelectInstForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      filterPhrase: ''
    };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.filterInstList = this.filterInstList.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  filterInstList() {
    let phrase = new RegExp(this.state.filterPhrase.toLowerCase());
    return this.props.instList.filter(inst => inst.label.toLowerCase().match(phrase));
  }

  handleSelect(instId, instDisplayName) {
    this.props.selectInst(instId, instDisplayName);
    this.setModalVisible(false);
  }

  render() {
    let currInstList = this.filterInstList();
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
        >
          <ScrollView style={styles.modalContainer}>

            <FormNavBar formTitle="Select Institution:" backFcn={this.setModalVisible} />

            <View style={styles.bodyContainer}>
              <TextInput
                style={styles.searchInput}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={filterPhrase => this.setState({ filterPhrase })}
                placeholder="Search institutions here..." />

              { currInstList.map(inst =>
                <Text key={inst.value} style={styles.instRowText} onPress={() => this.handleSelect(inst.value, inst.label)}>
                  {inst.label}
                </Text>
              )}

              <View style={styles.primaryBtnContainer}>
                <Text style={styles.primaryBtn} onPress={() => this.setModalVisible(false)}>
                  Cancel
                </Text>
              </View>

            </View>

          </ScrollView>
        </Modal>

        <Text style={this.props.style} onPress={() => this.setModalVisible(true)}>
          {this.props.btnContent}
        </Text>

      </View>
    );
  }
}

export default SelectInstForm;

const styles = StyleSheet.create({
  modalContainer: {
    paddingTop: 25
  },
  bodyContainer: {
    padding: 10
  },
  instRowText: {
    marginBottom: 5,
    backgroundColor: '#eee',
    borderWidth: .5,
    padding: 5
  },
  searchInput: {
    marginBottom: 5,
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 2,
    paddingBottom: 2,
    borderWidth: .5,
    borderColor: '#aaa',
    borderRadius: 5,
    minHeight: 30,
    fontSize: 16
  },
  primaryBtnContainer: {
    backgroundColor: '#004E89',
    borderRadius: 5,
    borderColor: '#004E89',
    borderWidth: .5,
    padding: 5
  },
  primaryBtn: {
    color: 'white',
    textAlign: 'center'
  }
});
