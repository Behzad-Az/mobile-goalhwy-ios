import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';

class TopRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: true
    };
    this.getAverageValues = this.getAverageValues.bind(this);
    this.getProfAvgRatings = this.getProfAvgRatings.bind(this);
    this.decodeProf = this.decodeProf.bind(this);
    this.decodeWorkload = this.decodeWorkload.bind(this);
    this.decodeFairness = this.decodeFairness.bind(this);
    this.getStarName = this.getStarName.bind(this);
    this.renderDetails = this.renderDetails.bind(this);
  }

  getAverageValues() {
    let length = this.props.courseReviews.length || 1;
    let sumRatings = this.props.courseReviews.reduce((a, b) => {
      return {
        overall_rating: a.overall_rating + b.overall_rating,
        workload_rating: a.workload_rating + b.workload_rating,
        fairness_rating: a.fairness_rating + b.fairness_rating,
        prof_rating: a.prof_rating + b.prof_rating
      };
    }, {
      overall_rating: 0,
      workload_rating: 0,
      fairness_rating: 0,
      prof_rating: 0
    });

    return {
      overall_rating: Math.round(sumRatings.overall_rating / length * 2) / 2,
      workload_rating: Math.round(sumRatings.workload_rating / length),
      fairness_rating: Math.round(sumRatings.fairness_rating / length),
      prof_rating: Math.round(sumRatings.prof_rating / length)
    };
  }

  getProfAvgRatings() {
    let profRatingSum = {};
    let profRatingCount = {};
    this.props.courseReviews.forEach(review => {
      profRatingSum[review.name] = profRatingSum[review.name] ? profRatingSum[review.name] + review.prof_rating : review.prof_rating;
      profRatingCount[review.name] = profRatingCount[review.name] ? profRatingCount[review.name] + 1 : 1;
    });
    return Object.keys(profRatingSum).map((profName, index) => <Text key={index} style={styles.textRow}>• {profName}: {this.decodeProf(Math.round(profRatingSum[profName] / profRatingCount[profName]))}</Text> );
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
    if (rating >= number) return "star";
    else if (rating > number - 1) return "star-half-full";
    else return "star-o";
  }

  renderDetails() {
    let profAvgs = this.getProfAvgRatings();
    let overallAvgs = this.getAverageValues();
    return this.state.showDetails ?
      <View style={styles.dividedRow}>
        <View style={{flex: 1, padding: 5}}>
          <Text style={styles.topRowLabel}>Average Ratings:</Text>
          <Text style={styles.textRow}>
            Overall: <FontAwesome name={this.getStarName(overallAvgs.overall_rating, 1)} size={19} color="black" />
            <FontAwesome name={this.getStarName(overallAvgs.overall_rating, 2)} size={19} color="black" />
            <FontAwesome name={this.getStarName(overallAvgs.overall_rating, 3)} size={19} color="black" />
            <FontAwesome name={this.getStarName(overallAvgs.overall_rating, 4)} size={19} color="black" />
            <FontAwesome name={this.getStarName(overallAvgs.overall_rating, 5)} size={19} color="black" />
          </Text>
          <Text style={styles.textRow}>Teaching: {this.decodeProf(overallAvgs.prof_rating)}</Text>
          <Text style={styles.textRow}>Evaluation: {this.decodeFairness(overallAvgs.fairness_rating)}</Text>
          <Text style={styles.textRow}>Workload: {this.decodeWorkload(overallAvgs.workload_rating)}</Text>
        </View>
        <View style={{flex: 1, padding: 5}}>
          <Text style={styles.topRowLabel}>Previous Instructors:</Text>
          {profAvgs}
        </View>
      </View> :
      <Text style={styles.summaryInfo}>
        Overall: <FontAwesome name={this.getStarName(overallAvgs.overall_rating, 1)} size={19} color="black" />
        <FontAwesome name={this.getStarName(overallAvgs.overall_rating, 2)} size={19} color="black" />
        <FontAwesome name={this.getStarName(overallAvgs.overall_rating, 3)} size={19} color="black" />
        <FontAwesome name={this.getStarName(overallAvgs.overall_rating, 4)} size={19} color="black" />
        <FontAwesome name={this.getStarName(overallAvgs.overall_rating, 5)} size={19} color="black" />
      </Text>
  }

  render() {
    return (
      <View style={styles.componentContainer}>
        <Text style={styles.header} onPress={() => this.setState({showDetails: !this.state.showDetails})}>Summary:</Text>
        { this.renderDetails() }
      </View>
    );
  }
}

export default TopRow;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#004E89',
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  },
  headerStanAloneChevron: {
    textAlign: 'center',
    fontSize: 19,
    color: 'white',
    textAlign: 'right',
    position: 'absolute',
    top: 5,
    right: 12
  },
  topRowLabel: {
    color: '#004E89',
    fontWeight: 'bold',
    borderBottomWidth: .5,
    borderColor: '#004E89',
    paddingBottom: 5
  },
  textRow: {
    paddingTop: 5
  },
  dividedRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  summaryInfo: {
    padding: 5,
    backgroundColor: '#eee',
    borderBottomWidth: .5,
    borderLeftWidth: .5,
    borderRightWidth: .5
  },
  componentContainer: {
    marginBottom: 10,
    backgroundColor: 'white',
    borderColor: '#004E89',
    borderBottomWidth: .5
  }
});

