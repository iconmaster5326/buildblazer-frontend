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
import { immerable } from "immer";

import ScreenHome from "@/screens/home";
import ScreenNewBuild from "@/screens/newBuild";
import ScreenOpenBuild from "@/screens/openBuild";
import ScreenBuild from "@/screens/build";
import ScreenMilestone from "@/screens/milestone";
import ScreenNewEntity from "@/screens/newEntity";
import { REDUX_STORE, ReduxProvider } from "@/redux";
import { saveBuild } from "@/storage";

// set up Immer
import * as bb from "@buildblazer/core";
import * as sysGeneric from "@buildblazer/system-generic";
import ScreenEditEntity from "@/screens/editEntity";
import { allParamsUp, paramsUp } from "@/util";

for (const module of [bb, sysGeneric]) {
  for (const clazz of Object.values(module)) {
    if (typeof clazz === "function") {
      (clazz as any)[immerable] = true;
    }
  }
}

// set up React Navigation
export type NavigationProps = {
  Home: undefined;
  NewBuild: undefined;
  OpenBuild: undefined;
  Build: {
    id: string;
  };
  Milestone: {
    index: number;
  };
  NewEntity: {
    parent: string;
  };
  EditEntity: {
    entity: string;
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
          title: REDUX_STORE.getState().build.name,
          headerRight: header,
        };
      },
    },
    Milestone: {
      screen: ScreenMilestone,
      options: ({ route }) => {
        return {
          title: `${REDUX_STORE.getState().build.name} / ${REDUX_STORE.getState().build.milestones[route.params.index].name}`,
          headerRight: header,
        };
      },
    },
    NewEntity: {
      screen: ScreenNewEntity,
      options: {
        title: "New Trait",
        presentation: "transparentModal",
        headerShown: false,
      },
    },
    EditEntity: {
      screen: ScreenEditEntity,
      options: (nav) => {
        const state = REDUX_STORE.getState();
        const milestoneIndex = paramsUp(nav.navigation, "Milestone").index;
        const milestoneName = state.build.milestones[milestoneIndex].name;
        const entityPathParts = allParamsUp(nav.navigation, "EditEntity")
          .map((e) => state.entity.descendantOrSelf(e.entity))
          .filter((e) => e && e.name)
          .map((e) => e?.name)
          .join(" / ");
        return {
          title: `${state.build.name} / ${milestoneName} / ${entityPathParts}`,
          headerRight: header,
        };
      },
    },
  },
});

function ReactNavigation() {
  const theme = useThemeName();

  const Navigation = createStaticNavigation(stack);
  return <Navigation theme={theme === "dark" ? DarkTheme : DefaultTheme} />;
}

// Set up tamagui
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

// Set up the autosave timer
const AUTOSAVE_INTERVAL = 1000;
let lastAutosave = Date.now();
let autosaveInProgress = false;

REDUX_STORE.subscribe(() => {
  const now = Date.now();
  if (!autosaveInProgress && now - lastAutosave >= AUTOSAVE_INTERVAL) {
    autosaveInProgress = true;
    requestIdleCallback(async () => {
      const state = REDUX_STORE.getState();
      if (state.build) {
        await saveBuild(state.build);
        lastAutosave = now;
        autosaveInProgress = false;
      }
    });
  }
});

// Return the core component of our app
export default function Index() {
  return (
    <ReduxProvider>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
        <ReactNavigation />
      </TamaguiProvider>
    </ReduxProvider>
  );
}
