import { create } from 'zustand'
import Cookies from 'js-cookie';

const useSessionStore = create((set) => ({
  socketId: null,
  username: null,
  currentRoom: null,
  isHost: false,
  color: "",
  changeSocketId: (id) => set({socketId: id}),
  changeUsername: (name) => set({username: name}),
  changeRoom: (newRoom) => set({currentRoom: newRoom}),
  changeIsHost: (value) => set({isHost: value}),
  changeColor: (val) => set({color: val})
}))

// Load initial state from the cookie if it exists
const initialState = JSON.parse(Cookies.get('myStore') || '{}');
useSessionStore.setState(initialState);

useSessionStore.subscribe((state) => {
  Cookies.set('myStore', JSON.stringify(state));
});

export default useSessionStore