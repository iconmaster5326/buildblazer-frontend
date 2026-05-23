import {
  Button,
  H5,
  Input,
  Label,
  ListItem,
  Separator,
  useMedia,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "@/components/Screen";
import { NavigationProps } from "@/app";
import ReminderText from "@/components/ReminderText";
import PlusButton from "@/components/PlusButton";
import {
  REDUX_DISPATCH,
  ReduxState,
  useReduxDispatch,
  useReduxSelector,
} from "@/redux";
import { createSelector } from "@reduxjs/toolkit";
import { Build } from "@buildblazer/core";

function MilestoneName({ index }: { index: number }) {
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  const name = useReduxSelector((state) => state.build.milestones[index].name);
  const dispatch = useReduxDispatch();

  return (
    <XStack gap="$4">
      <Label htmlFor="name">
        <H5>Name</H5>
      </Label>
      <Input
        flex={1}
        id="name"
        value={name}
        onChangeText={async (v) => {
          await dispatch(
            REDUX_DISPATCH.milestoneName({ index: index, value: v }),
          );
          nav.setOptions({});
        }}
      />
    </XStack>
  );
}

function MilestoneChanges({ index }: { index: number }) {
  const media = useMedia();
  const entity = useReduxSelector(
    createSelector(
      (state: ReduxState) => state.build,
      (build: Build) => build.entityAfterMilestone(build.milestones[index]),
    ),
  );

  return entity.children.length === 0 ? (
    <ReminderText>
      This character currently has no traits. Press &quot;
      {media.md ? "Add Trait" : "+"}&quot; to add something!
    </ReminderText>
  ) : (
    <YGroup>
      {entity.children.map((child, index) => (
        <YGroup.Item key={index}>
          <ListItem>{child.name}</ListItem>
        </YGroup.Item>
      ))}
    </YGroup>
  );
}

export default function ScreenMilestone({
  route,
}: {
  route: RouteProp<NavigationProps, "Milestone">;
}) {
  const index = route.params.index;

  const media = useMedia();
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();

  function pickEntityType() {
    nav.navigate("PickEntityType");
  }

  return (
    <Screen>
      <YStack flex={1} alignSelf="stretch" gap="$4" padding="$4">
        <MilestoneName index={index} />
        <Separator />
        <MilestoneChanges index={index} />
        {media.md ? (
          <Button onPress={pickEntityType}>Add Trait</Button>
        ) : (
          <PlusButton onPress={pickEntityType} />
        )}
      </YStack>
    </Screen>
  );
}
