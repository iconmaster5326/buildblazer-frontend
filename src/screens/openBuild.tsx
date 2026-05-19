import { useNavigation } from "@react-navigation/native";
import {
  ContextMenu,
  Dialog,
  Form,
  ListItem,
  Separator,
  Strong,
  Text,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { useEffect, useReducer, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import ModalScreen from "@/components/ModalScreen";
import { NavigationProps } from "@/app";
import { BuildSummary, deleteBuild, loadBuild, loadBuildList } from "@/storage";

export default function ScreenNewBuild() {
  const [buildList, setBuildList] = useState([] as BuildSummary[]);
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  const [buildChosen, setBuildChosen] = useState(
    undefined as BuildSummary | undefined,
  );
  const [buildRClicked, setBuildRClicked] = useState(
    undefined as BuildSummary | undefined,
  );
  const [update, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    (async () => {
      setBuildList(await loadBuildList());
    })();
  }, [update]);

  return (
    <ModalScreen
      title="Open Build"
      onDismiss={async () => {
        nav.goBack();
        if (buildChosen) {
          nav.navigate("Build", { build: await loadBuild(buildChosen.id) });
        }
      }}
    >
      <Form>
        <YStack gap="$2">
          <XStack gap="$4" flex={1}>
            <Strong flex={1}>Name</Strong>
            <Strong flex={1}>System</Strong>
            <Strong flex={1}>Last Modified</Strong>
          </XStack>
          <Separator />
          <ContextMenu>
            <ContextMenu.Trigger asChild>
              <YGroup>
                {buildList.length === 0 ? (
                  <Text>
                    You don&apos;t have any builds. Make one by pressing
                    &quot;New Build&quot;!
                  </Text>
                ) : (
                  buildList.map((summary, index) => (
                    <YGroup.Item key={index}>
                      <Form.Trigger asChild>
                        <Dialog.Close asChild>
                          <ListItem
                            onPress={() => setBuildChosen(summary)}
                            onContextMenu={() => setBuildRClicked(summary)}
                          >
                            <XStack gap="$4" flex={1}>
                              <Strong flex={1}>{summary.name}</Strong>
                              <Text flex={1}>{summary.system}</Text>
                              <Text flex={1}>
                                {new Date(summary.lastEditTime).toISOString()}
                              </Text>
                            </XStack>
                          </ListItem>
                        </Dialog.Close>
                      </Form.Trigger>
                    </YGroup.Item>
                  ))
                )}
              </YGroup>
            </ContextMenu.Trigger>
            <ContextMenu.Portal zIndex={100}>
              <ContextMenu.Content>
                <ContextMenu.Item>
                  {/* TODO */}
                  <ContextMenu.ItemTitle>Rename</ContextMenu.ItemTitle>
                </ContextMenu.Item>
                <ContextMenu.Item
                  theme="red"
                  onPress={async () => {
                    if (!buildRClicked) return;
                    await deleteBuild(buildRClicked.id);
                    forceUpdate();
                  }}
                >
                  <ContextMenu.ItemTitle>
                    <Strong>Delete</Strong>
                  </ContextMenu.ItemTitle>
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu.Portal>
          </ContextMenu>
        </YStack>
      </Form>
    </ModalScreen>
  );
}
