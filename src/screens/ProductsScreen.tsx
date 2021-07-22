import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react'
import { Text, View, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { ProductsContext } from '../context/ProductsContext';
import { ProductsStackParams } from '../navigator/ProductsNavigator';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductsScreen'>{};

export const ProductsScreen = ({  navigation }: Props) => {

    const { products, loadProducts } = useContext(ProductsContext);
    const [isRefresh, setIsRefresh] = useState(false)


    useEffect(() => {

        navigation.setOptions({
             headerRight: () => (
                 <TouchableOpacity
                    activeOpacity={0.8}
                    style={{marginRight: 10}}
                    onPress={()=> navigation.navigate('ProductScreen',{})}
                 >
                     <Text>Agregar</Text>
                 </TouchableOpacity>
             )
        })

    },[])

    //pull to refresh

    const loadProductsFromBackend = async () => {
        setIsRefresh(true);
        await loadProducts();
        setIsRefresh(false);
    }

    return (
        <View style={{flex: 1, marginHorizontal: 10}}>
      
            <FlatList
                 data={products}
                 keyExtractor={(p) => p._id}
                 renderItem={({item}) => (
                     <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={
                            ()=> navigation.navigate('ProductScreen',{
                                id: item._id,
                                name: item.nombre
                            })
                    }
                     > 
                      <Text style={styles.productName}>{item.nombre}</Text>
                     </TouchableOpacity>
                 )}
                 ItemSeparatorComponent={() => (
                      <View style={styles.itemSeparator}/>
                 )}

                 refreshControl={
                     <RefreshControl
                          refreshing={isRefresh}
                          onRefresh={loadProductsFromBackend}
                     />
                 }
            />
        </View>
    )
}

const styles= StyleSheet.create({
    productName:{
        fontSize: 20
    },
    itemSeparator:{
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        marginVertical: 5
    }
})

