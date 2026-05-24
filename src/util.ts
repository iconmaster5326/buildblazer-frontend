import { NavigationProp, NavigationRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigationProps } from "./app";

export function uniqueName(names: string[], name: string): string {
  let numberNeeded = 0;
  for (let index = 0; index < names.length; index++) {
    if (numberNeeded === 0 && names[index] === name) {
      numberNeeded = 2;
      index = 0;
    } else if (numberNeeded > 0 && names[index] === `${name} ${numberNeeded}`) {
      numberNeeded++;
      index = 0;
    }
  }
  if (numberNeeded > 0) {
    name = `${name} ${numberNeeded}`;
  }
  return name;
}

export function paramsUp<T extends keyof NavigationProps>(
  nav: NativeStackNavigationProp<NavigationProps>,
  t: T,
): NavigationProps[T] {
  return nav.getState().routes.findLast((r) => r.name === t)
    ?.params as NavigationProps[T];
}

export function allParamsUp<T extends keyof NavigationProps>(
  nav: NativeStackNavigationProp<NavigationProps>,
  t: T,
): NavigationProps[T][] {
  return nav
    .getState()
    .routes.filter((r) => r.name === t && r.params)
    .map((r) => r?.params as NavigationProps[T]);
}
