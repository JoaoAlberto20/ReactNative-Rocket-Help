import { useEffect, useState} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import { dateFormat } from '../../utils/firestoreDateFormat';
import { OrderFirestoreDTO } from '../../DTOs/OrderDTO';

import { Alert } from 'react-native';
import { HStack, Text, VStack, useTheme, ScrollView, Box } from 'native-base';
import {CircleWavyCheck, Hourglass, DesktopTower, ClipboardText} from 'phosphor-react-native';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import CardDetails from '../../components/CardDetails';
import { OrderProps } from '../../components/Orders';


type RouteParams = {
  orderId: string,
}

type OrdersDEtais = OrderProps & {
  closed: string,
  solution: string,
  description: string,
}

export default function Details() {
  const route = useRoute();
  const { colors } = useTheme();
  const navigation = useNavigation() 

  const { orderId } = route.params as RouteParams;

  const [order, setOrder] = useState<OrdersDEtais>({} as OrdersDEtais);
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  const handleOrderClosed = () => {
    if(!solution) {
      return Alert
        .alert('Solicitação', 'Informe a solução para encerrar a solicitação');
    }

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert('Solicitação', 'A solicitação foi encerrada');
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação');
      })
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then((doc) => {
        const { patrimony, description, status, created_at, closed_at, solution} = doc.data();
        const closed = closed_at ?  dateFormat(closed_at) : null;


        setOrder({
          id: doc.id,
          when: dateFormat(created_at),
          patrimony,
          closed,
          status,
          solution,
          description,
        })
    
        setIsLoading(false);
      })
  }, [])

  if(isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.700"> 
      <Box px={6} bg="gray.600">
        <Header  title='Solicitação'/>
      </Box>
      <HStack bg="gray.500"  justifyContent="center" p={4}>
        {
          order.status === 'closed' 
          ? <CircleWavyCheck size={22} color={colors.green[300]}/>
          :  <Hourglass size={22} color={colors.secondary[700]}/>
        }

        <Text 
          ml={2}
          color={ order.status === 'closed' ? colors.green[300] : colors.secondary[700] }
          fontSize="sm"
          textTransform="uppercase"

        >
          {order.status === 'closed' ? 'finalizado' : 'em andamento'}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails 
          icon={DesktopTower}
          title="equipamentos"
          description={`Patrimônio ${order.patrimony}`}
          />
        <CardDetails 
          icon={ClipboardText}
          title="Description do problema"
          footer={`Registrado em ${order.when}`}
          description={order.patrimony}
        />
        <CardDetails 
          title="solução"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrador em ${order.closed}`}
        >
          {
            order.status === 'open' &&
            <Input 
              h={24}
              multiline
              placeholder='Descrição da solução'
              onChangeText={setSolution}
              textAlignVertical="top"
            />
          }
        </CardDetails>
      </ScrollView>

      { order.status === 'open' &&
      <Button 
        title="Encerrar solicitação"
        m={5}
        onPress={handleOrderClosed}
      />}
    </VStack>
  );
}