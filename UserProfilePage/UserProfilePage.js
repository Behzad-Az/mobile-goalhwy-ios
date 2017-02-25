import React from 'react';
import {
  ScrollView,
  View,
  Dimensions
} from 'react-native';

import ProfileCard from './ProfileCard.js';

class UserProfilePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView>
        <View style={{marginTop: 89, minHeight: Dimensions.get('window').height - 89, backgroundColor: '#ddd', paddingTop: 5 }}>
          <ProfileCard />
        </View>
      </ScrollView>
    );
  }
}

export default UserProfilePage;
