import React, { useState } from "react";
import { axiosWithAuth } from '../utilities/axiosWithAuth';
import { Redirect } from 'react-router-dom';

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors, ...props }) => {
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  console.log(props);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth()
      .put(`http://localhost:5000/api/colors/${colorToEdit.id}`, colorToEdit)
        .then(res => {
          setEditing(!editing);
          updateColors(res.data);
        })
        .catch(err => {
          console.log(err);
        })
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
  };

  const deleteColor = (color, event) => {
    // make a delete request to delete this color
    event.stopPropagation();
    axiosWithAuth()
      .delete(`http://localhost:5000/api/colors/${color.id}`)
        .then(res => {
          updateColors(res.data);
        })
  };

  const logout = () => {
    localStorage.removeItem('token');
    props.props.history.push('/');
  }

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map((color, index) => (
          <li key={index} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={(e) => deleteColor(color, e)}>
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
      <button onClick={logout} className="logout-btn">Logout</button>
    </div>
  );
};

export default ColorList;
