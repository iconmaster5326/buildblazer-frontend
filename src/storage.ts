import { createAsyncStorage } from "@react-native-async-storage/async-storage";

import { Build, Buildblazer } from "@buildblazer/core";
import { BuildGeneric } from "@buildblazer/system-generic";

export const BUILDBLAZER = new Buildblazer({
  systems: [BuildGeneric.SYSTEM],
});

const STORAGE = createAsyncStorage("buildblazer");

export interface BuildSummary {
  id: string;
  name: string;
  system: string;
  lastEditTime: number;
}

export async function loadBuildList(): Promise<BuildSummary[]> {
  const value = await STORAGE.getItem("builds");
  return value ? JSON.parse(value) : [];
}

async function saveBuildList(builds: BuildSummary[]): Promise<void> {
  await STORAGE.setItem("builds", JSON.stringify(builds));
}

export async function loadBuild(id: string): Promise<Build> {
  const value = await STORAGE.getItem(`build_${id}`);
  if (!value) {
    throw new Error(`Could not load build with ID '${id}'!`);
  }
  return BUILDBLAZER.buildFromJSON(JSON.parse(value));
}

export async function saveBuild(build: Build): Promise<void> {
  const builds = await loadBuildList();

  await STORAGE.setItem(`build_${build.id}`, JSON.stringify(build.toJSON()));

  const index = builds.findIndex((summary) => summary.id === build.id);
  if (index === -1) {
    builds.push({
      id: build.id,
      name: build.name,
      system: build.systemName(),
      lastEditTime: Date.now(),
    });
  } else {
    builds[index].name = build.name;
    builds[index].lastEditTime = Date.now();
  }
  await saveBuildList(builds);
}

export async function deleteBuild(id: string): Promise<void> {
  const builds = await loadBuildList();
  const index = builds.findIndex((summary) => summary.id === id);
  if (index !== -1) {
    builds.splice(index, 1);
    await saveBuildList(builds);
  }

  await STORAGE.removeItem(`build_${id}`);
}
