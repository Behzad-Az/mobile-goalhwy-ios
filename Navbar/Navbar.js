import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { FontAwesome } from '@exponent/vector-icons';

import SearchBar from '../Partials/SearchBar.js';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.currPage = 'IndexPage';
    this.state = {
      pageError: false,
      currPage: 'IndexPage',
      userInfo: {},
      notifications: [],
      unViewedNotif: false,
      searchResults: []
    };
    this.conditionData = this.conditionData.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.renderPageAfterData = this.renderPageAfterData.bind(this);
  }

  componentDidMount() {
    fetch('http://127.0.0.1:19001/api/usernavbardata')
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(err => {
      console.log("Error here: Navbar.js: ", err);
      this.setState({ pageError: true });
    });
  }

  conditionData(resJSON) {
    if (resJSON) {
      let newState = {
        ...resJSON,
        unViewedNotif: resJSON.notifications.reduce((a, b) => ({ unviewed: a.unviewed || b.unviewed }), { unviewed: false } ).unviewed
      }
      this.setState(newState);
    } else {
      console.log("Error here: Navbar.js: ", err);
      this.setState({ pageError: true });
    }
  }

  handleSearch(searchResults) {
    this.setState({ searchResults });
  }

  renderPageAfterData() {
    if (this.state.pageError) {
      return (
        <View style={styles.componentContainer}>
          <Text style={{padding: 5, textAlign: 'center'}}>
            <FontAwesome name="exclamation-triangle" size={19} /> Error in loading up the Navbar.
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.dividedRow}>
          <FontAwesome
            name="feed"
            style={[styles.navItem, {borderBottomWidth: this.props.title === 'FeedPage' ? 3 : 0 }]}
            onPress={() => Actions.FeedPage({ userId: this.state.userInfo.id })} />
          <FontAwesome
            name="book"
            style={[styles.navItem, {borderBottomWidth: this.props.title === 'IndexPage' ? 3 : 0 }]}
            onPress={() => Actions.IndexPage()} />
          <FontAwesome
            name="graduation-cap"
            style={[styles.navItem, {borderBottomWidth: this.props.title === 'InstPage' ? 3 : 0 }]}
            onPress={() => Actions.InstPage({ instId: this.state.userInfo.inst_id })} />
          <FontAwesome
            name="briefcase"
            style={[styles.navItem, {borderBottomWidth: this.props.title === 'CareerPage' ? 3 : 0 }]}
            onPress={() => Actions.CareerPage()} />
          <FontAwesome
            name="user-circle-o"
            style={[styles.navItem, {borderBottomWidth: this.props.title === 'UserProfilePage' ? 3 : 0 }]}
            onPress={() => Actions.UserProfilePage({ userId: this.state.userInfo.id })} />
        </View>
      );
    }
  }

  render() {
    return (
      <View style={[styles.container, { height: 89 + this.state.searchResults.length * 28, width: Dimensions.get('window').width }]}>
        <SearchBar handleSearch={this.handleSearch} />
        { this.renderPageAfterData() }
        <View style={[styles.resultContainer, {borderWidth: this.state.searchResults[0] ? .5 : 0, width: Dimensions.get('window').width - 20}]}>
          { this.state.searchResults }
        </View>
      </View>
    );
  }
}

export default Navbar;

const styles = StyleSheet.create({
  container: {
    borderColor: 'white',
    position: 'absolute',
    top: 0,
    minHeight: 65
  },
  navItem: {
    borderColor: 'white',
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#004E89',
    textAlign: 'center',
    fontSize: 19,
    flex: 1,
    height: 30
  },
  dividedRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  resultContainer: {
    position: 'absolute',
    top: 54,
    left: 10,
    backgroundColor: 'white'
  }
});
