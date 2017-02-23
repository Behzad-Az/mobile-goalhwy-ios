var React = require('react');
var ReactNative = require('react-native');
var {
  DatePickerAndroid,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} = ReactNative;

var UIExplorerBlock = require('UIExplorerBlock');
var UIExplorerPage = require('UIExplorerPage');

class AndroidDatePicker extends React.Component {
  static title = 'DatePickerAndroid';
  static description = 'Standard Android date picker dialog';

  state = {
    maxDate: new Date(),
    spinnerText: 'pick a date',
    maxText: 'pick a date, no later than today',
  };

  showPicker = async (stateKey, options) => {
    try {
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
        newState[stateKey + 'Text'] = 'dismissed';
      } else {
        var date = new Date(year, month, day);
        newState[stateKey + 'Text'] = date.toLocaleDateString();
        newState[stateKey + 'Date'] = date;
      }
      this.setState(newState);
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  };

  render() {
    return (
      <UIExplorerPage title="DatePickerAndroid">

        <UIExplorerBlock title="Simple spinner date picker">
          <TouchableWithoutFeedback
            onPress={this.showPicker.bind(this, 'spinner', {date: this.state.maxDate, minDate: new Date(2007, 1, 1),
              maxDate: new Date(), mode: 'spinner'})}>
            <Text style={styles.text}>{this.state.spinnerText}</Text>
          </TouchableWithoutFeedback>
        </UIExplorerBlock>

        <UIExplorerBlock title="Date picker with maxDate">
          <TouchableWithoutFeedback
            onPress={this.showPicker.bind(this, 'max', {
              date: this.state.maxDate,
              minDate: new Date(2007, 1, 1),
              maxDate: new Date(),
            })}>
            <Text style={styles.text}>{this.state.maxText}</Text>
          </TouchableWithoutFeedback>
        </UIExplorerBlock>

      </UIExplorerPage>
    );
  }
}

var styles = StyleSheet.create({
  text: {
    color: 'black',
  },
});

export default AndroidDatePicker;
