import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faCheck, faXmark, faBookmark, faEdit, faTrash, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, faLocationArrow } from '@fortawesome/free-solid-svg-icons';


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [jumpPage, setJumpPage] = useState('');

  const pageSize = 10;

  useEffect(() => {
    axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const filteredUsers = users.filter(user => (
    Object.values(user).some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
  ));

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const handleJumpPageChange = (e) => {
    setJumpPage(e.target.value);
  };
  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpPage, 10);
    if (!isNaN(pageNumber)) {
      handleSetPage(pageNumber);
      setJumpPage('');
    }
  };
  const handleCheckboxChange = (id) => {
    const isSelected = selectedRows.includes(id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = () => {
    const allOnPageSelected = paginatedUsers.every(user => selectedRows.includes(user.id));
    if (allOnPageSelected) {
      setSelectedRows(selectedRows.filter(rowId => !paginatedUsers.map(user => user.id).includes(rowId)));
    } else {
      setSelectedRows([...selectedRows, ...paginatedUsers.map(user => user.id)]);
    }
  };


  const handleDeleteSelected = () => {
    // we can make an api to change the in the database from here to delete the selected items
    const updatedUsers = users.filter(user => !selectedRows.includes(user.id));
    setUsers(updatedUsers);
    setSelectedRows([]);
  };

  const handleDelete = (id) => {
    // we can make an api to change the in the database from here to delete the selected items
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    setSelectedRows(selectedRows.filter(rowId => rowId !== id));
  };



  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSave = () => {
    // we can make an api to change the in the database from here to save  the edited items
    const updatedUsers = users.map(user =>
      user.id === editingUser.id
        ? {
          ...user,
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
        }
        : user
    );
    setUsers(updatedUsers);
    setEditingUser(null);
  };
  const handleSetPage = (pageNumber) => {
    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
  };
  const isAllOnPageSelected = paginatedUsers.length > 0 && paginatedUsers.every(user => selectedRows.includes(user.id));

 

  return (
    <div className=" mt-4 md:mt-2 text-xs sm:text-sm md:text-lg md:px-4  bg-gray-100 pb-4 md:pb-1">
      <div className="mb-2 bg-white md:px-4 md:py-2 py-1 rounded shadow">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-1 md:p-2  border border-gray-300 rounded w-1/2 md:w-1/2 lg:w-1/3"
        />
      </div>
      <div className='my-2  flex justify-center'>
        <div className='border-2 text-center bg-white rounded-sm   shadow-lg'>

          <button
            className={`p-2 m-2 transition-all duration-300 hover:scale-105 shadow-lg rounded ${isAllOnPageSelected ? 'bg-red-500 text-white transition-all duration-300 hover:bg-red-600 hover:text-white' : 'bg-blue-500 transition-all duration-300 hover:bg-blue-600 hover:text-white text-white'}`}
            onClick={handleSelectAll}
          >
            {isAllOnPageSelected ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faCheck} />}
          </button>
          <button
            className=" p-2 m-2 hover:scale-105 shadow-lg font-bold  bg-red-500 text-white  md:text-xl rounded transition-all duration-300 hover:bg-red-600"
            onClick={handleDeleteSelected}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-collapse bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="md:p-2 py-1 border">Select</th>
              <th className="md:p-2 py-1 border">ID</th>
              <th className="md:p-2 py-1 border">Name</th>
              <th className="md:p-2 py-1 border">Email</th>
              <th className="md:p-2 py-1 border">Role</th>
              <th className="md:p-2 py-1 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user.id} className={selectedRows.includes(user.id) ? 'bg-gray-300' : ''}>
                <td className=" border ">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                </td>
                <td className="p-1 border">{user.id}</td>
                <td className="p-1 border">
                  {editingUser && editingUser.id === user.id ? (
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="p-1   border rounded w-full"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="md:p-2 border">
                  {editingUser && editingUser.id === user.id ? (
                    <input
                      type="text"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="md:px-2 py-1 border rounded w-full"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="md:px-2 py-1 border">
                  {editingUser && editingUser.id === user.id ? (
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="md:p-2 border rounded"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="md:p-2 border text-sm md:text-md">
                  {editingUser && editingUser.id === user.id ? (
                    <>
                      <button className="save mr-2 px-2 py-1 my-2 md:my-0 bg-green-500 text-white rounded" onClick={handleSave}><FontAwesomeIcon icon={faBookmark} /></button>
                      <button className="cancel mr-2 md:mr-0 px-2 py-1 bg-gray-500 text-white rounded" onClick={() => setEditingUser(null)}><FontAwesomeIcon icon={faXmark} /></button>
                    </>
                  ) : (
                    <>
                      <button className="edit mr-2 px-2 py-1 my-2 md:my-0 bg-blue-500 text-white rounded transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-105" onClick={() => handleEdit(user)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="delete mr-2 md:mr-0 px-2 py-1 bg-red-500 hover:scale-105 text-white rounded transition-all duration-300 hover:bg-red-600 hover:text-white" onClick={() => handleDelete(user.id)}> <FontAwesomeIcon icon={faTrash} /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="mt-2 flex gap-2 items-center justify-center  ">
        <button className="transition-all duration-300 hover:bg-blue-600 hover:text-white first-page   mt-2 md:mt-0 p-1 md:p-2 bg-blue-500 text-white rounded" onClick={() => handleSetPage(1)} ><FontAwesomeIcon icon={faAngleDoubleLeft} /></button>
        <button className="transition-all duration-300 hover:bg-blue-600 hover:text-white previous-page   mt-2 md:mt-0 p-1  md:p-2 bg-blue-500 text-white rounded " onClick={() => handleSetPage(currentPage - 1)} disabled={currentPage === 1}><FontAwesomeIcon icon={faAngleLeft} /></button>
        <span className="mt-2  md:mt-0 md:mr-2">
          <input
            type="text"
            value={jumpPage}
            placeholder={currentPage}
            onChange={handleJumpPageChange}
            className="md:p-2 text-center border rounded  w-16"
          />
        </span>
        <button className="transition-all duration-300 hover:bg-blue-600 hover:text-white jump-page mt-2   md:mt-0 p-1  md:p-2 bg-blue-500 text-white rounded" onClick={handleJumpToPage}> <FontAwesomeIcon icon={faLocationArrow} /> </button>
        <button className="transition-all duration-300 hover:bg-blue-600 hover:text-white next-page mt-2   md:mt-0 p-1  md:p-2 bg-blue-500 text-white rounded" onClick={() => handleSetPage(currentPage + 1)} disabled={currentPage === Math.ceil(filteredUsers.length / pageSize)}>  <FontAwesomeIcon icon={faAngleRight} />
        </button>
        <button className="transition-all duration-300 hover:bg-blue-600 hover:text-white last-page mt-2   md:mt-0 p-1 md:p-2 bg-blue-500 text-white rounded" onClick={() => handleSetPage(Math.ceil(filteredUsers.length / pageSize))}>  <FontAwesomeIcon icon={faAngleDoubleRight} />
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;