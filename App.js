import React,{Component} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  ScrollView,
} from 'react-native';
import {Button} from 'react-native-paper';
import Contacts from 'react-native-contacts';
import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
 
    };
  }
 // button fake
  static navigationOptions ={
    headerTitle: 'Rehber',
    headerRight: () => (
      <Button onPress={ () =>(
        this.loadContacts
      )
      } 
      icon="refresh"
      color="black">
        
      </Button>
    )
  }

  async componentWillMount() {
    if(Platform.OS === 'android'){
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Rehber",
        message: "Bu uygulama rehberinize erişmek istiyor!",
        buttonPositive: 'İzin Ver!',
        buttonNegative: 'İzin Verme'
      }).then(() => {
        this.loadContacts();
      });
    }
    else{
      this.loadContacts();
    }
  
}

loadContacts(){
  Contacts.getAll((err, contacts) => {
    if(err==='denied'){
      console.debug("Storage access denied.")
    }else{
      this.setState({contacts});
    }
  });
}
  render() {
    return(
      <View>
        <ScrollView>
          {
            this.state.contacts.map((item,i) => (
              <Button mode="outlined" onPress={() =>{
                this.props.navigation.navigate('Detail' ,{
                  itemId: {i},
                  name: item.givenName,
                  surname: item.familyName,
                  phoneNumber:(
                    item.phoneNumbers.map(num => (
                      num.number
                    ))
                  
                  ),
                  email: (
                      item.emailAddresses.map(mail => (
                        mail.email
                      ))
                  )
                })
              }}>
              {item.givenName} {item.familyName}
              </Button>
            )
            )
          }
             
        </ScrollView>

      </View>
    )
  }

  
}

class DetailScreen extends Component {
  constructor(props){
    super(props);
  }


  static navigationOptions = ({navigation, navigationOptions}) => {
    return{
      title: navigation.getParam("name", 'No Name'),
      headerStyle: {
        backgroundColor: navigationOptions.headerTintColor,
      },
      headerTintColor: navigationOptions.headerStyle.backgroundColor
    };
  };
  render() {
    const {navigation} = this.props;
    return (
      <View>
        <Button mode="text">
          Ad: {
            navigation.getParam('name', 'NO-NAME')
          }
          
        </Button>
        <Button mode="text">
          Soyad: 
          {
            navigation.getParam('surname', 'NO-SURNAME')
          }
        </Button>
        <Button mode="text">
           Numara: 
           {   
              navigation.getParam('phoneNumber', "null")
           }
        </Button>
        <Button>
          Mail: {
            navigation.getParam('email')
          }
        </Button>
      </View>
    );
  }
}



const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Detail: DetailScreen
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: 'blue',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },

  }
);
export default createAppContainer(RootStack)