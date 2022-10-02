
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { getDatabase, push, ref, onValue, remove } from'firebase/database';
import { initializeApp } from'firebase/app';


const firebaseConfig = {
  apiKey: "AIzaSyAarrcDP4Q1TdVrYGwo5CNnypYghLGAofY",
  authDomain: "kauppalista-fdf31.firebaseapp.com",
  projectId: "kauppalista-fdf31",
  storageBucket: "kauppalista-fdf31.appspot.com",
  messagingSenderId: "164998421147",
  appId: "1:164998421147:web:8f15bda77d91becb59443e"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppinglist, setShoppinglist] = useState([]);

  
  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const item = snapshot.val();
      const items = item ? Object.keys(item).map(key => ({ key, ...item[key] })) : [];
      setShoppinglist(items);
    });
  }, []);

  const saveProduct = () => {
    push(ref(database, 'items/'),
      { 'product': product, 'amount': amount });
    
  };

  const deleteProduct = (key) => {
    remove(
      ref(database, `items/${key}`)
    )
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Product"
        style={{
          marginTop: 60,
          fontSize: 20,
          width: 200,
          borderColor: "gray",
          borderWidth: 1,
        }}
        onChangeText={(product) => setProduct(product)}
        value={product}
      />
      <TextInput
        placeholder="Amount"
        style={{
          marginTop: 10,
          marginBottom: 10,
          fontSize: 20,
          width: 200,
          borderColor: "gray",
          borderWidth: 1,
        }}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />
      <Button onPress={saveProduct} title="Save" />
      <Text style={{marginTop: 30, fontSize: 24, fontWeight: "bold"}}>Products</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.key} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 20, marginTop: 5}}>{item.product}, {item.amount}</Text>
        <Text style={{fontSize: 20, color: '#0000ff', marginTop: 5}} onPress={() => deleteProduct(item.key)}> Delete</Text></View>} 
        data={shoppinglist}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
});
