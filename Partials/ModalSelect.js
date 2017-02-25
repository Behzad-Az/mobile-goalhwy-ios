import React, { Component } from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  View,
  TouchableHighlight,
  Dimensions
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';

class ModalSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.determineBtnContent = this.determineBtnContent.bind(this);
    this.submitSelect = this.submitSelect.bind(this);
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  determineBtnContent() {
    if (this.props.btnContent.type === 'icon') {
      return <FontAwesome name={this.props.btnContent.name} style={this.props.style} onPress={() => this.setModalVisible(true)} /> ;
    } else {
      return <Text style={this.props.style} onPress={() => this.setModalVisible(true)}>{this.props.btnContent.name}</Text>
    }
  }

  submitSelect(value, label) {
    this.setModalVisible(false);
    this.props.handleSelect(value, label);
  }

  render() {
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
        >
          <TouchableHighlight style={styles.modalContainer} onPress={() => this.setModalVisible(false)}>
            <View style={styles.selectionBox}>
              { this.props.options.map((option, index) =>
                <TouchableHighlight
                  key={index}
                  style={styles.selectRow}
                  onPress={() => this.submitSelect(option.value, option.label)}>
                  <Text>{option.label}</Text>
                </TouchableHighlight>
              )}
            </View>

          </TouchableHighlight>
        </Modal>

        { this.determineBtnContent() }

      </View>
    );
  }
}

export default ModalSelect;

const vw = percentageWidth => Dimensions.get('window').width * (percentageWidth / 100);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor:'rgba(52, 52, 52, .9)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectionBox: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    width: vw(80)
  },
  selectRow: {
    padding: 10,
    borderTopWidth: 1
  }
});
