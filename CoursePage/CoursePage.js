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

import TopRow from './TopRow.js';
import DocRow from './DocRow.js';

class CoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      courseInfo: {
        id: this.props.courseId
      },
      courseFeed: [],
      itemsForSale: [],
      sampleQuestions: [],
      asgReports: [],
      lectureNotes: [],
      showAsgReports: false,
      showSampleQuestions: false,
      showLectureNotes: false,
      showItemsForSale: false,
      searchResults: []
    };
    this.conditionData = this.conditionData.bind(this);
    this.loadComponentData = this.loadComponentData.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.renderSampleQuestions = this.renderSampleQuestions.bind(this);
    this.renderLectureNotes = this.renderLectureNotes.bind(this);
    this.renderItemsForSale = this.renderItemsForSale.bind(this);
    this.toggleDocView = this.toggleDocView.bind(this);
    this.renderPageAfterData = this.renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this.loadComponentData(this.state.courseInfo.id);
  }

  loadComponentData(course_id) {
    fetch(`http://127.0.0.1:19001/api/courses/${course_id}`)
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(err => {
      console.log("Error here: CoursePage.js: ", err);
      this.setState({ dataLoaded: true, pageError: true });
    });
  }

  conditionData(resJSON) {
    if (resJSON) {
      let filterDocs = (docs, docType) => docs.filter(doc => doc.type === docType);
      let newState = {
        courseInfo: resJSON.courseInfo,
        courseFeed: resJSON.courseFeed,
        itemsForSale: resJSON.itemsForSale,
        sampleQuestions: filterDocs(resJSON.docs, 'sample_question'),
        asgReports: filterDocs(resJSON.docs, 'asg_report'),
        lectureNotes: filterDocs(resJSON.docs, 'lecture_note'),
        dataLoaded: true
      };
      this.setState(newState);
    } else {
      console.log("Error here: CoursePage.js: ", err);
      this.setState({ dataLoaded: true, pageError: true });
    }
  }

  handleSearch(searchResults) {
    this.setState({ searchResults });
  }

  renderAsgReports() {
    let docCount = this.state.asgReports.length;
    let lastUpdate = docCount ? this.state.asgReports[0].revisions[0].rev_created_at.slice(0, 10) : '';
    return this.state.showAsgReports ?
      this.state.asgReports.map((doc, index) =>
        <DocRow key={index} doc={doc} courseId={this.state.courseInfo.id} />) :
        <View style={styles.summaryInfo}>
          <Text>{docCount} document(s)... last update on {lastUpdate}</Text>
        </View>
  }

  renderSampleQuestions() {
    let docCount = this.state.sampleQuestions.length;
    let lastUpdate = docCount ? this.state.sampleQuestions[0].revisions[0].rev_created_at.slice(0, 10) : '';
    return this.state.showSampleQuestions ?
      this.state.sampleQuestions.map((doc, index) =>
        <DocRow key={index} doc={doc} courseId={this.state.courseInfo.id} />) :
        <View style={styles.summaryInfo}>
          <Text>{docCount} document(s)... last update on {lastUpdate}</Text>
        </View>
  }

  renderLectureNotes() {
    let docCount = this.state.lectureNotes.length;
    let lastUpdate = docCount ? this.state.lectureNotes[0].revisions[0].rev_created_at.slice(0, 10) : '';
    return this.state.showLectureNotes ?
      this.state.lectureNotes.map((doc, index) =>
        <DocRow key={index} doc={doc} courseId={this.state.courseInfo.id} />) :
        <View style={styles.summaryInfo}>
          <Text>{docCount} document(s)... last update on {lastUpdate}</Text>
        </View>
  }

  renderItemsForSale() {
    let itemCount = this.state.itemsForSale.length;
    return this.state.showItemsForSale ?
      this.state.itemsForSale.map((item, index) =>
        <View key={index} style={styles.summaryInfo}>
          <Text>{item.title}</Text>
        </View>) :
        <View style={styles.summaryInfo}>
          <Text>{itemCount} item(s) for sale...</Text>
        </View>
  }

  toggleDocView(stateBool) {
    let obj = {};
    obj[stateBool] = !this.state[stateBool];
    this.setState(obj);
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
          <View style={styles.componentContainer}>
            <Text style={styles.header}>
              {this.state.courseInfo.short_display_name}
            </Text>
            <TopRow courseInfo={this.state.courseInfo} />
          </View>

          <View style={styles.componentContainer}>
            <Text style={styles.header} onPress={() => this.toggleDocView('showAsgReports')}>
              Assignment & Reports:
            </Text>
            <FontAwesome
              name={this.state.showAsgReports ? "chevron-up" : "chevron-down"}
              style={styles.headerStanAloneChevron}
              onPress={() => this.toggleDocView('showAsgReports')}
            />
            { this.renderAsgReports() }
          </View>

          <View style={styles.componentContainer}>
            <Text style={styles.header} onPress={() => this.toggleDocView('showSampleQuestions')}>
              Sample Questions:
            </Text>
            <FontAwesome
              name={this.state.showSampleQuestions ? "chevron-up" : "chevron-down"}
              style={styles.headerStanAloneChevron}
              onPress={() => this.toggleDocView('showSampleQuestions')}
            />
            { this.renderSampleQuestions() }
          </View>

          <View style={styles.componentContainer}>
            <Text style={styles.header} onPress={() => this.toggleDocView('showLectureNotes')}>
              Lecture Notes:
            </Text>
            <FontAwesome
              name={this.state.showLectureNotes ? "chevron-up" : "chevron-down"}
              style={styles.headerStanAloneChevron}
              onPress={() => this.toggleDocView('showLectureNotes')}
            />
            { this.renderLectureNotes() }
          </View>

          <View style={styles.componentContainer}>
            <Text style={styles.header} onPress={() => this.toggleDocView('showItemsForSale')}>
              Items for Sale or Trade:
            </Text>
            <FontAwesome
              name={this.state.showItemsForSale ? "chevron-up" : "chevron-down"}
              style={styles.headerStanAloneChevron}
              onPress={() => this.toggleDocView('showItemsForSale')}
            />
            { this.renderItemsForSale() }
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

export default CoursePage;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#004E89',
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
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
  headerStanAloneChevron: {
    textAlign: 'center',
    fontSize: 19,
    color: 'white',
    textAlign: 'right',
    position: 'absolute',
    top: 5,
    right: 12,
    backgroundColor: '#004E89'
  }
});
