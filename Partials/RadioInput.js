import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

class RadioInput extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedIndex: -1
    };
  }
  render () {
    return (
      <View style={styles.container}>
        <View>
          <RadioForm
            formHorizontal={this.props.horizontal}
            animation={true}
          >
          { this.props.options.map((obj, index) => {
            let radioStyle =
              this.props.horizontal && index !== this.props.options.length - 1 ?
              { borderRightWidth: 1, borderColor: '#004E89', paddingRight: 10 } :
              {};

            return (
              <View key={index} style={styles.radioButtonWrap}>
                <RadioButton
                  isSelected={this.state.selectedIndex == index}
                  obj={obj}
                  index={index}
                  labelHorizontal={true}
                  buttonColor={'#2196f3'}
                  labelColor={'#000'}
                  buttonSize={12}
                  style={radioStyle}
                  onPress={(value, index) => {
                    this.setState({selectedIndex: index});
                    this.props.handleRadioChange(this.props.type, this.props.options[index].value);
                  }}
                />
              </View>
            )
          })}
          </RadioForm>
        </View>
      </View>
    );
  }
}

export default RadioInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  radioButtonWrap: {
    marginRight: 10
  }
});
