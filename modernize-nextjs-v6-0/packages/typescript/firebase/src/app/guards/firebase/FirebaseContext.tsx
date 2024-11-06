import { createContext, useEffect, useReducer } from 'react';
import { firebase } from './Firebase';

export interface InitialStateType {
  isAuthenticated?: boolean;
  isInitialized?: boolean;
  user?: any | null | undefined;
}

const initialState: InitialStateType = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const reducer = (state: InitialStateType, action: any) => {
  if (action.type === 'AUTH_STATE_CHANGED') {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

const AuthContext = createContext<any | null>({
  ...initialState,
  platform: 'Firebase',
  signup: () => Promise.resolve(),
  signin: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  onceGetUsers: () => Promise.resolve(),
  CreateUser: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(
    () =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // Here you should extract the complete user profile to make it available in your entire app.
          // The auth state only provides basic information.
          dispatch({
            type: 'AUTH_STATE_CHANGED',
            payload: {
              isAuthenticated: true,
              user: {
                id: user.uid,
                avatar: user.photoURL,
                email: user.email,
              },
            },
          });
        } else {
          dispatch({
            type: 'AUTH_STATE_CHANGED',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      }),
    [dispatch],
  );

  // Login with FB

  const loginWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    return firebase.auth().signInWithPopup(provider);
  };

  // Login with FB
  const loginWithFaceBook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();

    return firebase.auth().signInWithPopup(provider);
  };

  const loginWithTwitter = () => {
    const provider = new firebase.auth.TwitterAuthProvider();

    return firebase.auth().signInWithPopup(provider);
  };

  // Sign Up
  const signup = (email: string, password: string) =>
    firebase.auth().createUserWithEmailAndPassword(email, password);

  // Sign In
  const signin = (email: string, password: string) =>
    firebase.auth().signInWithEmailAndPassword(email, password);

  // Sign out
  const logout = () => firebase.auth().signOut();
  const CreateUser = (id: string, username: string, email: string) =>
    firebase.database().ref(`users/${id}`).set({
      username,
      email,
    });
  const onceGetUsers = () => firebase.database().ref('users').once('value');

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'Firebase',
        signup,
        signin,
        CreateUser,
        onceGetUsers,
        loginWithGoogle,
        loginWithFaceBook,
        loginWithTwitter,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
