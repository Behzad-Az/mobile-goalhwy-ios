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
import RevisionRow from './RevisionRow.js';

class DocPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      courseInfo: {
        id: this.props.courseId
      },
      doc: {
        id: this.props.docId,
        revisions: []
      },
      searchResults: []
    };
    this.loadComponentData = this.loadComponentData.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.renderPageAfterData = this.renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this.loadComponentData(this.state.courseInfo.id, this.state.doc.id);
  }

  loadComponentData(courseId, docId) {
    fetch(`http://127.0.0.1:19001/api/courses/${courseId}/docs/${docId}`)
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        resJSON.dataLoaded = true;
        this.setState(resJSON)
      } else {
        console.log("Error here: DocPage.js: ", err);
        this.setState({ dataLoaded: true, pageError: true });
      }
    })
    .catch(err => {
      console.log("Error here: DocPage.js: ", err);
      this.setState({ dataLoaded: true, pageError: true });
    });
  }

  handleSearch(searchResults) {
    this.setState({ searchResults });
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
            <Text style={styles.header}>{this.state.doc.title}</Text>
            <TopRow courseInfo={this.state.courseInfo} />
          </View>
          <View style={styles.componentContainer}>
            <Text style={styles.header}>Revisions:</Text>
            { this.state.doc.revisions.map((rev, index) => <RevisionRow key={index} rev={rev} />) }
            { !this.state.doc.revisions[0] && <Text style={{padding: 5}}>No revision could be found...</Text> }
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

export default DocPage;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#004E89',
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  },
  componentContainer: {
    marginBottom: 10
  }
});
