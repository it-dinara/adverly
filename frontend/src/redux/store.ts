import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import storageSession from "redux-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";
import formReducer from "./slices/formSlice";
import itemsReducer from "./slices/itemsListSlice";
import itemReducer from "./slices/itemSlice";

const listenerMiddleware = createListenerMiddleware();

// Configure persistence
const persistConfig = {
  key: "root",
  storage: storageSession,
  blacklist: ["items"],
};

const rootReducer = combineReducers({
  form: formReducer,
  items: itemsReducer,
  item: itemReducer,
});

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
        ],
      },
    }).prepend(listenerMiddleware.middleware),
});

const persistor = persistStore(store);

export { store, persistor };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
