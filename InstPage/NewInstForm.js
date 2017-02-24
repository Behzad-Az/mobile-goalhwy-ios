import React, { Component } from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  View,
  ScrollView,
  TextInput,
  PickerIOS
} from 'react-native';

import { FontAwesome } from '@exponent/vector-icons';
import FormNavBar from '../Navbar/FormNavBar.js';

class ChangeInstForm extends Component {
  constructor(props) {
    super(props);
    this.countryList = [ { value: '', label: '-' }, { value: 'canada', label: 'Canada' }, { value: 'united_states', label: 'United State of America (USA)' } ];
    this.provinceList = {
      canada: [
        { value: '', label: '-' },
        { value: 'Alberta', label: 'Alberta' }, { value: 'British Columbia', label: 'British Columbia' }, { value: 'Manitoba', label: 'Manitoba' },
        { value: 'New Brunswick', label: 'New Brunswick' }, { value: 'Newfoundland and Labrador', label: 'Newfoundland and Labrador' },
        { value: 'Northwest Territories', label: 'Northwest Territories' }, { value: 'Nova Scotia', label: 'Nova Scotia' }, { value: 'Nunavut', label: 'Nunavut' },
        { value: 'Ontario', label: 'Ontario' }, { value: 'Prince Edward Island', label: 'Prince Edward Island' }, { value: 'Quebec', label: 'Quebec' },
        { value: 'Saskatchewan', label: 'Saskatchewan' }, { value: 'Yukon', label: 'Yukon' }
      ],
      united_states: [
        { value: '', label: '-' },
        { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AS', label: 'American Samoa' }, { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
        { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' }, { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'DC', label: 'District Of Columbia' },
        { value: 'FM', label: 'Federated States Of Micronesia' }, { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' }, { value: 'GU', label: 'Guam' },
        { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' }, { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
        { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' }, { value: 'ME', label: 'Maine' }, { value: 'MH', label: 'Marshall Islands' }, { value: 'MD', label: 'Maryland' },
        { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' }, { value: 'MO', label: 'Missouri' },
        { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
        { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' }, { value: 'MP', label: 'Northern Mariana Islands' },
        { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' }, { value: 'OR', label: 'Oregon' }, { value: 'PW', label: 'Palau' }, { value: 'PA', label: 'Pennsylvania' },
        { value: 'PR', label: 'Puerto Rico' }, { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' },
        { value: 'TN', label: 'Tennessee' }, { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' }, { value: 'VI', label: 'Virgin Islands' },
        { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' }, { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }
      ]
    };
    this.state = {
      modalVisible: false,
      instLongName: '',
      instShortName: '',
      country: '',
      province: ''
    };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.renderProvinceSelect = this.renderProvinceSelect.bind(this);
    this.handleNewInstPost = this.handleNewInstPost.bind(this);
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  renderProvinceSelect() {
    let PickerItem = PickerIOS.Item;
    return this.state.country ?
      <PickerIOS
        selectedValue={this.state.province}
        onValueChange={province => this.setState({ province })}
        itemStyle={{fontSize: 16}}>
        { this.provinceList[this.state.country].map((province, index) =>
          <PickerItem
            key={index}
            value={province.value}
            label={province.label}
          />)}
      </PickerIOS> :
      <Text style={{paddingTop: 5, paddingBottom: 5}}>Select country first.</Text>
  }

  handleNewInstPost() {
    let data = {
      country: this.state.country,
      province:  this.state.province,
      inst_long_name: this.state.instLongName,
      inst_short_name: this.state.instShortName
    };
    fetch('http://127.0.0.1:19001/api/institutions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.props.reload() : console.log("Error in server, NewInstForm.js: ", resJSON))
    .catch(err => console.log("Error here in NewInstForm.js: ", err));
    this.setModalVisible(false);
  }

  render() {
    let PickerItem = PickerIOS.Item;
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
        >
          <ScrollView style={styles.modalContainer}>

            <FormNavBar formTitle="New Institution:" backFcn={this.setModalVisible} />

            <View style={styles.bodyContainer}>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Institution Full Name:</Text>
                <TextInput
                  style={styles.textInput}
                  autoCapitalize="words"
                  onChangeText={instLongName => this.setState({instLongName})}
                  value={this.state.instLongName}
                  placeholder="Example: University of British Columbia"
                  underlineColorAndroid="rgba(0,0,0,0)"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Institution Given Name (optional):</Text>
                <TextInput
                  style={styles.textInput}
                  autoCapitalize="words"
                  autoCorrect={false}
                  onChangeText={instShortName => this.setState({instShortName})}
                  value={this.state.instShortName}
                  placeholder="Example: UBC"
                  underlineColorAndroid="rgba(0,0,0,0)"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Select Country:</Text>
                <PickerIOS
                  selectedValue={this.state.country}
                  itemStyle={{fontSize: 16}}
                  onValueChange={country => this.setState({ country })}>
                  { this.countryList.map((country, index) =>
                    <PickerItem
                      key={index}
                      value={country.value}
                      label={country.label}
                    />)}
                </PickerIOS>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Select Province:</Text>
                { this.renderProvinceSelect() }
              </View>

              <View style={styles.dividedRow}>
                <View style={[styles.primaryBtnContainer, {marginRight: 5}]}>
                  <Text style={styles.primaryBtn} onPress={this.handleNewInstPost}>
                    Submit
                  </Text>
                </View>
                <View style={[styles.primaryBtnContainer, {marginLeft: 5}]}>
                  <Text style={styles.primaryBtn} onPress={() => this.setModalVisible(false)}>
                    Cancel
                  </Text>
                </View>
              </View>

            </View>

          </ScrollView>
        </Modal>

        <FontAwesome name="plus" style={this.props.style} onPress={() => this.setModalVisible(true)} />

      </View>
    );
  }
}

export default ChangeInstForm;

const styles = StyleSheet.create({
  modalContainer: {
    paddingTop: 25
  },
  bodyContainer: {
    padding: 10
  },
  inputContainer: {
    marginBottom: 10,
    padding: 5,
    borderWidth: .5,
    borderRadius: 5,
    borderColor: '#aaa'
  },
  inputLabel: {
    color: '#004E89',
    fontWeight: 'bold',
    paddingTop: 2.5
  },
  textInput: {
    minHeight: 30,
    paddingTop: 2.5,
    fontSize: 16
  },
  dividedRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  primaryBtnContainer: {
    backgroundColor: '#004E89',
    flex: 1,
    borderRadius: 5,
    borderColor: '#004E89',
    borderWidth: .5,
    padding: 5
  },
  primaryBtn: {
    color: 'white',
    textAlign: 'center'
  }
});
