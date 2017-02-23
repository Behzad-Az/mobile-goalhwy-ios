import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';

class CourseReviewRow extends React.Component {
  constructor(props) {
    super(props);
    this.decodeWorkload = this.decodeWorkload.bind(this);
    this.decodeFairness = this.decodeFairness.bind(this);
    this.decodeProf = this.decodeProf.bind(this);
    this.getStarName = this.getStarName.bind(this);
  }

  decodeWorkload(value) {
    switch(value) {
      case 1:
        return "Too little";
      case 2:
        return "Too much";
      case 3:
        return "Fair";
      default:
        return "unknown";
    };
  }

  decodeFairness(value) {
    switch(value) {
      case 1:
        return "Too easy";
      case 2:
        return "Too difficult";
      case 3:
        return "Fair";
      default:
        return "unknown";
    };
  }

  decodeProf(value) {
    switch(value) {
      case 1:
        return "Not good";
      case 2:
        return "Below average";
      case 3:
        return "Average";
      case 4:
        return "Above average";
      case 5:
        return "Excellent!";
      default:
        return "unknown";
    };
  }

  getStarName(rating, number) {
    if (parseInt(rating) >= number) return "star";
    else if (parseInt(rating) > number - 1) return "star-half-full";
    else return "star-o";
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.dividedRow}>

          <View style={{flex: 1, padding: 5}}>
            <Text style={styles.textRow}>
              Overall: <FontAwesome name={this.getStarName(this.props.review.overall_rating, 1)} size={19} color="black" />
              <FontAwesome name={this.getStarName(this.props.review.overall_rating, 2)} size={19} color="black" />
              <FontAwesome name={this.getStarName(this.props.review.overall_rating, 3)} size={19} color="black" />
              <FontAwesome name={this.getStarName(this.props.review.overall_rating, 4)} size={19} color="black" />
              <FontAwesome name={this.getStarName(this.props.review.overall_rating, 5)} size={19} color="black" />
            </Text>
            <Text style={styles.textRow}>Term: {this.props.review.start_month} {this.props.review.start_year}</Text>
            <Text style={styles.textRow}>Instructor: {this.props.review.name}</Text>
            <Text style={styles.textRow}>By: {this.props.review.reviewer_name || "anonymous"}</Text>
          </View>

          <View style={{flex: 1, padding: 5}}>
            <Text style={styles.textRow}>Teaching: {this.decodeProf(this.props.review.prof_rating)}</Text>
            <Text style={styles.textRow}>Evaluation: {this.decodeFairness(this.props.review.fairness_rating)}</Text>
            <Text style={styles.textRow}>Workload: {this.decodeWorkload(this.props.review.workload_rating)}</Text>
            <Text style={styles.textRow}>Posted On: {this.props.review.review_created_at.slice(0, 10)}</Text>
          </View>

        </View>
        <Text style={styles.descText}>"{this.props.review.review_desc || "no comment provided"}"</Text>
      </View>
    );
  }
}

export default CourseReviewRow;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderTopWidth: .5,
    borderBottomWidth: .5,
    borderColor: '#004E89',
    backgroundColor: 'white',
    marginTop: 5
  },
  dividedRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textRow: {
    paddingTop: 5
  },
  descText: {
    paddingTop: 5,
    paddingBottom: 5,
    borderTopWidth: .5,
    borderColor: '#004E89',
    fontStyle: 'italic'
  }
});

