import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { FontAwesome } from '@exponent/vector-icons';

import IndexRow from './IndexRow.js';

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      courses: [],
      updates: '',
      instId: '',
      searchResults: []
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.renderPageAfterData = this.renderPageAfterData.bind(this);
  }

  componentDidMount() {
    fetch('http://127.0.0.1:19001/api/home')
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        resJSON.dataLoaded = true;
        this.setState(resJSON);
      } else {
        console.log("Error here: IndexPage.js: ", err);
        this.setState({ dataLoaded: false, pageError: true });
      }
    })
    .catch(err => {
      console.log("Error here: IndexPage.js: ", err);
      this.setState({ dataLoaded: true, pageError: true });
    });
  }

  handleSearch(searchResults) {
    this.setState({ searchResults });
  }

  renderPageAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <View style={styles.componentContainer}>
          <Text style={{padding: 5, textAlign: 'center'}}>
            <FontAwesome name="exclamation-triangle" size={19}/> Error in loading up the page.
          </Text>
        </View>
      );
    } else if (this.state.dataLoaded) {
      return (
        <View style={styles.componentContainer}>
          <Text style={styles.header}>My Courses:</Text>
          { this.state.courses.map((course, index) => <IndexRow key={index} course={course} />) }
          { !this.state.courses[0] &&
          <Text style={styles.textBtn} onPress={() => Actions.InstPage({ instId: this.state.instId })}>
            To get updates, click here to select and subscribe to at least one course.
          </Text> }
        </View>
      );
    } else {
      return (
        <View style={styles.componentContainer}>
          <ActivityIndicator
            animating={true}
            style={{height: 80}}
            size={60}
            color="#004E89"
          />
        </View>
      );
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={{marginTop: 89, minHeight: Dimensions.get('window').height - 89, backgroundColor: '#ddd', paddingTop: 5 }}>
          { this.renderPageAfterData() }
        </View>
      </ScrollView>
    );
  }
}

export default IndexPage;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#004E89',
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  },
  componentContainer: {
    marginBottom: 10,
    backgroundColor: 'white'
  },
  textBtn: {
    padding: 5,
    textAlign: 'center',
    color: '#004E89'
  }
});
