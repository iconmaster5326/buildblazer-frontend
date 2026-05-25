import { REDUX_SELECTOR, useReduxSelector } from "@/redux";
import {
  Counter,
  Entity,
  parseExpression,
  Sheet,
  Statistic,
  Toggle,
} from "@buildblazer/core";
import { Section, Trait } from "@buildblazer/system-generic";
import {
  H5,
  Input,
  Label,
  Separator,
  Switch,
  Text,
  XStack,
  YStack,
} from "tamagui";

function viewerFor(sheet: Sheet, entity: Entity, nestLevel: number): any {
  if (entity instanceof Counter) {
    return <CounterView sheet={sheet} entity={entity} nestLevel={nestLevel} />;
  } else if (entity instanceof Statistic) {
    return (
      <StatisticView sheet={sheet} entity={entity} nestLevel={nestLevel} />
    );
  } else if (entity instanceof Toggle) {
    return <ToggleView sheet={sheet} entity={entity} nestLevel={nestLevel} />;
  } else if (entity instanceof Section) {
    return <SectionView sheet={sheet} entity={entity} nestLevel={nestLevel} />;
  } else if (entity instanceof Trait) {
    return <TraitView sheet={sheet} entity={entity} nestLevel={nestLevel} />;
  } else {
    return <></>;
  }
}

function CounterView({
  sheet,
  entity,
}: {
  sheet: Sheet;
  nestLevel: number;
  entity: Counter;
}) {
  const sheetValue = sheet.counters[entity.id];
  const value =
    sheetValue === undefined
      ? entity.defaultsTo
        ? parseExpression(entity.defaultsTo).eval(entity.evalContext())
        : 0
      : sheetValue;

  return (
    <XStack key={entity.id} gap="$4">
      <Label width={150} htmlFor={entity.id}>
        <H5>{entity.name || entity.varName}</H5>
      </Label>
      <Input flex={1} id={entity.id} value={value} />
    </XStack>
  );
}

function StatisticView({
  entity,
}: {
  sheet: Sheet;
  nestLevel: number;
  entity: Statistic;
}) {
  const value = entity.eval(entity.evalContext());

  return (
    <XStack key={entity.id} gap="$4">
      <Label width={150} htmlFor={entity.id}>
        <H5>{entity.name || entity.varName}</H5>
      </Label>
      <Input flex={1} id={entity.id} value={value} />
    </XStack>
  );
}

function ToggleView({
  sheet,
  entity,
}: {
  sheet: Sheet;
  nestLevel: number;
  entity: Toggle;
}) {
  return (
    <XStack key={entity.id} gap="$4">
      <Label width={150} htmlFor={entity.id}>
        <H5>{entity.name || entity.varName}</H5>
      </Label>
      <Switch
        id={entity.id}
        size="$4"
        activeStyle={{
          backgroundColor: "$color6",
        }}
        padding={0}
        checked={sheet.toggles[entity.id]}
      >
        <Switch.Thumb transition="quickest" />
      </Switch>
    </XStack>
  );
}

function SectionView({
  sheet,
  entity,
  nestLevel,
}: {
  sheet: Sheet;
  nestLevel: number;
  entity: Section;
}) {
  return (
    <YStack key={entity.id} alignItems="stretch" gap="$4">
      <XStack alignItems="center" gap="$4">
        <Text>{entity.name || entity.varName}</Text>
        <Separator borderColor="$color9" />
      </XStack>
      {entity.children.map((child) => viewerFor(sheet, child, nestLevel + 1))}
      <Separator borderColor="$color9" />
    </YStack>
  );
}

function TraitView({
  entity,
}: {
  sheet: Sheet;
  nestLevel: number;
  entity: Trait;
}) {
  return (
    <XStack key={entity.id} gap="$4">
      <Label width={150} htmlFor={entity.id}>
        <H5>{entity.name || entity.varName}</H5>
      </Label>
      <Text flex={1} id={entity.id}>
        {entity.description}
      </Text>
    </XStack>
  );
}

export default function SheetView({ sheet }: { sheet: Sheet }) {
  const milestone = useReduxSelector((state) =>
    state.build.milestones.find((m) => m.name === sheet.milestone),
  );
  const entity = useReduxSelector(REDUX_SELECTOR.entity);

  if (!milestone) {
    return (
      <Text>
        Error: could not find milestone &quot;{sheet.milestone}&quot;!
      </Text>
    );
  }

  return (
    <YStack alignItems="stretch" gap="$4">
      {entity.children.map((child) => {
        return viewerFor(sheet, child, 0);
      })}
    </YStack>
  );
}
