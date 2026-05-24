import { REDUX_DISPATCH, useReduxDispatch, useReduxSelector } from "@/redux";
import { Modifier, Statistic } from "@buildblazer/core";
import { H5, Input, Label, Select, XStack, YStack } from "tamagui";
import { BBTabIcon } from "../BBTabs";

function ModStat({ entityID }: { entityID: string }) {
  const stat = useReduxSelector(
    (state) => (state.entity?.descendantOrSelf(entityID) as Modifier)?.stat,
  );
  const availableStats = useReduxSelector((state) =>
    Object.values(state.entity?.uuidMap() ?? {})
      .filter((e) => e instanceof Statistic)
      .map((e) => [e.id, e.name || e.varName || "Unnamed Statistic"]),
  );
  const dispatch = useReduxDispatch();

  return (
    <XStack gap="$4">
      <Label width={150} htmlFor="stat">
        <XStack alignItems="center" gap="$2">
          <H5>Statistic</H5>
        </XStack>
      </Label>
      <Select
        value={stat}
        onValueChange={async (v) => {
          await dispatch(
            REDUX_DISPATCH.modStat({ entity: entityID, value: v }),
          );
        }}
      >
        <Select.Trigger flex={1}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.ScrollUpButton />
          <Select.Viewport>
            <Select.Item index={0} value="">
              <Select.ItemText></Select.ItemText>
            </Select.Item>
            {availableStats.map(([otherID, otherName], index) => (
              <Select.Item key={index} index={index + 1} value={otherID}>
                <Select.ItemText>{otherName}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton />
        </Select.Content>
      </Select>
    </XStack>
  );
}

export default function ModEditor({ entityID }: { entityID: string }) {
  const op = useReduxSelector(
    (state) => (state.entity?.descendantOrSelf(entityID) as Modifier)?.op,
  );
  const value = useReduxSelector(
    (state) => (state.entity?.descendantOrSelf(entityID) as Modifier)?.value,
  );
  const condition = useReduxSelector(
    (state) =>
      (state.entity?.descendantOrSelf(entityID) as Modifier)?.condition,
  );
  const dispatch = useReduxDispatch();

  return (
    <YStack gap="$4">
      <ModStat entityID={entityID} />
      <XStack gap="$4">
        <Label width={150} htmlFor="op">
          <XStack alignItems="center" gap="$2">
            <H5>Operation</H5>
          </XStack>
        </Label>
        <Select
          value={op}
          onValueChange={async (v) => {
            await dispatch(
              REDUX_DISPATCH.modOp({ entity: entityID, value: v }),
            );
          }}
        >
          <Select.Trigger flex={1}>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.ScrollUpButton />
            <Select.Viewport>
              <Select.Item index={0} value="set">
                <Select.ItemText>Override</Select.ItemText>
              </Select.Item>
              <Select.Item index={1} value="add">
                <Select.ItemText>Add</Select.ItemText>
              </Select.Item>
              <Select.Item index={2} value="sub">
                <Select.ItemText>Subtract</Select.ItemText>
              </Select.Item>
              <Select.Item index={3} value="mul">
                <Select.ItemText>Multiply</Select.ItemText>
              </Select.Item>
              <Select.Item index={4} value="div">
                <Select.ItemText>Divide</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
            <Select.ScrollDownButton />
          </Select.Content>
        </Select>
      </XStack>
      <XStack gap="$4">
        <Label width={150} htmlFor="value">
          <XStack alignItems="center" gap="$2">
            <BBTabIcon name="alpha-e-circle-outline" />
            <H5>Value</H5>
          </XStack>
        </Label>
        <Input
          flex={1}
          id="value"
          value={value}
          placeholder="0"
          onChangeText={async (v) => {
            await dispatch(
              REDUX_DISPATCH.modValue({ entity: entityID, value: v }),
            );
          }}
        />
      </XStack>
      <XStack gap="$4">
        <Label width={150} htmlFor="condition">
          <XStack alignItems="center" gap="$2">
            <BBTabIcon name="alpha-e-circle-outline" />
            <H5>Condition</H5>
          </XStack>
        </Label>
        <Input
          flex={1}
          id="condition"
          value={condition}
          placeholder="always applies"
          onChangeText={async (v) => {
            await dispatch(
              REDUX_DISPATCH.modCondition({ entity: entityID, value: v }),
            );
          }}
        />
      </XStack>
    </YStack>
  );
}
