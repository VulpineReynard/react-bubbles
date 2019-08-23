import React, { useState } from "react";
import { axiosWithAuth } from '../utilities/axiosWithAuth';

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors, ...props }) => {
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [newColor, setNewColor] = useState({
    code: {
      hex: ''
    },
    color: ''
  });

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
    color.edit = true;
    console.log(color);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    axiosWithAuth()
      .put(`http://localhost:5000/api/colors/${colorToEdit.id}`, colorToEdit)
        .then(res => {
          setEditing(!editing);
          updateColors([
            ...res.data,
          ]);
          colors.forEach(color => color.edit = false)
          console.log(colorToEdit);
          console.log(colors);
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

  const handleChange = e => {
    if(e.target.name === 'code') {
      setNewColor({
        ...newColor,
        code: {
          hex: e.target.value
        }
      })
    } else {
      setNewColor({
        ...newColor,
        [e.target.name]: e.target.value
      })
    }
    console.log(newColor)
  }

  const addColor = (e, newColor) => {
    e.preventDefault();
    axiosWithAuth()
      .post('http://localhost:5000/api/colors', newColor)
        .then(res => {
          console.log(res);
          updateColors(res.data);
          setNewColor({
            color: '',
            code: {
              hex: ''
            }
          })
        })
        .catch(err => {
          console.log(err);
        })
  }

  const logout = () => {
    localStorage.removeItem('token');
    props.props.history.push('/');
  }

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map((color, index) => (
          <li className={"color" + (color.edit ? " edit" : '')} key={index} onClick={() => editColor(color)}>
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
        <form className="edit-color-form" onSubmit={(e) => saveEdit(e)}>
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
      <div className="spacer">
        <form onSubmit={(e) => addColor(e, newColor)} className="add-color-form">
          <input 
          name='color'
          placeholder="Color Name"
          onChange={(e) => handleChange(e)}
          value={newColor.color}
          required
          />

          <input 
          name='code'
          placeholder="Hex Code"
          onChange={(e) => handleChange(e)}
          value={newColor.code.hex}
          required
          />
          <button type="submit">Add Color</button>
        </form>
      </div> 
      {/* stretch - build another form here to add a color */}
      <button onClick={logout} className="logout-btn">Logout</button>
    </div>
  );
};

export default ColorList;
