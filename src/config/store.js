import { combineReducers, configureStore, createSlice, createStore } from '@reduxjs/toolkit';
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
  initialState : {},
  reducers : {
    setUserInfo(state, action) {
      state = action.payload;
    }
  }
})

const roles = createSlice({
  name : 'roles',
  initialState : {isUser : false, isAdmin : false},
  reducers : {
    setRoles(state, action) {
      state.isUser = action.payload.isUser;
      state.isAdmin = action.payload.isAdmin;
    }
  }
})

const rootReducers = combineReducers({
  isLogin : isLogin.reducer,
  userInfo : userInfo.reducer,
  roles : roles.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['isLogin']
};

export let { setIsLogin, resetIsLogin } = isLogin.actions;
export let { setUserInfo } = userInfo.actions;
export let { setRoles } = roles.actions;

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