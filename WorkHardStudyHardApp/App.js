import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View , TouchableOpacity, TextInput, ScrollView, Alert} from 'react-native';
import { theme } from './colors';
import {Fontisto} from "@expo/vector-icons"
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const STORAGE_KEY = "@toDos"
  const STORAGE_STATE = "@state"

  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({}); //hashmap
  useEffect(()=>{
    loadState();
    loadToDos();
  }, [])
  useEffect(()=>{
    saveState();
  }, [working])

  const travel = async () => {
    setWorking(false)
    saveState()
  };
  const work = async() => {
    setWorking(true)
    saveState()
  };
  const onChangeText = (payload)=>{
    setText(payload)
  }
  const saveToDos = async(toSave) =>{
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }

  const loadToDos = async() =>{
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    if(s){
      setToDos(JSON.parse(s))
    }else{
      setToDos("")
    }
  }
  const addToDo=async ()=>{
    if(text === ""){
      return 
    }
    // save to do
    const newToDos = {...toDos, [Date.now()]: {text,  working}}
    setToDos(newToDos)
    await saveToDos(newToDos)
    setText("")
  }
  const deleteToDo = async(key) =>{
    Alert.alert("Delete To Do?", "Are you sure?", [
      {text : "Cancle"},
      {text : "I'm sure", 
      style : "destructive",
      onPress : ()=>{
        const newToDos = {...toDos}
        delete newToDos[key]
        setToDos(newToDos)
        saveToDos(newToDos)
      }}
    ])
  }

  const saveState = async() =>{
    const state = working ? "work" : "travel"
    await AsyncStorage.setItem(STORAGE_STATE, state)
  }
  const loadState = async() =>{
    const state = await AsyncStorage.getItem(STORAGE_STATE)

    state === "work" ? work() : travel()
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
        // keyboardType='number-pad'
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        value={text}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"} style={styles.input}></TextInput>
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) => (
        toDos[key].working === working ? (
        <View style={styles.toDo} key={key}>
          <Text style={styles.toDotext}>{toDos[key].text}</Text>
          <TouchableOpacity onPress={()=> deleteToDo(key)}>
            <Fontisto name="trash" size={20} color={theme.grey}></Fontisto>
          </TouchableOpacity>
        </View>) : null
      ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal : 20,
  },
  header : {
    flexDirection: "row",
    justifyContent : "space-between",
    alignItems : "center",
    width : "90%",
    marginTop : 100,
  } ,
  btnText : {
    color : "white",
    fontSize : 40,
  },
  input : {
    backgroundColor : "white",
    paddingVertical : 10,
    paddingHorizontal: 20,
    borderRadius : 30,
    marginVertical : 20,
    fontSize : 18
  },
  toDo : {
    backgroundColor : theme.toDoBg,
    marginBottom : 10,
    paddingVertical : 20,
    paddingHorizontal : 20,
    borderRadius : 15,
    flexDirection : "row",
    alignItems : "center",
    justifyContent : "space-between"
  },
  toDotext:{
    color : "white",
    fontSize : 16,
    fontWeight : "500"
  }
});
