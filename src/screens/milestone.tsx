import {
  Button,
  ContextMenu,
  H5,
  Input,
  Label,
  ListItem,
  Separator,
  Strong,
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
  REDUX_STORE,
  ReduxState,
  useReduxDispatch,
  useReduxSelector,
} from "@/redux";
import { createSelector } from "@reduxjs/toolkit";
import {
  Build,
  Change,
  ChangeAdd,
  ChangeDel,
  ChangeMove,
  ChangeSet,
  Entity,
} from "@buildblazer/core";
import { BUILDBLAZER } from "@/storage";
import { BBTab, BBTabBar, BBTabIcon, BBTabs } from "@/components/BBTabs";
import { BBYGroup, BBYGroupSeparator } from "@/components/BBItemList";
import { useEffect, useState } from "react";
import EntityChildList from "@/components/EntityChildList";

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

  return <EntityChildList entityID={id} />;
}

function ChangesTab({ index }: { index: number }) {
  const media = useMedia();
  const dispatch = useReduxDispatch();
  const changes = useReduxSelector(
    (state) => state.build.milestones[index].changes,
  );

  async function addChange() {}

  function changeIcon(change: Change): any {
    switch (change.changeType()) {
      case "add":
        return "plus";
      case "del":
        return "minus";
      case "move":
        return "cursor-move";
      case "set":
        return "equal";
    }
  }

  function describeChange(change: Change): string {
    const entity = REDUX_STORE.getState().entity as Entity | undefined;
    const subjectName =
      entity?.descendantOrSelf(change.subject)?.name ?? change.subject;
    switch (change.changeType()) {
      case "add":
        const toAdd = (change as ChangeAdd).entity;
        const addIndex = (change as ChangeAdd).index;
        return `Add ${toAdd.type}${toAdd.name ? ` '${toAdd.name}'` : ""} to '${subjectName}'${addIndex === undefined ? "" : ` at index ${addIndex}`}`;
      case "del":
        const toDel =
          entity?.descendantOrSelf((change as ChangeDel).entity)?.name ??
          (change as ChangeDel).entity;
        return `Delete '${toDel}' from '${subjectName}'`;
      case "move":
        const toMove =
          entity?.descendantOrSelf((change as ChangeMove).entity)?.name ??
          (change as ChangeMove).entity;
        const moveIndex = (change as ChangeMove).index;
        return `Move '${toMove}' from '${subjectName}' to index ${moveIndex}`;
      case "set":
        const value = JSON.stringify((change as ChangeSet).value);
        return `Set property '${change.property}' on '${subjectName}' to ${value}`;
    }
  }

  const [rClicked, setRClicked] = useState(undefined as number | undefined);

  return (
    <YStack gap="$4">
      {changes.length === 0 ? (
        <ReminderText>
          This milestone currently has no changes. Press &quot;
          {media.md ? "Add Change" : "+"}&quot; to add something!
        </ReminderText>
      ) : (
        <ContextMenu>
          <BBYGroup>
            {changes.map((change, changeIndex) => (
              <>
                {changeIndex === 0 ? null : <BBYGroupSeparator />}
                <ContextMenu.Trigger
                  asChild
                  onContextMenu={() => setRClicked(changeIndex)}
                >
                  <YGroup.Item key={changeIndex}>
                    <ListItem>
                      <XStack gap="$4">
                        <BBTabIcon name={changeIcon(change)} />
                        <Text>{describeChange(change)}</Text>
                      </XStack>
                    </ListItem>
                  </YGroup.Item>
                </ContextMenu.Trigger>
              </>
            ))}
          </BBYGroup>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.Item
                theme="red"
                onPress={async () => {
                  if (rClicked === undefined) return;
                  await dispatch(
                    REDUX_DISPATCH.removeChange({
                      milestone: index,
                      change: rClicked,
                    }),
                  );
                }}
              >
                <ContextMenu.ItemTitle>
                  <Strong>Delete</Strong>
                </ContextMenu.ItemTitle>
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu>
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
  const dipatch = useReduxDispatch();
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();

  useEffect(() => {
    const unsubscribe = nav.addListener("beforeRemove", async () => {
      dipatch(REDUX_DISPATCH.updateChangesFromEntity(index));
      unsubscribe();
    });
  }, [nav, index, dipatch]);

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
