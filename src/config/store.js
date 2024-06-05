import { combineReducers, configureStore, createSlice } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
// const isLoginInitialState = false;

// useState 역할
const isLogin = createSlice({
  name : 'isLogin',
  initialState : {value : false},
  reducers : {
    setIsLogin(state, action) {
      state.value = action.payload; 
    },
    resetIsLogin(state, action) {
      state.value = action.payload;
    }
  }
});

const userInfo = createSlice({
  name : 'userInfo',
  initialState : {info : null},
  reducers : {
    setUserInfo(state, action) {
      state.info = action.payload;
    }
  }
})

const role = createSlice({
  name : 'role',
  initialState : {role : null},
  reducers : {
    setRole(state, action) {
      state.role = action.payload;
    }
  }
})

const rootReducers = combineReducers({
  isLogin : isLogin.reducer,
  userInfo : userInfo.reducer,
  role : role.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['isLogin', 'userInfo', 'role']
};

export let { setIsLogin, resetIsLogin } = isLogin.actions;
export let { setUserInfo } = userInfo.actions;
export let { setRole } = role.actions;

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
   middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
    devTools: true,
})

export const persistor = persistStore(store);