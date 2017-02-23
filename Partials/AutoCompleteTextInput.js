import Autocomplete from 'react-native-autocomplete-input';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

class AutoCompleteTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      selected: false
    };
    this.filterData = this.filterData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
  }

  filterData() {
    if (this.state.query && !this.state.selected ) {
      const regex = new RegExp(`${this.state.query.trim()}`, 'i');
      return this.props.data.filter(phrase => phrase.search(regex) >= 0).slice(0, 2);
    } else {
      return [];
    }
  }

  handleChange(query) {
    this.setState({ query, selected: false });
    this.props.handleChange(query);
  }

  handleSelection(query) {
    this.setState({ query, selected: true });
    this.props.handleChange(query);
  }

  render() {
    const data = this.filterData();
    return (
      <View style={styles.container}>
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.autocompleteContainer}
          inputContainerStyle={styles.inputContainerStyle}
          data={data}
          placeholder={this.props.placeholder}
          defaultValue={this.state.query}
          onChangeText={query => this.handleChange(query)}
          renderItem={query => (
            <TouchableOpacity onPress={() => this.handleSelection(query)}>
              <Text style={styles.itemText}>
                {query}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
};

export default AutoCompleteTextInput;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputContainerStyle: {
    paddingRight: 5,
    paddingLeft: 5,
    borderRadius: 5
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  itemText: {
    fontSize: 15,
    padding: 5,
    borderBottomWidth: .5,
    borderColor: '#ddd'
  }
});
