import React from "react";
import { useState, useEffect } from "react";
import { Pagination } from "@material-ui/lab";
import { Typography } from "@material-ui/core";
//import { DataGrid } from '@mui/x-data-grid';

import axios from "axios";
//import Select from "./Components/Select"

const Forms = () => {
  const [items, setitems] = useState();
  const [page, setPage] = useState(1);
  const [search, setsearch] = useState("");
  const [order, setorder] = useState("ASC");
  const [status, setstatus] = useState(false);
  const [editId, setEditId] = useState();
  const [pageSize,setPageSize] = useState();
  const [editData, seteditData] = useState({ _id: "", name: "", country: "" });

  useEffect(() => {
    axios
      .get(`https://api.instantwebtools.net/v1/passenger?page=${page}&size=20`)
      .then((response) => setitems(response.data.data))
      .catch((err) => console.log(err));
      
    
  }, [page]);
  console.log("edit Data ", editData);

  

    const fetchData =() => {
      axios
      .get(`https://api.instantwebtools.net/v1/passenger?page=${page}&size=${pageSize}`)
      .then((response) => setitems(response.data.data))
      .catch((err) => console.log(err));
      console.log(items);
      }

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = items?.sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setitems(sorted);
      setorder("DSC");
    }
    if (order === "DSC") {
      const sorted = items?.sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setitems(sorted);
      setorder("ASC");
    }
  };

  const onDelete = (id) => {
    console.log(id);
    items.splice(id, 1);
    setitems([...items]);
  };

  const editChange = (e, id) => {
    seteditData({ ...editData, [e.target.name]: e.target.value });
    console.log(e.target.value);
    console.log(editData);
  };

  // [e.target.name]: e.target.value
  const editChange1 = (e) => {
    seteditData((oldState) => {
      oldState.airline[0].country = e.target.value;
      oldState = { ...oldState };
      return oldState;
    });
  };

  const onEdit = (id, oldData) => {
    seteditData(oldData);
    setEditId(id);
    console.log(id);
    setstatus(true);
  };

  const updateData = (id) => {
    seteditData(() => {
      items.splice(editId, 1, editData);
      setitems([...items]);
      setEditId(id);
    });
    console.log(editId);
    console.log(items);
    setstatus(false);
  };
 
  return (
    <div className="div">
      {status ? (
        <form className="myForm">
          User-Id
          <input
            type="text"
            className="formField"
            name="_id"
            onChange={editChange}
            value={editData?._id}
          />
          Name
          <input
            type="text"
            className="formField"
            name="name"
            onChange={editChange}
            value={editData?.name}
          />
          Country
          <input
            type="text"
            className="formField"
            name="country"
            onChange={editChange1}
            value={editData?.airline[0].country}
          />
          {console.log("editData ", editData?.airline[0].country)}
          <button
            type="submit"
            className="btn2"
            onClick={(id) => {
              updateData();
            }}
          >
            Update
          </button>
        </form>
      ) : null}
      <input
        className="maindiv"
        type="text"
        placeholder="Searching............"
        onChange={(event) => {
          setsearch(event.target.value);
        }}
      />
      <table className="myTable">
        <thead>
          <tr>
            <th
              onClick={() => {
                sorting("_id");
              }}
            >
              User-Id
            </th>
            <th
              onClick={() => {
                sorting("name");
              }}
            >
              {" "}
              Name{" "}
            </th>
            <th
              onClick={() => {
                sorting("country");
              }}
            >
              {" "}
              Country{" "}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items
            ?.filter((value) => {
              if (search === "") {
                return value;
              } else if (
                value.name.toLowerCase().includes(search.toLowerCase())
              ) {
                return value;
              }
            })
            .map((item, id) => {
              return (
                <tr className="myData">
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>
                    {item?.airline?.map((item, i) => {
                      return item.country;
                    })}
                  </td>
                  <td>
                    {" "}
                    <button
                      className="btn1"
                      onClick={() => {
                        onEdit(id, item);
                      }}
                    >
                      Edit
                    </button>{" "}
                    <button
                      className="btn"
                      onClick={() => {
                        onDelete(id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <select
           value={pageSize}
          onChange={(e)=>setPageSize(Number(e.target.value))}>
          <option>Select--</option>
          {[5, 10, 15].map(pageSize => (
            <option onClick={fetchData()} value={pageSize}>
               {pageSize}
            </option>
          ))}
        </select>
      
      <Typography>Page-{page}</Typography>

      <Pagination
        count={953}
         color="secondary"
        variant="outlined"
        onChange={(e, value) => {
          setPage(value);
          
        }}

        

      />
    </div>
  );
};

export default Forms;
