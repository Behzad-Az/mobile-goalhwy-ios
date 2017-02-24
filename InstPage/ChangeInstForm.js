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

class ChangeInstForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      filterPhrase: ''
    };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.filterInstList = this.filterInstList.bind(this);
    this.handleInstSelect = this.handleInstSelect.bind(this);
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  filterInstList() {
    let phrase = new RegExp(this.state.filterPhrase.toLowerCase());
    return this.props.instList.filter(inst => inst.displayName.toLowerCase().match(phrase));
  }

  handleInstSelect(instId) {
    this.props.reload(instId);
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
                <Text key={inst.id} style={styles.instRowText} onPress={() => this.handleInstSelect(inst.id)}>
                  {inst.displayName}
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

        <FontAwesome name="list" style={this.props.style} onPress={() => this.setModalVisible(true)} />

      </View>
    );
  }
}

export default ChangeInstForm;

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
    minHeight: 25,
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
