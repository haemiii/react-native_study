import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View , TouchableOpacity, TextInput} from 'react-native';
import { theme } from './colors';

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({}); //hashmap
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload)=>{
    setText(payload)
  }
  const addToDo=()=>{
    if(text === ""){
      return 
    }
    // save to do
    const newToDos = Object.assign({}, toDos, {[Date.now()] : {text, work:working}})
    setToDos(newToDos)
    setText("");
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
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
    marginTop : 20,
    fontSize : 18
  }
});
