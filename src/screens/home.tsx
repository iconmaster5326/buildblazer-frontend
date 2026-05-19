import Screen from "@/components/Screen";
import { Button, YStack, H1, H2 } from "tamagui";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { NavigationProps } from "@/app";

export default function ScreenHome() {
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  return (
    <Screen>
      <YStack gap="$4">
        <H1>Welcome to Buildblazer!</H1>
        <Button onPress={() => nav.navigate("NewBuild")}>
          <H2>New Build</H2>
        </Button>
        <Button onPress={() => nav.navigate("OpenBuild")}>
          <H2>Open Build</H2>
        </Button>
      </YStack>
    </Screen>
  );
}
