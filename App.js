import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Icon, TouchableOpacity,TextInput, FlatList, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const COLORS = {primary: '#1f145c', white: '#fff'};

export default function App() {
  const [textInput, setTextInput] = React.useState('');
  const [todos, setTodos] = React.useState([
    
  ]);

  React.useEffect(() => {
    getTodosFromUserDevice()
  }, [])

  React.useEffect(()=> {
    saveTodoToUserDevice(todos);
  }, [todos])  

  const ListItem = ({todo}) => {
    return (
    <View style={styles.listItem}>
      <View style={{flex: 1}}>
        <Text style={
          {fontWeight: 'bold', 
          fontSize: 15, 
          color: COLORS.primary, 
          textDecorationLine: todo?.completed?"line-through":"none"}
          }>
            {todo?.task}
        </Text>
      </View>
      {
        !todo?.completed && (
          <TouchableOpacity
            style={[styles.actionIcon]} onPress={() => markTodoComplete(todo?.id)}>
            <MaterialIcons name="done" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )
      }
      
      <TouchableOpacity
        style={[styles.actionIcon, {backgroundColor: 'red'}]} onPress={()=> deleteTodo(todo?.id)}>
        <MaterialIcons name="delete" size={20} color={COLORS.white} />
      </TouchableOpacity>
    </View>
    )
  }  

  const saveTodoToUserDevice = async (todos) => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (e) {
      console.log(e);
    }

  }

  const getTodosFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem("todos");
      if(todos != null) {
        setTodos(JSON.parse(todos))
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addTodo = () => {
    if(textInput == ""){
      Alert.alert('Error', 'Please input todo')
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
    
  };

  const markTodoComplete = (todoId) => {
    const newTodos = todos.map((item)=>{
      if(item.id == todoId) {
        return{...item, completed: true};
      }
      return item;
    });
    setTodos(newTodos);
  }

  const deleteTodo = (todoId) => {
    const newTodos = todos.filter(item => item.id != todoId);
    setTodos(newTodos);
  }; 

  const clearTodos = () => {
    Alert.alert("Confirm", "Clear todos?",[
      {
        text: "Yes",
        onPress: () => setTodos([]),
      },
      {
        text: "No",
      }
    ])
    setTodos([]);
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={styles.header}>
        <Text style={{fontWeight: 'bold', fontSize: 20, color: COLORS.primary}}>
          TO-DO
        </Text>
        <MaterialIcons name="delete" size={24} color="red" onPress={clearTodos}/>
      </View>
      <FlatList 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos} 
        renderItem={({item}) => <ListItem todo={item} />}
      />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="Add Todo" 
            value={textInput}
            onChangeText={(text)=>setTextInput(text)} />
        </View>
      <TouchableOpacity onPress={addTodo}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="add" size={30} color={COLORS.white} />
        </View>
      </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent:'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 50 : 0,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundcolor: COLORS.white,
    width:'100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
