import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';

import JobRow from './JobRow.js';
import JobSearchForm from './JobSearchForm.js';

class CareerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      jobs: []
    };
    this.conditionData = this.conditionData.bind(this);
    this.loadComponentData = this.loadComponentData.bind(this);
    this.renderPageAfterData = this.renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this.loadComponentData();
  }

  loadComponentData() {
    fetch('http://127.0.0.1:19001/api/users/currentuser/jobs')
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(err => {
      console.log("Error here: CareerPage.js: ", err);
      this.setState({ dataLoaded: true, pageError: true });
    });
  }

  conditionData(resJSON) {
    if (resJSON) {
      let jobs = resJSON.map(data => {
        return { ...data._source.pin, tags: data._source.pin.search_text.split(' ') };
      });
      this.setState({ jobs, dataLoaded: true });
    } else {
      this.setState({ dataLoaded: true, pageError: true });
    }
  }

  renderPageAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <Text style={{padding: 5, textAlign: 'center'}}>
          <FontAwesome name="exclamation-triangle" size={19}/> Error in loading up the page.
        </Text>
      );
    } else if (this.state.dataLoaded) {
      return (
        <View>
          <JobSearchForm reload={this.loadComponentData} />
          <View style={styles.componentContainer}>
            <Text style={styles.header}>Open Positions:</Text>
            { this.state.jobs.map((job, index) => <JobRow key={index} job={job} />) }
            { !this.state.jobs[0] && <Text style={{padding: 5, textAlign: 'center'}}>No jobs matching your search. Revise your search criteria.</Text> }
          </View>
        </View>
      );
    } else {
      return (
        <ActivityIndicator
          animating={true}
          style={{height: 80}}
          size="large"
          color="#004E89"
        />
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

export default CareerPage;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#004E89',
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5
  },
  componentContainer: {
    marginBottom: 10
  }
});
