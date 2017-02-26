import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import SortModal from '../Partials/ModalSelect.js';
import TopRow from './TopRow.js';
import CourseReviewRow from './CourseReviewRow.js';
import NewCoureReviewForm from './NewCourseReviewForm.js';

import { FontAwesome } from '@exponent/vector-icons';

class CourseReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.sortOptions = [
      { value: 'date_new_to_old', label: 'Date - New to Old' },
      { value: 'date_old_to_new', label: 'Date - Old to New' },
      { value: 'rating_high_to_low', label: 'Rating - High to Low' },
      { value: 'rating_low_to_high', label: 'Rating - Low to High' },
      { value: 'instructor_name', label: 'Instructor Name' }
    ];
    this.state = {
      dataLoaded: false,
      pageError: false,
      courseInfo: {},
      courseReviews: [],
      sortedBy: '',
      profs: [],
      searchResults: []
    };
    this.loadComponentData = this.loadComponentData.bind(this);
    this.sortReviews = this.sortReviews.bind(this);
    this.renderPageAfterData = this.renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this.loadComponentData();
  }

  loadComponentData() {
    fetch(`http://127.0.0.1:19001/api/courses/${this.props.courseId}/reviews`)
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        resJSON.dataLoaded = true;
        this.setState(resJSON);
      } else {
        console.log("Error here: CourseReviewPage.js: ", err);
        this.setState({ dataLoaded: true, pageError: true });
      }
    })
    .catch(err => {
      console.log("Error here: CourseReviewPage.js: ", err);
      this.setState({ dataLoaded: true, pageError: true });
    });
  }

  sortReviews(sortedBy) {
    switch(sortedBy) {
      case "date_new_to_old":
        this.state.courseReviews.sort((a, b) => a.review_created_at < b.review_created_at ? 1 : -1);
        break;
      case "date_old_to_new":
        this.state.courseReviews.sort((a, b) => a.review_created_at > b.review_created_at ? 1 : -1);
        break;
      case "rating_high_to_low":
        this.state.courseReviews.sort((a, b) => a.overall_rating < b.overall_rating ? 1 : -1);
        break;
      case "rating_low_to_high":
        this.state.courseReviews.sort((a, b) => a.overall_rating > b.overall_rating ? 1 : -1);
        break;
      case "instructor_name":
        this.state.courseReviews.sort((a, b) => a.name > b.name ? 1 : -1);
        break;
      default:
        break;
    };
    this.setState({ sortedBy });
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
          <TopRow courseReviews={this.state.courseReviews} />
          <View style={styles.componentContainer}>
            <Text style={styles.header}>Reviews:</Text>

            <View style={styles.headerBtnContainer}>
              <SortModal
                options={this.sortOptions}
                handleSelect={this.sortReviews}
                btnContent={{ type: 'icon', name: 'sort-amount-desc'}}
                style={styles.headerBtn}
              />
              <NewCoureReviewForm
                profs={this.state.profs.map(prof => prof.name)}
                courseId={this.state.courseInfo.id}
                reload={this.loadComponentData}
                style={styles.headerBtn}
              />
            </View>

            { this.state.courseReviews.map((review, index) => <CourseReviewRow key={index} review={review} />) }
          </View>
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

export default CourseReviewPage;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#004E89',
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
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
