import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import auth ,{FirebaseAuthTypes} from '@react-native-firebase/auth';

import AppRoutes from "./app.routes";
import SignIn from "../screens/SignIn";
import Loading from "../components/Loading";

export default function Routes(){
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>(null);

  useEffect(() => {
    const subScribe = auth()
      .onAuthStateChanged((response) => {
        setUser(response);
        setIsLoading(false);
      });

    return subScribe;
  }, []);

  if(isLoading) {
    return <Loading />
  }

  return (
    <NavigationContainer>
      { user ? <AppRoutes /> : <SignIn /> }
    </NavigationContainer>
  );
}