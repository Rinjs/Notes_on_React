import React from "react";
import { Note } from "../Note/Note";

export const Notes = ({ notes }) => {
  return (
    <ul className="list-group">
      {notes.map(note => (
        <Note note={note} />
      ))}
    </ul>
  );
};
