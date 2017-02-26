import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import EditProfileForm from './EditProfileForm.js';

class RevisionRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      userInfo: {},
      pageMsg: ''
    };
    this.loadComponentData = this.loadComponentData.bind(this);
    this.conditionData = this.conditionData.bind(this);
    this.setMessage = this.setMessage.bind(this);
  }

  componentDidMount() {
    this.loadComponentData();
  }

  loadComponentData() {
    fetch('http://127.0.0.1:19001/api/users/currentuser')
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(err => {
      console.log("Error here: UserProfilePage.js: ", err);
      this.setState({ dataLoaded: true, pageError: true });
    });
  }

  conditionData(resJSON) {
    if (resJSON) {
      let userInfo = {
        instId: resJSON.inst_id,
        progId: resJSON.prog_id,
        username: resJSON.username,
        email: resJSON.email,
        userYear: resJSON.user_year,
        instDisplayName: resJSON.inst_display_name,
        progDisplayName: resJSON.prog_display_name
      };
      this.setState({ dataLoaded: true, userInfo, pageMsg: '' });
    } else {
      console.log("Error here: UserProfilePage.js: ", err);
      this.setState({ dataLoaded: true, pageError: true });
    }
  }

  setMessage(pageMsg) {
    this.setState({ pageMsg });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.pageMsg}</Text>
        <Text style={styles.header}>Profile Information:</Text>

        <View style={styles.attributeContainer}>
           <Text style={styles.subHeader}>Username:</Text>
           <Text>{this.state.userInfo.username}</Text>
        </View>

        <View style={styles.attributeContainer}>
           <Text style={styles.subHeader}>Email:</Text>
           <Text>{this.state.userInfo.email}</Text>
        </View>

        <View style={styles.attributeContainer}>
           <Text style={styles.subHeader}>Primary Institution:</Text>
           <Text>{this.state.userInfo.instDisplayName}</Text>
        </View>

        <View style={styles.attributeContainer}>
           <Text style={styles.subHeader}>Primary Program:</Text>
           <Text>{this.state.userInfo.progDisplayName}</Text>
        </View>

        <View style={styles.attributeContainer}>
           <Text style={styles.subHeader}>Primary Academic Year:</Text>
           <Text>{this.state.userInfo.userYear}</Text>
        </View>

        <View style={[{position: 'absolute', top: 10, right: 10}, styles.editBtnContainer]}>
          <EditProfileForm
            style={styles.editBtn}
            setMessage={this.setMessage}
            userInfo={this.state.userInfo}
            reload={this.loadComponentData} />
        </View>

      </View>
    );
  }
}

export default RevisionRow;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderTopWidth: .5,
    borderBottomWidth: .5,
    borderColor: '#004E89',
    backgroundColor: 'white',
    marginBottom: 10
  },
  header: {
    color: '#004E89',
    fontWeight: 'bold',
    marginBottom: 10
  },
  attributeContainer: {
    marginBottom: 10
  },
  subHeader: {
    fontWeight: 'bold',
    paddingBottom: 2
  },
  editBtnContainer: {
    backgroundColor: '#004E89',
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 6,
    paddingLeft: 6,
    borderRadius: 5
  },
  editBtn: {
    color: 'white'
  }
});
