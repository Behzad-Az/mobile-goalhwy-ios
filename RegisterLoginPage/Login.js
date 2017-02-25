import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';
import { Actions } from 'react-native-router-flux';

import NewRegisterForm from './NewRegisterForm.js';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'ben',
      password: 'ben123',
      pageMsg: ''
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.setMessage = this.setMessage.bind(this);
  }

  componentDidMount() {
    this.handleLogin();
  }

  handleLogin() {
    let data = {
      username: this.state.username,
      password: this.state.password
    };
    fetch('http://127.0.0.1:19001/api/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? Actions.FeedPage() : this.setState({ pageMsg: "Invalid username and/or password"  }))
    .catch(err => this.setState({ pageMsg: "Login failed"  }));
  }

  setMessage(pageMsg) {
    this.setState({ pageMsg });
  }

  render() {
    return (
      <View style={styles.container}>

        <Text style={[styles.textStyle, {fontSize: 13}]}>{this.state.pageMsg}</Text>
        <Image
          source={require('../public/images/logo.png')}
          fadeDuration={0}
          resizeMode={Image.resizeMode.contain}
          style={{ height: 30, margin: 15 }}
         />

        <View style={{margin: 5}}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={username => this.setState({ username })}
            placeholder="Username"
            underlineColorAndroid="rgba(0,0,0,0)"
          />
          <FontAwesome name="user" style={styles.fontAwesomeStyle} />
        </View>

        <View style={{margin: 5}}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={password => this.setState({ password })}
            placeholder="Password"
            secureTextEntry={true}
            underlineColorAndroid="rgba(0,0,0,0)"
          />
          <FontAwesome name="key" style={styles.fontAwesomeStyle} />

        </View>

        <View style={styles.dividedRow}>
          <View style={styles.loginBtnContainer}>
            <Text style={styles.loginBtn} onPress={this.handleLogin}>
              Login
            </Text>
          </View>
          <NewRegisterForm style={styles.textStyle} setMessage={this.setMessage} />
        </View>

      </View>
    );
  }
}

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#004E89',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBottom: 150
  },
  textInput: {
    backgroundColor: 'white',
    width: 240,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 10,
    paddingLeft: 40,
    borderWidth: 2,
    borderColor: '#bbb',
    height: 38,
    borderRadius: 7
  },
  fontAwesomeStyle: {
    position: 'absolute',
    left: 8,
    top: 8,
    fontSize: 22,
    color: '#bbb',
    backgroundColor: 'white'
  },
  textStyle: {
    padding: 5,
    textAlign: 'center',
    fontSize: 15,
    color: 'white'
  },
  dividedRow: {
    width: 240,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5
  },
  loginBtnContainer: {
    flex: 1,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 5
  },
  loginBtn: {
    textAlign: 'center',
    fontSize: 15,
    color: '#004E89'
  }
});
