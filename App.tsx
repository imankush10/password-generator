import {
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {number, object} from 'yup';
import {Formik} from 'formik';
import Clipboard from '@react-native-clipboard/clipboard';

const passwordSchema = object().shape({
  passwordLength: number()
    .required('Password is required')
    .min(4, 'Min length is 4')
    .max(16, 'Max length is 16'),
});

const App = () => {
  const [password, setPassword] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [upperCase, setUpperCase] = useState(false);
  const [symbols, setSymbols] = useState(false);
  const [numbers, setNumbers] = useState(false);

  const generatePassword = (passwordLength: number) => {
    const characterSets = {
      uppercase: 'ABCDEGFHIJKLMNOPQRSTUVWXYZ',
      symbols: '!@#$%^&*()_+[]{}|;:,.<>?',
      numbers: '0123456789',
    };
    let characterString = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    if (upperCase) {
      result += createPassword(characterSets.uppercase, 1);
      characterString += characterSets.uppercase;
      passwordLength--;
    }
    if (symbols) {
      result += createPassword(characterSets.symbols, 1);
      characterString += characterSets.symbols;
      passwordLength--;
    }
    if (numbers) {
      result += createPassword(characterSets.numbers, 1);
      characterString += characterSets.numbers;
      passwordLength--;
    }
    if (characterString.length == 0) {
      setPassword('');
      setIsGenerated(false);
      return;
    }
    if (characterString.length && passwordLength) {
      result += createPassword(characterString, passwordLength);
      setPassword(result);
      setIsGenerated(true);
    } else {
      setPassword(result);
    }
  };
  const createPassword = (characterString: string, passwordLength: number) => {
    let generatedPassword = '';
    for (let i = 0; i < passwordLength; i++) {
      let randomIndex = Math.floor(Math.random() * characterString.length);
      generatedPassword += characterString[randomIndex];
    }
    return generatedPassword;
  };

  const copyToClipboard = () => {
    if (isGenerated) Clipboard.setString(password);
  };

  const reset = () => {
    setPassword('');
    setIsGenerated(false);
    setUpperCase(false);
    setSymbols(false);
    setNumbers(false);
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar backgroundColor="rgba(0,0,0,0.8)" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.title}>Password Generator</Text>
          <Formik
            initialValues={{passwordLength: ''}}
            validationSchema={passwordSchema}
            onSubmit={values => {
              generatePassword(+values.passwordLength);
            }}>
            {({
              values,
              errors,
              touched,
              isValid,
              handleReset,
              handleChange,
              handleSubmit,
            }) => (
              <>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputColumn}>
                    <Text style={styles.heading}>Password length</Text>
                    {touched.passwordLength && errors.passwordLength && (
                      <Text style={styles.errorText}>
                        {errors.passwordLength}
                      </Text>
                    )}
                  </View>
                  <TextInput
                    style={styles.inputColumn}
                    value={values.passwordLength}
                    onChangeText={handleChange('passwordLength')}
                    placeholder="Ex. 8"
                    placeholderTextColor="white"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Includes uppercase</Text>
                  <View>
                    <BouncyCheckbox
                      useBuiltInState={false}
                      isChecked={upperCase}
                      onPress={() => setUpperCase(prev => !prev)}
                      fillColor="#5dc6db"
                    />
                  </View>
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Includes symbols</Text>
                  <View>
                    <BouncyCheckbox
                      useBuiltInState={false}
                      isChecked={symbols}
                      onPress={() => setSymbols(prev => !prev)}
                      fillColor="#5dc6db"
                    />
                  </View>
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Includes numbers</Text>
                  <View>
                    <BouncyCheckbox
                      useBuiltInState={false}
                      isChecked={numbers}
                      onPress={() => setNumbers(prev => !prev)}
                      fillColor="#5dc6db"
                    />
                  </View>
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleSubmit}
                    disabled={!isValid}>
                    <Text style={styles.primaryBtnTxt}>Generate Password</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => {
                      handleReset();
                      reset();
                    }}>
                    <Text style={styles.secondaryBtnTxt}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
        {isGenerated ? (
          <View style={styles.parent}>
            <View style={[styles.card, styles.cardElevated]}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.subTitle}>Result</Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#2e2e2e',
                    justifyContent: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 8,
                  }}
                  onPress={() => {
                    copyToClipboard();
                    Alert.alert(`Copied`, `Password: ${password}`);
                  }}>
                  <Text style={{color: 'white'}}>Copy</Text>
                </TouchableOpacity>
              </View>
              <Text selectable={true} style={styles.generatedPassword}>
                {password}
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  formContainer: {
    margin: 10,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 15,
    color: 'white',
  },
  subTitle: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    color: '#758283',
    marginBottom: 8,
    fontSize: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  inputWrapper: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  inputColumn: {
    flexDirection: 'column',
    color: 'white',
    fontSize: 18,
  },
  inputStyle: {
    padding: 8,
    width: '30%',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#16213e',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  primaryBtn: {
    width: 120,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#5DA3FA',
  },
  primaryBtnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    justifyContent: 'center',
  },
  secondaryBtn: {
    width: 120,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
  },
  secondaryBtnTxt: {
    textAlign: 'center',
    fontWeight: '600',
  },
  parent: {
    height: '60%',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'red',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 12,
  },
  cardElevated: {
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  generatedPassword: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },
});

export default App;
