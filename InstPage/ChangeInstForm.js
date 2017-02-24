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

            <View style={styles.backBtnContainer}>
              <Text style={styles.backBtnText}>Back</Text>
            </View>

            <Text style={styles.modalHeader}>Select Institution:</Text>
            <TextInput
              style={styles.searchInput}
              onChangeText={filterPhrase => this.setState({ filterPhrase })}
              placeholder="Search institutions here..." />

            { currInstList.map(inst =>
              <Text key={inst.id} style={styles.instRowText} onPress={() => this.handleInstSelect(inst.id)}>
                {inst.displayName}
              </Text>
            )}

            <View style={styles.dividedRow}>
              <View style={{flex: 1}}>
                <Text style={[styles.primaryBtn, {marginRight: 5}]}>
                  Select
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

        <FontAwesome name="list" style={this.props.style} onPress={() => this.setModalVisible(true)} />

      </View>
    );
  }
}

export default ChangeInstForm;

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
    height: 25,
    fontSize: 16
  },
  backBtnContainer: {
    width: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#004E89',
    padding: 5,
    backgroundColor: '#004E89',
    marginBottom: 10
  },
  backBtnText: {
    color: 'white',
    textAlign: 'center'
  }
});
