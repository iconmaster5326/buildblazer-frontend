import Screen from "@/components/Screen";
import { YStack } from "tamagui";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { NavigationProps } from "@/app";

export default function ScreenBuild() {
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  return <Screen></Screen>;
}
