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
  Text,
  useMedia,
  View,
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

const HeaderText = styled(H4, {
  textDecorationLine: "underline",
});

export default function ScreenBuild({
  route,
}: {
  route: RouteProp<NavigationProps, "Build">;
}) {
  const build = route.params.build;
  const media = useMedia();
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();

  const [sheets, setSheets] = useState(build.sheets);
  const [milestones, setMilestones] = useState(build.milestones);

  function navToMilestone(index: number) {
    nav.navigate("Milestone", {
      build: build,
      index: build.milestones.length - 1,
      onNameChanged: async () => {
        setMilestones([]);
        setMilestones([...milestones]);
      },
    });
  }

  function InfoTab({ build }: { build: Build }) {
    const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();

    const [name, setName] = useState(build.name);

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
              build.name = v;
              setName(v);
              nav.setOptions({});
              await saveBuild(build);
            }}
          />
        </XStack>
      </YStack>
    );
  }

  function MilestonesTab({ build }: { build: Build }) {
    const media = useMedia();
    const [rClicked, setRClicked] = useState(
      undefined as Milestone | undefined,
    );

    async function addMilestone() {
      build.milestones.push(
        new Milestone({
          name: uniqueName(
            build.milestones.map((m) => m.name),
            "New Milestone",
          ),
        }),
      );
      await saveBuild(build);
      setMilestones([...build.milestones]);
      navToMilestone(build.milestones.length - 1);
    }

    return (
      <YStack gap="$4">
        {milestones.length === 0 ? (
          <ReminderText>
            Milestones are checkpoints (such as levels) where a build gains
            traits or changes its statistics. Press &quot;
            {media.md ? "Add Milestone" : "+"}&quot; to add a new milestone!
          </ReminderText>
        ) : (
          <ContextMenu>
            <ContextMenu.Trigger asChild>
              <YGroup>
                {milestones.map((milestone, index) => (
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
                ))}
              </YGroup>
            </ContextMenu.Trigger>
            <ContextMenu.Portal zIndex={100}>
              <ContextMenu.Content>
                <ContextMenu.Item
                  theme="red"
                  onPress={async () => {
                    if (!rClicked) return;
                    const index = build.milestones.indexOf(rClicked);
                    if (index === -1) return;
                    build.milestones.splice(index, 1);
                    await saveBuild(build);
                    setMilestones([...build.milestones]);
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

  function SheetsTab({ build }: { build: Build }) {
    const media = useMedia();
    const [rClicked, setRClicked] = useState(undefined as Sheet | undefined);

    async function addSheet() {
      build.sheets.push(
        new Sheet({
          name: uniqueName(
            build.sheets.map((m) => m.name),
            "New Sheet",
          ),
        }),
      );
      await saveBuild(build);
      setSheets([...build.sheets]);
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
              <YGroup>
                {sheets.map((sheet, index) => (
                  <YGroup.Item
                    key={index}
                    onContextMenu={() => setRClicked(sheet)}
                  >
                    <ListItem>{sheet.name}</ListItem>
                  </YGroup.Item>
                ))}
              </YGroup>
            </ContextMenu.Trigger>
            <ContextMenu.Portal zIndex={100}>
              <ContextMenu.Content>
                <ContextMenu.Item
                  theme="red"
                  onPress={async () => {
                    if (!rClicked) return;
                    const index = build.sheets.indexOf(rClicked);
                    if (index === -1) return;
                    build.sheets.splice(index, 1);
                    await saveBuild(build);
                    setSheets([...build.sheets]);
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

  const tabStyle = {
    activeStyle: {
      backgroundColor: "$color3",
      borderBottomWidth: 0,
      fontWeight: "bold",
    },
    borderWidth: "$0.25",
    borderColor: "$borderColor",
    borderRadius: 0,
  };

  return (
    <Screen>
      {media.md ? (
        <XStack flex={1} alignItems="flex-start" padding="$4" gap="$4">
          <YStack flex={1} gap="$4">
            <InfoTab build={build} />
          </YStack>
          <Separator alignSelf="stretch" vertical />
          <YStack flex={1} gap="$4">
            <HeaderText>Milestones</HeaderText>
            <MilestonesTab build={build} />
          </YStack>
          <Separator alignSelf="stretch" vertical />
          <YStack flex={1} gap="$4">
            <HeaderText>Sheets</HeaderText>
            <SheetsTab build={build} />
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
              <Tabs.Tab {...tabStyle} value="info">
                <Text>Info</Text>
              </Tabs.Tab>
              <Tabs.Tab {...tabStyle} value="milestones">
                <Text>Milestones</Text>
              </Tabs.Tab>
              <Tabs.Tab {...tabStyle} value="sheets">
                <Text>Sheets</Text>
              </Tabs.Tab>
            </Tabs.List>
            <Button {...tabStyle} iconSize="$8" icon={<Icon name="menu" />}>
              <Text fontSize="$6">Settings</Text>
            </Button>
          </XStack>
          <View padding="$4">
            <Tabs.Content value="info">
              <InfoTab build={build} />
            </Tabs.Content>
            <Tabs.Content value="milestones">
              <MilestonesTab build={build} />
            </Tabs.Content>
            <Tabs.Content value="sheets">
              <SheetsTab build={build} />
            </Tabs.Content>
          </View>
        </Tabs>
      )}
    </Screen>
  );
}
