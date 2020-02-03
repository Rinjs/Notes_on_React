import React, { useReducer } from "react";
import { FirebaseContext } from "./firebaseContext";
import { firebaseReducer } from "../../reducers/firebaseReducer";
import { SHOW_LOADER, NOTE, FETCH_NOTES } from "../../consts/types";

const url = 'https://react-todo-9fb46.firebaseio.com';

export const FirebaseState = ({ children }) => {
  const initialState = {
    notes: [],
    loading: false
  };
  const [state, dispatch] = useReducer(firebaseReducer, initialState);

  const showLoader = () => {
    dispatch({ type: SHOW_LOADER });
  };

  const fetchNotes = async () => {
    showLoader();
    const response = await fetch(`${url}/notes.json`);
    const res = await response.json();
    if (res === null) {
      return 0;
    }
    const payload = Object.keys(res).map(key => {
      return {
        ...res[key],
        id: key
      };
    });
    dispatch({
      type: FETCH_NOTES,
      payload
    });
  };

  const editNote = async payload => {
    const note = {
      title: payload.title,
      date: new Date().toLocaleString()
    };
    await fetch(`${url}/notes/${payload.id}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(note)
    });
    dispatch({
      type: NOTE.EDIT,
      payload: { note, id: payload.id }
    });
  };

  const removeNote = async id => {
    await fetch(`${url}/notes/${id}.json`, {
      method: "DELETE"
    });

    dispatch({
      type: NOTE.REMOVE,
      payload: id
    });
  };

  const addNote = async title => {
    const note = {
      title,
      date: new Date().toLocaleString()
    };
    try {
      const response = await fetch(`${url}/notes.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(note)
      });
      const res = await response.json();
      const payload = {
        ...note,
        id: res.name
      };

      dispatch({
        type: NOTE.ADD,
        payload
      });
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        addNote,
        fetchNotes,
        removeNote,
        showLoader,
        editNote,
        loading: state.loading,
        notes: state.notes
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
