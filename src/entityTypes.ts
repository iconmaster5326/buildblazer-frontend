interface EntityTypeInfo {
  name: string;
  desc: string;
  color: {
    dark: string;
    light: string;
  };
}

export const ENTITY_TYPE_INFO: Record<string, EntityTypeInfo> = {
  counter: {
    name: "Counter",
    desc: "Keeps track of a numeric value that can go up and down on sheets, such as HP, ability uses, or money earned.",
    color: {
      dark: "#990000",
      light: "#ff0000",
    },
  },
  stat: {
    name: "Statistic",
    desc: "A number or die roll that can change as your character changes.",
    color: {
      dark: "#994400",
      light: "#ff8800",
    },
  },
  mod: {
    name: "Modifier",
    desc: "A single alteration to one of your statistics. Can be placed anywhere relative to that statistic.",
    color: {
      dark: "#999900",
      light: "#ffff00",
    },
  },
  toggle: {
    name: "Toggle",
    desc: "A switch on your sheets to influence statistics and modifiers.",
    color: {
      dark: "#449900",
      light: "#88ff00",
    },
  },
  section: {
    name: "Section",
    desc: "A grouping of traits. Used for tabs, sections, and rows.",
    color: {
      dark: "#009999",
      light: "#00ffff",
    },
  },
  trait: {
    name: "Trait",
    desc: "Describe something your character has.",
    color: {
      dark: "#000099",
      light: "#0000ff",
    },
  },
};
