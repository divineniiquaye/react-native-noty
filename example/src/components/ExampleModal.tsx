import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Noty } from "react-native-noty";
import React from 'react';

export const ExampleModal = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Example Modal</Text>
      <Text style={styles.body}>
        This is an example to showcase the imperative Noty Modal!
      </Text>
      <TextInput style={styles.input} placeholder='Enter some text' />
      <TouchableOpacity
        onPress={() => Noty.hide('close button pressed')}
        style={styles.buttonContainer}
      >
        <Text style={styles.button}>Close Modal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
    width: "90%",
    paddingHorizontal: 16,
    paddingVertical: 30,
    justifyContent: 'center',
    alignSelf: "center",
    alignItems: 'center',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  body: {
    textAlign: 'center',
    fontSize: 14,
  },
  buttonContainer: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 25,
    backgroundColor: '#fab54d',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: "100%",
    marginTop: 10,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  }
});
