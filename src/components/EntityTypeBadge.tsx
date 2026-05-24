import { ENTITY_TYPE_INFO } from "@/entityTypes";
import { ListItem, useThemeName } from "tamagui";

export default function EntityTypeBadge({
  entityType,
}: {
  entityType: string;
}) {
  const theme = useThemeName();
  return (
    <ListItem.Title
      borderRadius="$2"
      paddingHorizontal="$2"
      paddingVertical="$1"
      alignSelf="flex-start"
      backgroundColor={
        ENTITY_TYPE_INFO[entityType].color[theme === "dark" ? "dark" : "light"]
      }
    >
      {ENTITY_TYPE_INFO[entityType].name}
    </ListItem.Title>
  );
}
