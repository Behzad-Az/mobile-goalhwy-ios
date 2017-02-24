import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

class FormNavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.formTitle}>{this.props.formTitle}</Text>
        <View style={styles.backBtnContainer}>
          <Text style={styles.backBtnText} onPress={() => this.props.backFcn(false)}>Back</Text>
        </View>
      </View>
    );
  }
}

export default FormNavBar;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#004E89',
  },
  backBtnContainer: {
    position: 'absolute',
    top: 5,
    left: 10,
    width: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white'
  },
  backBtnText: {
    color: '#004E89',
    textAlign: 'center',
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 5,
    paddingLeft: 5
  },
  formTitle: {
    color: 'white',
    paddingLeft: 70,
    paddingTop: 3,
    paddingBottom: 3,
    fontWeight: 'bold'
  }
});
