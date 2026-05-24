import {
  createSlice,
  configureStore,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";

import { BuildGeneric } from "@buildblazer/system-generic";

import {
  BUILDBLAZER,
  BuildSummary,
  deleteBuild,
  loadBuild,
  loadBuildList,
  saveBuild,
} from "@/storage";
import { Build, Entity, Milestone, Sheet } from "@buildblazer/core";

const initState = {
  builds: [] as BuildSummary[],
  build: undefined as any as Build,
  entity: undefined as any as Entity,
};
export type ReduxState = typeof initState;

const STORE_PREFIX = "buildblazer";

const reducers = {
  milestones: (state: ReduxState, { payload }: PayloadAction<Milestone[]>) => {
    state.build.milestones = payload;
  },
  sheets: (state: ReduxState, { payload }: PayloadAction<Sheet[]>) => {
    state.build.sheets = payload;
  },
  milestoneName: (
    state: ReduxState,
    {
      payload: { index, value },
    }: PayloadAction<{
      index: number;
      value: string;
    }>,
  ) => {
    state.build.milestones[index].name = value;
  },
  entity: (state: ReduxState, { payload }: PayloadAction<Entity>) => {
    state.entity = payload;
  },
  addChild: (
    state: ReduxState,
    {
      payload,
    }: PayloadAction<{
      parentID: string;
      newEntity: Entity;
    }>,
  ) => {
    state.entity
      .descendantOrSelf(payload.parentID)
      ?.children.push(payload.newEntity);
  },
  updateChangesFromEntity: (
    state: ReduxState,
    { payload }: PayloadAction<number>,
  ) => {
    const milestone = state.build.milestones[payload];
    const before = state.build.entityBeforeMilestone(BUILDBLAZER, milestone);
    milestone.changes = before.compare(state.entity);
  },
  entityName: (
    state: ReduxState,
    {
      payload,
    }: PayloadAction<{
      entityID: string;
      value: string;
    }>,
  ) => {
    const entity = state.entity.descendantOrSelf(payload.entityID);
    if (entity) entity.name = payload.value;
  },
  entityVarName: (
    state: ReduxState,
    {
      payload,
    }: PayloadAction<{
      entityID: string;
      value: string;
    }>,
  ) => {
    const entity = state.entity.descendantOrSelf(payload.entityID);
    if (entity) entity.varName = payload.value;
  },
  removeChange: (
    state: ReduxState,
    {
      payload,
    }: PayloadAction<{
      milestone: number;
      change: number;
    }>,
  ) => {
    state.build.milestones[payload.milestone].changes.splice(payload.change, 1);
  },
};

const thunk = createAsyncThunk.withTypes<{
  state: ReduxState;
  dispatch: ReduxDispatch;
  rejectValue: any;
}>();

const thunks = {
  loadBuilds: thunk(`${STORE_PREFIX}/loadBuilds`, loadBuildList),
  deleteBuild: thunk(
    `${STORE_PREFIX}/deleteBuild`,
    async (id: string, thunkAPI) => {
      await deleteBuild(id);
      await thunkAPI.dispatch(REDUX_DISPATCH.loadBuilds());
    },
  ),
  newBuild: thunk(
    `${STORE_PREFIX}/newBuild`,
    async (
      args: { name: string; system: string },
      thunkAPI,
    ): Promise<Build> => {
      const build = new BuildGeneric({
        name: args.name,
      });
      await saveBuild(build);
      await thunkAPI.dispatch(REDUX_DISPATCH.loadBuilds());
      return build;
    },
  ),
  loadBuild: thunk(`${STORE_PREFIX}/loadBuild`, loadBuild),
  buildName: thunk(`${STORE_PREFIX}/buildName`, async (_: string, thunkAPI) => {
    const build = thunkAPI.getState().build;
    await saveBuild(build);
    await thunkAPI.dispatch(REDUX_DISPATCH.loadBuilds());
  }),
};

const selectors = {
  builds: (state: ReduxState) => state.builds,
  build: (state: ReduxState) => state.build,
  buildName: (state: ReduxState) => state.build.name,
  milestones: (state: ReduxState) => state.build.milestones,
  sheets: (state: ReduxState) => state.build.sheets,
  entity: (state: ReduxState) => state.entity,
};

export const REDUX_SLICE = createSlice({
  name: STORE_PREFIX,
  selectors: selectors,
  initialState: initState,
  reducers: reducers,
  extraReducers: (builder) =>
    builder
      .addAsyncThunk(thunks.loadBuilds, {
        fulfilled: (state, { payload }) => {
          state.builds = payload;
        },
      })
      .addAsyncThunk(thunks.deleteBuild, {})
      .addAsyncThunk(thunks.newBuild, {
        fulfilled: (state, { payload }) => {
          state.build = payload;
        },
      })
      .addAsyncThunk(thunks.loadBuild, {
        fulfilled: (state, { payload }) => {
          state.build = payload;
        },
      })
      .addAsyncThunk(thunks.buildName, {
        pending: (state, { meta }) => {
          state.build.name = meta.arg;
        },
      }),
});

export const REDUX_STORE = configureStore({
  reducer: REDUX_SLICE.reducer,
  preloadedState: initState,
});

export const REDUX_DISPATCH = {
  ...thunks,
  ...REDUX_SLICE.actions,
};
export const REDUX_SELECTOR = selectors;

export type ReduxDispatch = typeof REDUX_STORE.dispatch;

export const useReduxDispatch = useDispatch.withTypes<ReduxDispatch>();
export const useReduxSelector = useSelector.withTypes<ReduxState>();

export function ReduxProvider({ children }: any) {
  return <Provider store={REDUX_STORE}>{children}</Provider>;
}

REDUX_STORE.dispatch(REDUX_DISPATCH.loadBuilds());
