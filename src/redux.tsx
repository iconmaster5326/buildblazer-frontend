import {
  createSlice,
  configureStore,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";

import { BuildGeneric } from "@buildblazer/system-generic";

import { BuildSummary, deleteBuild, loadBuildList, saveBuild } from "@/storage";

const initState = {
  builds: [] as BuildSummary[],
};
export type ReduxState = typeof initState;

const STORE_PREFIX = "buildblazer";

const reducers = {
  // _buildName: (state: ReduxState, { payload }: PayloadAction<string>) => {
  //   state.build.name = payload;
  // },
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
    ): Promise<string> => {
      const build = new BuildGeneric({
        name: args.name,
      });
      await saveBuild(build);
      await thunkAPI.dispatch(REDUX_DISPATCH.loadBuilds());
      return build.id;
    },
  ),
};

const selectors = {
  builds: (state?: ReduxState) => state?.builds ?? [],
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
      .addAsyncThunk(thunks.deleteBuild, {
        fulfilled: (state, { payload }) => {},
      })
      .addAsyncThunk(thunks.newBuild, {
        fulfilled: (state, { payload }) => {},
      }),
});

export const REDUX_STORE = configureStore({
  reducer: REDUX_SLICE.reducer,
  preloadedState: initState,
});

export const REDUX_DISPATCH = {
  ...reducers,
  ...thunks,
};
export const REDUX_SELECTOR = selectors;

export type ReduxDispatch = typeof REDUX_STORE.dispatch;

export const useReduxDispatch = useDispatch.withTypes<ReduxDispatch>();
export const useReduxSelector = useSelector.withTypes<ReduxState>();

export function ReduxProvider({ children }: any) {
  return <Provider store={REDUX_STORE}>{children}</Provider>;
}

REDUX_STORE.dispatch(REDUX_DISPATCH.loadBuilds());
