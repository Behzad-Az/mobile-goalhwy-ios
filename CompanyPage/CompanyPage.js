import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import JobRow from '../CareerPage/JobRow.js';
import QaRow from './QaRow.js';
import NewQuestionForm from './NewQuestionForm.js';

import { FontAwesome } from '@exponent/vector-icons';

class CompanyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      companyInfo: {},
      questions: [],
      jobs: [],
      showJobs: false,
      showQas: false,
      searchResults: []
    };
    this.loadComponentData = this.loadComponentData.bind(this);
    this.conditionData = this.conditionData.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.renderJobs = this.renderJobs.bind(this);
    this.renderQas = this.renderQas.bind(this);
    this.renderPageAfterData = this.renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this.loadComponentData();
  }

  loadComponentData() {
    fetch(`http://127.0.0.1:19001/api/companies/${this.props.companyId}`)
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(err => {
      console.log("Error here: CompanyPage.js: ", err);
      this.setState({ dataLoaded: true, pageError: true });
    });
  }

  conditionData(resJSON) {
    if (resJSON) {
      let jobs = resJSON.jobs.map(data => {
        return {
          ...data._source.pin,
          tags: data._source.pin.search_text.split(' ')
        };
      });
      let state = {
        ...resJSON,
        jobs: jobs,
        dataLoaded: true
      };
      this.setState(state);
    } else {
      console.log("Error here: CompanyPage.js: ", err);
      this.setState({ dataLoaded: true, pageError: true });
    }
  }

  handleSearch(searchResults) {
    this.setState({ searchResults });
  }

  renderJobs() {
    if (this.state.showJobs) {
      return (
        <View style={{marginTop: 5}}>
          { this.state.jobs.map((job, index) => <JobRow key={index} job={job} /> ) }
        </View>
      );
    } else {
      let jobCount = this.state.jobs.length;
      return <Text style={styles.summaryInfo}>{jobCount} open positions...</Text>
    }
  }

  renderQas() {
    let qaCount = this.state.questions.length;
    return this.state.showQas ?
      this.state.questions.map((qa, index) => <QaRow key={index} qa={qa} reload={this.loadComponentData} companyId={this.props.companyId} /> ):
      <Text style={styles.summaryInfo}>{qaCount} interview questions...</Text>
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
        <View>
          <View style={styles.componentContainer}>
            <Text style={styles.header}>{this.state.companyInfo.name}</Text>
          </View>
          <View style={styles.componentContainer}>
            <Text style={styles.header} onPress={() => this.setState({showJobs: !this.state.showJobs})}>Current Job Openings:</Text>
            <FontAwesome
              name={this.state.showJobs ? "chevron-up" : "chevron-down"}
              style={styles.headerStanAloneChevron}
              onPress={() => this.setState({showJobs: !this.state.showJobs})} />
            { this.renderJobs() }
          </View>
          <View style={styles.componentContainer}>
            <Text style={styles.header} onPress={() => this.setState({showQas: !this.state.showQas})}>Interview Questions / Answers:</Text>
            <View style={styles.headerBtnContainer}>
              <NewQuestionForm companyId={this.props.companyId} reload={this.loadComponentData} style={styles.headerBtn} />
              <FontAwesome
                name={this.state.showQas ? "chevron-up" : "chevron-down"}
                style={styles.headerBtn}
                onPress={() => this.setState({ showQas: !this.state.showQas })} />
            </View>
            { this.renderQas() }
          </View>
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

export default CompanyPage;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#004E89',
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  },
  headerBtn: {
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'center',
    color: 'white',
    fontSize: 19
  },
  summaryInfo: {
    padding: 5,
    backgroundColor: 'white',
    borderBottomWidth: .5,
    borderColor: '#004E89'
  },
  componentContainer: {
    marginBottom: 10
  },
  headerBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    position: 'absolute',
    right: 5,
    top: 5
  },
  headerBtn: {
    paddingLeft: 7,
    paddingRight: 7,
    textAlign: 'center',
    color: 'white',
    fontSize: 19
  },
  headerStanAloneChevron: {
    textAlign: 'center',
    fontSize: 19,
    color: 'white',
    textAlign: 'right',
    position: 'absolute',
    top: 5,
    right: 12
  }
});
