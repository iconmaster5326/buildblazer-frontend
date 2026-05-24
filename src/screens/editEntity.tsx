import { NavigationProps } from "@/app";
import EntityChildList from "@/components/EntityChildList";
import Screen from "@/components/Screen";
import { ENTITY_TYPE_INFO } from "@/entityTypes";
import { REDUX_DISPATCH, useReduxDispatch, useReduxSelector } from "@/redux";
import { paramsUp } from "@/util";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { H5, Input, Label, Separator, XStack, YStack } from "tamagui";

function EntityName({ entityID }: { entityID: string }) {
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  const name = useReduxSelector(
    (state) => state.entity.descendantOrSelf(entityID)?.name ?? "",
  );
  const dispatch = useReduxDispatch();

  return (
    <XStack gap="$4">
      <Label width={150} htmlFor="name">
        <H5>Name</H5>
      </Label>
      <Input
        flex={1}
        id="name"
        value={name}
        onChangeText={async (v) => {
          await dispatch(
            REDUX_DISPATCH.entityName({ entityID: entityID, value: v }),
          );
          nav.setOptions({});
        }}
      />
    </XStack>
  );
}

function EntityVarName({ entityID }: { entityID: string }) {
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  const name = useReduxSelector(
    (state) => state.entity.descendantOrSelf(entityID)?.varName ?? "",
  );
  const dispatch = useReduxDispatch();

  return (
    <XStack gap="$4">
      <Label width={150} htmlFor="varname">
        <H5>Variable Name</H5>
      </Label>
      <Input
        flex={1}
        id="varname"
        value={name}
        onChangeText={async (v) => {
          await dispatch(
            REDUX_DISPATCH.entityVarName({ entityID: entityID, value: v }),
          );
          nav.setOptions({});
        }}
      />
    </XStack>
  );
}

export default function ScreenEditEntity({
  route,
}: {
  route: RouteProp<NavigationProps, "EditEntity">;
}) {
  const dipatch = useReduxDispatch();

  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  const milestoneIndex = paramsUp(nav, "Milestone").index;
  const etype = useReduxSelector(
    (state) =>
      state.entity?.descendantOrSelf(route.params.entity)?.entityType() ?? "",
  );

  useEffect(() => {
    const unsubscribe = nav.addListener("beforeRemove", async () => {
      dipatch(REDUX_DISPATCH.updateChangesFromEntity(milestoneIndex));
      unsubscribe();
    });
  }, [nav, milestoneIndex, dipatch]);

  const Editor = ENTITY_TYPE_INFO[etype]?.editor ?? (() => <></>);

  return (
    <Screen>
      <YStack flex={1} alignSelf="stretch" padding="$4" gap="$4">
        <EntityName entityID={route.params.entity} />
        <EntityVarName entityID={route.params.entity} />
        <Editor entityID={route.params.entity} />
        <Separator />
        <EntityChildList entityID={route.params.entity} />
      </YStack>
    </Screen>
  );
}
