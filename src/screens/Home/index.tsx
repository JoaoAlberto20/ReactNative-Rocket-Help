import React, { useEffect, useState } from 'react';
import {  useNavigation } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {
  VStack,
  HStack,
  IconButton,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center,
} from 'native-base';

import {  SignOut, ChatTeardropText } from 'phosphor-react-native';

import Logo from '../../assets/logo_secondary.svg';
import Filter from '../../components/Filter';
import Orders, {OrderProps} from '../../components/Orders';
import Button from '../../components/Button';
import { Alert } from 'react-native';
import { dateFormat } from '../../utils/firestoreDateFormat';
import Loading from '../../components/Loading';

export default function Home(){
  const [ statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();
  const {colors} = useTheme();

  const handleNewOrder = () => {
    navigation.navigate('new');
  }

  const handleOpenDetails = (orderId: string) => {
    navigation.navigate('details', { orderId })
  }

  const handleLogout = () => {

    auth()
      .signOut()
     .catch((error) => {
      console.log(error);
      Alert.alert('Sair', 'Não foi possível sair');
     })
  }

  useEffect(() => {
    setIsLoading(true);

    const subscriber = firestore()
      .collection('orders')
      .where('status', '==', statusSelected)
      .onSnapshot((snapShoot) => {
        const data = snapShoot.docs.map((doc) => {
          const {patrimony, description , status, created_at} = doc.data()

          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at),
          }
        });

        setOrders(data);
        setIsLoading(false);
      })


    return subscriber;

  }, [statusSelected]);

  return (
    <VStack flex={1} pb={6} bg="gray.700" >
      <HStack 
        w="full"
        justifyContent="space-between"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
        alignItems="center"
      >
        <Logo />
        <IconButton
          icon={<SignOut size={26} color={
            colors.gray[300]
          }  />}
          onPress={handleLogout}
        />
      </HStack>
      
      <VStack flex={1} px={6} >

        <HStack 
          w="full" 
          mt={8} mb={4} 
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Meus chamados</Heading>
          <Text  color="gray.200">
            {orders.length}
          </Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter 
            type='open'
            title='em andamento'
            onPress={() => setStatusSelected('open')}
            isActive={statusSelected === 'open'}
          />

          <Filter 
            type='closed'
            title='finalizados'
            onPress={() => setStatusSelected('closed')}
            isActive={statusSelected === 'closed'}
          />
        </HStack>

       

        {
          isLoading ? <Loading /> : (
            <FlatList 
              data={orders} 
              keyExtractor={item => item.id}
              renderItem={({item}) => <Orders data={item} onPress={() => handleOpenDetails(item.id)}/>}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              ListEmptyComponent={() => (
                <Center>
                  <ChatTeardropText  color={colors.gray[300]} size={40} />
                  <Text  color="gray.300" fontSize="xl" mt={6} textAlign="center" >
                    Você ainda não possui {'\n'}
                    solicitação {statusSelected === 'open' ? 'em andamentos' : 'finalizados'}
                  </Text>
                </Center>
              )}
            />
          )
        }


        <Button 
          title='Nova solicitação' 
          onPress={handleNewOrder} 
        />
      </VStack>
    </VStack>
  );
}