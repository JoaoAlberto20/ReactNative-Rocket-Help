import React, { useState } from 'react';

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

export default function Home(){
  const [ statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
  const [orders, setOrders] = useState<OrderProps[]>([])

  const {colors} = useTheme();

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
            3
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

        <FlatList 
          data={orders} 
          keyExtractor={item => item.id}
          renderItem={({item}) => <Orders data={item}/>}
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

        <Button title='Nova solicitação' />
      </VStack>
    </VStack>
  );
}