import { REDUX_DISPATCH, useReduxDispatch, useReduxSelector } from "@/redux";
import { Counter } from "@buildblazer/core";
import { H5, Input, Label, XStack, YStack } from "tamagui";
import { BBTabIcon } from "../BBTabs";

export default function CounterEditor({ entityID }: { entityID: string }) {
  const defaultsTo = useReduxSelector(
    (state) =>
      (state.entity?.descendantOrSelf(entityID) as Counter)?.defaultsTo,
  );
  const min = useReduxSelector(
    (state) => (state.entity?.descendantOrSelf(entityID) as Counter)?.min,
  );
  const max = useReduxSelector(
    (state) => (state.entity?.descendantOrSelf(entityID) as Counter)?.max,
  );
  const dispatch = useReduxDispatch();

  return (
    <YStack gap="$4">
      <XStack gap="$4">
        <Label width={150} htmlFor="defaultsTo">
          <XStack alignItems="center" gap="$2">
            <BBTabIcon name="alpha-e-circle-outline" />
            <H5>Default Value</H5>
          </XStack>
        </Label>
        <Input
          flex={1}
          id="defaultsTo"
          value={defaultsTo}
          placeholder="0"
          onChangeText={async (v) => {
            await dispatch(
              REDUX_DISPATCH.counterDefault({ entity: entityID, value: v }),
            );
          }}
        />
      </XStack>
      <XStack gap="$4">
        <Label width={150} htmlFor="min">
          <XStack alignItems="center" gap="$2">
            <BBTabIcon name="alpha-e-circle-outline" />
            <H5>Minimum</H5>
          </XStack>
        </Label>
        <Input
          flex={1}
          id="min"
          value={min}
          placeholder="no minimum"
          onChangeText={async (v) => {
            await dispatch(
              REDUX_DISPATCH.counterMin({ entity: entityID, value: v }),
            );
          }}
        />
      </XStack>
      <XStack gap="$4">
        <Label width={150} htmlFor="max">
          <XStack alignItems="center" gap="$2">
            <BBTabIcon name="alpha-e-circle-outline" />
            <H5>Maximum</H5>
          </XStack>
        </Label>
        <Input
          flex={1}
          id="max"
          value={max}
          placeholder="no maximum"
          onChangeText={async (v) => {
            await dispatch(
              REDUX_DISPATCH.counterMax({ entity: entityID, value: v }),
            );
          }}
        />
      </XStack>
    </YStack>
  );
}
