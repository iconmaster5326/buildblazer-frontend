import {
  Button,
  H5,
  Input,
  Label,
  ListItem,
  Separator,
  styled,
  Tabs,
  Text,
  useMedia,
  VisuallyHidden,
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
import { BUILDBLAZER } from "@/storage";
import { BBTab, BBTabBar, BBTabIcon, BBTabs } from "@/components/BBTabs";
import { BBYGroup, BBYGroupSeparator } from "@/components/BBItemList";
import { useEffect, useState } from "react";
import EntityTypeBadge from "@/components/EntityTypeBadge";

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

function TraitsTab({ index }: { index: number }) {
  const media = useMedia();
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  const dispatch = useReduxDispatch();

  const id = useReduxSelector((state) => state.build.id);
  const entity = useReduxSelector(
    createSelector(
      (state: ReduxState) => state.build,
      (build: Build) =>
        build.entityAfterMilestone(BUILDBLAZER, build.milestones[index]),
    ),
  );

  useEffect(() => {
    dispatch(REDUX_DISPATCH.entity(entity));
  }, [dispatch, entity]);

  async function addTrait() {
    nav.navigate("NewEntity", { parent: id });
  }

  return (
    <YStack gap="$4">
      {entity.children.length === 0 ? (
        <ReminderText>
          This character currently has no traits. Press &quot;
          {media.md ? "Add Trait" : "+"}&quot; to add something!
        </ReminderText>
      ) : (
        <BBYGroup>
          {entity.children.map((child, index) => (
            <>
              {index === 0 ? null : <BBYGroupSeparator />}
              <YGroup.Item key={index}>
                <ListItem
                  onPress={() => {
                    nav.navigate("EditEntity", { entity: child.id });
                  }}
                >
                  <XStack flex={1} alignItems="center" gap="$4">
                    <Text width={70}>
                      <EntityTypeBadge entityType={child.entityType()} />
                    </Text>
                    <Text flexGrow={1}>{child.name}</Text>
                    <ListItem.Subtitle flexGrow={1}>
                      {child.varName}
                    </ListItem.Subtitle>
                  </XStack>
                </ListItem>
              </YGroup.Item>
            </>
          ))}
        </BBYGroup>
      )}
      {media.md ? (
        <Button onPress={addTrait}>Add Trait</Button>
      ) : (
        <PlusButton onPress={addTrait} />
      )}
    </YStack>
  );
}

function ChangesTab({ index }: { index: number }) {
  const media = useMedia();
  const dispatch = useReduxDispatch();
  const changes = useReduxSelector(
    (state) => state.build.milestones[index].changes,
  );

  async function addChange() {}

  return (
    <YStack gap="$4">
      {changes.length === 0 ? (
        <ReminderText>
          This milestone currently has no changes. Press &quot;
          {media.md ? "Add Change" : "+"}&quot; to add something!
        </ReminderText>
      ) : (
        <BBYGroup>
          {changes.map((change, changeIndex) => (
            <>
              {changeIndex === 0 ? null : <BBYGroupSeparator />}
              <YGroup.Item key={changeIndex}>
                <ListItem
                  onPress={async () => {
                    await dispatch(
                      REDUX_DISPATCH.removeChange({
                        milestone: index,
                        change: changeIndex,
                      }),
                    );
                  }}
                >
                  {JSON.stringify(change.toJSON())}
                </ListItem>
              </YGroup.Item>
            </>
          ))}
        </BBYGroup>
      )}
      {media.md ? (
        <Button onPress={addChange}>Add Change</Button>
      ) : (
        <PlusButton onPress={addChange} />
      )}
    </YStack>
  );
}

function PreviewTab({ index }: { index: number }) {
  return <YStack gap="$4"></YStack>;
}

export default function ScreenMilestone({
  route,
}: {
  route: RouteProp<NavigationProps, "Milestone">;
}) {
  const index = route.params.index;

  const media = useMedia();

  const BBTabLabel = styled(VisuallyHidden, {
    visible: media.xs,
  });

  return (
    <Screen>
      <BBTabs defaultValue="traits">
        <BBTabBar>
          <Tabs.List>
            <BBTab value="traits">
              <BBTabIcon name="sword-cross" />
              <BBTabLabel>Traits</BBTabLabel>
            </BBTab>
            <BBTab value="changes">
              <BBTabIcon name="plus-minus" />
              <BBTabLabel>Changelog</BBTabLabel>
            </BBTab>
            <BBTab value="preview">
              <BBTabIcon name="eye" />
              <BBTabLabel>Preview Sheet</BBTabLabel>
            </BBTab>
          </Tabs.List>
        </BBTabBar>
        <YStack flex={1} alignSelf="stretch" gap="$4" padding="$4">
          <MilestoneName index={index} />
          <Separator />
          <Tabs.Content value="traits">
            <TraitsTab index={index} />
          </Tabs.Content>
          <Tabs.Content value="changes">
            <ChangesTab index={index} />
          </Tabs.Content>
          <Tabs.Content value="preview">
            <PreviewTab index={index} />
          </Tabs.Content>
        </YStack>
      </BBTabs>
    </Screen>
  );
}
