import Screen from "@/components/Screen";
import {
  Button,
  ContextMenu,
  H4,
  H5,
  Input,
  Label,
  ListItem,
  Separator,
  Strong,
  styled,
  Tabs,
  useMedia,
  useTheme,
  View,
  VisuallyHidden,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

import { Build, Milestone, Sheet } from "@buildblazer/core";

import { saveBuild } from "@/storage";
import { NavigationProps } from "@/app";
import { uniqueName } from "@/util";
import PlusButton from "@/components/PlusButton";
import ReminderText from "@/components/ReminderText";
import {
  REDUX_DISPATCH,
  REDUX_SELECTOR,
  useReduxDispatch,
  useReduxSelector,
} from "@/redux";
import { useDispatch } from "react-redux";

function InfoTab() {
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  const dispatch = useReduxDispatch();
  const name = useReduxSelector(REDUX_SELECTOR.buildName);

  return (
    <YStack gap="$4">
      <XStack gap="$4">
        <Label htmlFor="name">
          <H5>Name</H5>
        </Label>
        <Input
          flex={1}
          id="name"
          value={name}
          placeholder="New Build"
          onChangeText={async (v) => {
            await dispatch(REDUX_DISPATCH.buildName(v)).unwrap();
            nav.setOptions({});
          }}
        />
      </XStack>
    </YStack>
  );
}

const BBYGroup = styled(YGroup, {
  borderWidth: "$1",
  borderRadius: "$2",
  borderColor: "$borderColor",
});
const BBYGroupSeparator = styled(Separator, {
  borderWidth: "$0.5",
  borderColor: "$borderColor",
});

function MilestonesTab() {
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  const milestones = useReduxSelector(REDUX_SELECTOR.milestones);
  const dispatch = useDispatch();
  const media = useMedia();
  const [rClicked, setRClicked] = useState(undefined as Milestone | undefined);

  function navToMilestone(index: number) {
    nav.navigate("Milestone", {
      index: index,
    });
  }

  async function addMilestone() {
    await dispatch(
      REDUX_DISPATCH.milestones([
        ...milestones,
        new Milestone({
          name: uniqueName(
            milestones.map((m) => m.name),
            "New Milestone",
          ),
        }),
      ]),
    );
    navToMilestone(milestones.length);
  }

  return (
    <YStack gap="$4">
      {milestones.length === 0 ? (
        <ReminderText>
          Milestones are checkpoints (such as levels) where a build gains traits
          or changes its statistics. Press &quot;
          {media.md ? "Add Milestone" : "+"}&quot; to add a new milestone!
        </ReminderText>
      ) : (
        <ContextMenu>
          <ContextMenu.Trigger asChild>
            <BBYGroup>
              {milestones.map((milestone, index) => (
                <>
                  {index === 0 ? null : <BBYGroupSeparator />}
                  <YGroup.Item
                    key={index}
                    onContextMenu={() => setRClicked(milestone)}
                  >
                    <ListItem
                      onPress={async () => {
                        navToMilestone(index);
                      }}
                    >
                      {milestone.name}
                    </ListItem>
                  </YGroup.Item>
                </>
              ))}
            </BBYGroup>
          </ContextMenu.Trigger>
          <ContextMenu.Portal zIndex={100}>
            <ContextMenu.Content>
              <ContextMenu.Item
                theme="red"
                onPress={async () => {
                  if (!rClicked) return;
                  const index = milestones.indexOf(rClicked);
                  if (index === -1) return;
                  await dispatch(
                    REDUX_DISPATCH.milestones(milestones.toSpliced(index, 1)),
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
        <Button onPress={addMilestone}>Add Milestone</Button>
      ) : (
        <PlusButton onPress={addMilestone} />
      )}
    </YStack>
  );
}

function SheetsTab() {
  const media = useMedia();
  const milestones = useReduxSelector(REDUX_SELECTOR.milestones);
  const [rClicked, setRClicked] = useState(undefined as Sheet | undefined);
  const sheets = useReduxSelector(REDUX_SELECTOR.sheets);
  const dispatch = useDispatch();

  async function addSheet() {
    await dispatch(
      REDUX_DISPATCH.sheets([
        ...sheets,
        new Sheet({
          name: uniqueName(
            sheets.map((m) => m.name),
            "New Sheet",
          ),
        }),
      ]),
    );
  }

  return (
    <YStack gap="$4">
      {sheets.length === 0 ? (
        <ReminderText>
          Sheets are instances of your character at a certain milestone, where
          you can track their state and roll using thier statistics.&nbsp;
          {milestones.length !== 0 ? (
            <>
              Press &quot;{media.md ? "Add Sheet" : "+"}&quot; to add a new
              sheet!
            </>
          ) : (
            <>Make a milestone to make a sheet for it!</>
          )}
        </ReminderText>
      ) : (
        <ContextMenu>
          <ContextMenu.Trigger asChild>
            <BBYGroup>
              {sheets.map((sheet, index) => (
                <>
                  {index === 0 ? null : <BBYGroupSeparator />}
                  <YGroup.Item
                    key={index}
                    onContextMenu={() => setRClicked(sheet)}
                  >
                    <ListItem>{sheet.name}</ListItem>
                  </YGroup.Item>
                </>
              ))}
            </BBYGroup>
          </ContextMenu.Trigger>
          <ContextMenu.Portal zIndex={100}>
            <ContextMenu.Content>
              <ContextMenu.Item
                theme="red"
                onPress={async () => {
                  if (!rClicked) return;
                  const index = sheets.indexOf(rClicked);
                  if (index === -1) return;
                  await dispatch(
                    REDUX_DISPATCH.sheets(sheets.toSpliced(index, 1)),
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
        <Button disabled={milestones.length === 0} onPress={addSheet}>
          Add Sheet
        </Button>
      ) : (
        <PlusButton disabled={milestones.length === 0} onPress={addSheet} />
      )}
    </YStack>
  );
}

export default function ScreenBuild({
  route,
}: {
  route: RouteProp<NavigationProps, "Build">;
}) {
  const media = useMedia();
  const theme = useTheme();
  const BBTabIcon = styled(Icon, {
    size: 20,
    color: theme.color?.get(),
  });

  const tabStyle = {
    activeStyle: {
      backgroundColor: "$color3",
      borderBottomWidth: 0,
      fontWeight: "bold",
    },
    borderWidth: "$0.25",
    borderColor: "$borderColor",
    borderRadius: 0,
    gap: "$1.5",
  };
  const BBTab = styled(Tabs.Tab, tabStyle);

  const BBTabLabel = styled(VisuallyHidden, {
    visible: media.xs,
  });

  function Header(props: { children: any; icon: string }) {
    return (
      <XStack asChild gap="$2">
        <H4 textDecorationLine="underline">
          <BBTabIcon size={26} name={props.icon as any} /> {props.children}
        </H4>
      </XStack>
    );
  }

  return (
    <Screen>
      {media.md ? (
        <XStack flex={1} alignItems="flex-start" padding="$4" gap="$4">
          <YStack flex={1} gap="$4">
            <InfoTab />
          </YStack>
          <Separator alignSelf="stretch" vertical />
          <YStack flex={1} gap="$4">
            <Header icon="stairs">Milestones</Header>
            <MilestonesTab />
          </YStack>
          <Separator alignSelf="stretch" vertical />
          <YStack flex={1} gap="$4">
            <Header icon="file-document">Sheets</Header>
            <SheetsTab />
          </YStack>
        </XStack>
      ) : (
        <Tabs alignSelf="stretch" flex={1} defaultValue="info">
          <XStack
            flexDirection="row"
            justifyContent="space-between"
            backgroundColor="$color1"
          >
            <Tabs.List>
              <BBTab value="info">
                <BBTabIcon name="information" />
                <BBTabLabel>Info</BBTabLabel>
              </BBTab>
              <BBTab value="milestones">
                <BBTabIcon name="stairs" />
                <BBTabLabel>Milestones</BBTabLabel>
              </BBTab>
              <BBTab value="sheets">
                <BBTabIcon name="file-document" />
                <BBTabLabel>Sheets</BBTabLabel>
              </BBTab>
            </Tabs.List>
            <Button {...tabStyle} iconSize="$8" icon={<Icon name="menu" />} />
          </XStack>
          <View padding="$4">
            <Tabs.Content value="info">
              <InfoTab />
            </Tabs.Content>
            <Tabs.Content value="milestones">
              <MilestonesTab />
            </Tabs.Content>
            <Tabs.Content value="sheets">
              <SheetsTab />
            </Tabs.Content>
          </View>
        </Tabs>
      )}
    </Screen>
  );
}
