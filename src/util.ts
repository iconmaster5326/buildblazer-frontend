export function uniqueName(names: string[], name: string): string {
  let numberNeeded = 0;
  for (let index = 0; index < names.length; index++) {
    if (numberNeeded === 0 && names[index] === name) {
      numberNeeded = 2;
      index = 0;
    } else if (numberNeeded > 0 && names[index] === `${name} ${numberNeeded}`) {
      numberNeeded++;
      index = 0;
    }
  }
  if (numberNeeded > 0) {
    name = `${name} ${numberNeeded}`;
  }
  return name;
}
