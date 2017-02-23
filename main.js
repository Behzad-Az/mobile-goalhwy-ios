import Exponent from 'exponent';
import React from 'react';
import {
  Text
} from 'react-native';

import { Router, Scene } from 'react-native-router-flux';

import Navbar from './Navbar/Navbar.js';
import CoursePage from './CoursePage/CoursePage.js';
import InstPage from './InstPage/InstPage.js';
import IndexPage from './IndexPage/IndexPage.js';
import CourseReviewPage from './CourseReviewPage/CourseReviewPage.js';
import DocPage from './DocPage/DocPage.js';
import CareerPage from './CareerPage/CareerPage.js';
import CompanyPage from './CompanyPage/CompanyPage.js';
import LoginPage from './RegisterLoginPage/Login.js';
import UserProfilePage from './UserProfilePage/UserProfilePage.js';
import FeedPage from './FeedPage/FeedPage.js';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router hideNavBar={false} navBar={Navbar}>
        <Scene key="root">

          <Scene
            key="IndexPage"
            component={IndexPage}
            title="IndexPage"
          />

          <Scene
            key="CoursePage"
            component={CoursePage}
            title="CoursePage"
          />

          <Scene
            key="InstPage"
            component={InstPage}
            title="InstPage"
          />

          <Scene
            key="CourseReviewPage"
            component={CourseReviewPage}
            title="CourseReviewPage"
          />

          <Scene
            key="DocPage"
            component={DocPage}
            title="DocPage"
          />

          <Scene
            key="CareerPage"
            component={CareerPage}
            title="CareerPage"
          />

          <Scene
            key="CompanyPage"
            component={CompanyPage}
            title="CompanyPage"
          />

          <Scene
            key="LoginPage"
            component={LoginPage}
            title="LoginPage"
            initial
            hideNavBar
          />

          <Scene
            key="UserProfilePage"
            component={UserProfilePage}
            title="UserProfilePage"
          />

          <Scene
            key="FeedPage"
            component={FeedPage}
            title="FeedPage"
          />

        </Scene>
      </Router>
    );
  }
};

Exponent.registerRootComponent(App);
