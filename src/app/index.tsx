import {
  createStaticNavigation,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  H3,
  TamaguiProvider,
  createTamagui,
  isWeb,
  useThemeName,
} from "tamagui";
import { defaultConfig as defaultTamaguiConfig } from "@tamagui/config/v5";
import { animations as tamaguiAnimationsCSS } from "@tamagui/config/v5-css";
import { animations as tamaguiAnimationsReanimated } from "@tamagui/config/v5-reanimated";
import "@tamagui/native/setup-teleport";

import { Build } from "@buildblazer/core";

import ScreenHome from "@/screens/home";
import ScreenNewBuild from "@/screens/newBuild";
import ScreenOpenBuild from "@/screens/openBuild";
import ScreenBuild from "@/screens/build";
import ScreenMilestone from "@/screens/milestone";

export type NavigationProps = {
  Home: undefined;
  NewBuild: undefined;
  OpenBuild: undefined;
  Build: {
    build: Build;
  };
  Milestone: {
    build: Build;
    index: number;
    onNameChanged?: (value: string) => void;
  };
};
const header = () => <H3 padding="$4">Buildblazer</H3>;
const stack = createNativeStackNavigator<NavigationProps>({
  initialRouteName: "Home",
  screens: {
    Home: {
      screen: ScreenHome,
      options: {
        headerTitle: header,
      },
    },
    NewBuild: {
      screen: ScreenNewBuild,
      options: {
        title: "New Build",
        presentation: "transparentModal",
        headerShown: false,
      },
    },
    OpenBuild: {
      screen: ScreenOpenBuild,
      options: {
        title: "Open Build",
        presentation: "transparentModal",
        headerShown: false,
      },
    },
    Build: {
      screen: ScreenBuild,
      options: ({ route }) => {
        return {
          title: route.params.build.name,
          headerRight: header,
        };
      },
    },
    Milestone: {
      screen: ScreenMilestone,
      options: ({ route }) => {
        return {
          title: `${route.params.build.name} / ${route.params.build.milestones[route.params.index].name}`,
          headerRight: header,
        };
      },
    },
  },
});
const Navigation = createStaticNavigation(stack);

const tamaguiConfig = createTamagui({
  ...defaultTamaguiConfig,
  animations: isWeb ? tamaguiAnimationsCSS : tamaguiAnimationsReanimated,
  settings: {
    ...defaultTamaguiConfig.settings,
    disableSSR: true,
    allowedStyleValues: "somewhat-strict",
    onlyShorthandStyleProps: false,
    onlyAllowShorthands: false,
  },
});

function ReactNavigation() {
  const theme = useThemeName();
  return <Navigation theme={theme === "dark" ? DarkTheme : DefaultTheme} />;
}

export default function Index() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <ReactNavigation />
    </TamaguiProvider>
  );
}
