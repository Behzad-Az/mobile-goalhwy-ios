import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { FontAwesome } from '@exponent/vector-icons';

class SearhBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ""
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.conditionData = this.conditionData.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  handleSearch(query) {
    if (query.length > 2) {
      fetch('http://127.0.0.1:19001/api/searchbar', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
      .then(response => response.json())
      .then(resJSON => resJSON ? this.conditionData(resJSON) : console.log("Error in server - 0: ", resJSON))
      .catch(err => console.log("Error here: ", err));
    } else {
      this.props.handleSearch([]);
    }
    this.setState({ query });
  }

  redirect(page, props) {
    this.props.handleSearch([]);
    this.setState({ query: "" });
    Actions[page](props);
  }

  conditionData(resJSON) {
    let searchResults = [];
    if (resJSON.length) {
      resJSON.forEach((result, index) => {
        switch (result._type) {
          case "document":
            searchResults.push(
              <TouchableHighlight key={index} onPress={() => this.redirect('DocPage', { courseId: result._source.course_id, docId: result._source.id })}>
                <View style={styles.searchRowContainer}>
                  <Text style={styles.searchRowText}><FontAwesome name="file-text" size={19} color="#004E89" /></Text>
                  <Text style={styles.searchRowText}>{result._source.course_name}</Text>
                  <Text style={styles.searchRowText}><FontAwesome name="arrow-right" size={19} color="#004E89" /></Text>
                  <Text style={styles.searchRowText}>{result._source.title}</Text>
                </View>
              </TouchableHighlight>
              );
            break;
          case "course":
            searchResults.push(
              <TouchableHighlight key={index} onPress={() => this.redirect('CoursePage', { courseId: result._source.id })}>
                <View style={styles.searchRowContainer}>
                  <Text style={styles.searchRowText}><FontAwesome name="users" size={19} color="#004E89" /></Text>
                  <Text style={styles.searchRowText}>{result._source.title}</Text>
                </View>
              </TouchableHighlight> );
            break;
          case "institution":
            searchResults.push(
              <TouchableHighlight key={index} onPress={() => this.redirect('InstPage', { instId: result._source.id })}>
                <View style={styles.searchRowContainer}>
                  <Text style={styles.searchRowText}><FontAwesome name="graduation-cap" size={19} color="#004E89" /></Text>
                  <Text style={styles.searchRowText}>{result._source.inst_name}</Text>
                </View>
              </TouchableHighlight> );
            break;
          case "company":
            searchResults.push(
              <TouchableHighlight key={index} onPress={() => this.redirect('CompanyPage', { companyId: result._source.id })}>
                <View style={styles.searchRowContainer}>
                  <Text style={styles.searchRowText}><FontAwesome name="briefcase" size={19} color="#004E89" /></Text>
                  <Text style={styles.searchRowText}>{result._source.company_name}</Text>
                </View>
              </TouchableHighlight> );
            break;
        };
      });
    } else {
      searchResults.push(<Text key={1}>No results matching...</Text>);
    }
    this.props.handleSearch(searchResults);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={query => this.handleSearch(query)}
          value={this.state.query}
          placeholder="search courses, documents and employers here"
          underlineColorAndroid="rgba(0,0,0,0)"
        />
      </View>
    );
  }
}

export default SearhBar;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 29,
    paddingBottom: 5,
    backgroundColor: '#004E89'
  },
  textInput: {
    height: 25,
    backgroundColor: 'white',
    paddingRight: 5,
    paddingLeft: 5,
    borderRadius: 5,
    fontSize: 13
  },
  searchRowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5
  },
  searchRowText: {
    paddingRight: 5,
    color: '#004E89',
    fontSize: 13
  }
});
