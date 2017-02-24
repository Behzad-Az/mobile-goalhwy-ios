import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';

import CourseRow from './CourseRow.js';
import ChangeInstForm from './ChangeInstForm.js';
import NewInstForm from './NewInstForm.js';
import NewCourseForm from './NewCourseForm.js';

class InstPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      currInstId: '',
      userId: '',
      instList: [],
      currInstCourses: [],
      currUserCourseIds: [],
      searchResults: [],
      filterPhrase: ''
    };
    this.loadComponentData = this.loadComponentData.bind(this);
    this.conditionData = this.conditionData.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.findInstName = this.findInstName.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.renderPageAfterData = this.renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this.loadComponentData(this.props.instId);
  }

  componentWillReceiveProps(nextProps) {
    this.loadComponentData(nextProps.instId);
  }

  loadComponentData(instId) {
    if (this.state.currInstId !== instId) {
      instId = instId || this.state.currInstId;
      fetch(`http://127.0.0.1:19001/api/institutions/${instId}`)
      .then(response => response.json())
      .then(resJSON => this.conditionData(resJSON, instId))
      .catch(err => {
        console.log("Error here: InstPage.js: ", err);
        this.setState({ dataLoaded: true, pageError: true });
      });
    }
  }

  conditionData(resJSON, instId) {
    if (resJSON) {
      resJSON.currInstId = instId;
      resJSON.currInstCourses.forEach(course => course.displayName = `${course.prefix} ${course.suffix} - ${course.course_desc}`);
      resJSON.instList.forEach(inst => {
        inst.displayName = inst.inst_short_name ? inst.inst_long_name + ` (${inst.inst_short_name})` : inst.inst_long_name;
      });
      resJSON.dataLoaded = true;
      this.setState(resJSON);
    } else {
      console.log("Error here: InstPage.js: ", err);
      this.setState({ dataLoaded: true, pageError: true });
    }
  }

  handleSearch(searchResults) {
    this.setState({ searchResults });
  }

  findInstName() {
    let inst = this.state.instList.find(inst => inst.id == this.state.currInstId);
    return inst ? inst.displayName : '';
  }

  handleFilter(text) {
    let phrase = new RegExp(this.state.filterPhrase.toLowerCase());
    return this.state.currInstCourses.filter(course => course.displayName.toLowerCase().match(phrase)).slice(0, 19);
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
      let slicedArr = this.handleFilter();
      return (
        <View style={styles.componentContainer}>
          <Text style={styles.header}>{this.findInstName()}</Text>
          <View style={styles.headerBtnContainer}>
            <ChangeInstForm instList={this.state.instList} reload={this.loadComponentData} style={styles.headerBtn} />
            <NewInstForm reload={this.loadComponentData} style={styles.headerBtn} />
          </View>
          <TextInput
            style={styles.textInput}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={filterPhrase => this.setState({ filterPhrase })}
            placeholder="Search courses here..."
          />
          { slicedArr.map(course => <CourseRow key={course.id} course={course} currUserCourseIds={this.state.currUserCourseIds} userId={this.state.userId} />) }
          { !slicedArr[0] && <NewCourseForm instId={this.state.currInstId} reload={this.loadComponentData} /> }
        </View>
      );
    } else {
      return (
        <View style={styles.componentContainer}>
          <ActivityIndicator
            animating={true}
            style={{height: 80}}
            size="large"
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

export default InstPage;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#004E89',
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  },
  textInput: {
    margin: 5,
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 2,
    paddingBottom: 2,
    borderWidth: .5,
    borderColor: '#999',
    borderRadius: 5,
    backgroundColor: 'white',
    height: 30,
    fontSize: 16
  },
  componentContainer: {
    marginBottom: 10,
  },
  headerBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: '#004E89'
  },
  headerBtn: {
    paddingLeft: 7,
    paddingRight: 7,
    textAlign: 'center',
    color: 'white',
    fontSize: 19
  }
});
