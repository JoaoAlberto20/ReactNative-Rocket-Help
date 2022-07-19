import { NavigationContainer } from "@react-navigation/native";

import AppRoutes from "./app.routes";
// import SignIn from "../screens/SignIn";

export default function Routes(){
  return (
    
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  );
}