import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
  const [users, setUsers] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch Users & Authors from backend
  useEffect(() => {
    async function fetchData() {
      try {
        const usersRes = await axios.get("http://localhost:3000/admin-api/users");
        const authorsRes = await axios.get("http://localhost:3000/admin-api/authors");
        console.log(usersRes.data)
        console.log(authorsRes.data)
        setUsers(usersRes.data.payload);
        setAuthors(authorsRes.data.payload);
      } catch (err) {
        setError("Failed to load data");
      }
    }
    fetchData();
  }, []);

  async function toggleStatus(id) {
    try {
      const res = await axios.put(`http://localhost:3000/admin-api/toggle-status/${id}`);
  
      // Extract updated user/author
      const updatedUser = res.data.payload;
  
      // Update the correct list (users/authors)
      if (users.some(user => user._id === id)) {
        setUsers(users.map(user => user._id === id ? updatedUser : user));
      } else {
        setAuthors(authors.map(author => author._id === id ? updatedUser : author));
      }
    } catch (err) {
      setError("Failed to update status");
    }
  }
  return (
    <div className="container">
  <h2 className="my-4">Admin Dashboard</h2>

  {error && <p className="text-danger">{error}</p>}

  {/* Users Section */}
  <h3>Users</h3>
  <table className="table table-bordered">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user._id}>
          <td>{user.firstName} {user.lastName}</td>
          <td>{user.email}</td>
          <td>{user.isActive ? "Active" : "Blocked"}</td>
          <td>
            <button
              className={`btn ${user.isActive ? "btn-danger" : "btn-success"}`}
              onClick={() => toggleStatus(user._id)}
            >
              {user.isActive ? "Disable" : "Enable"}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Authors Section */}
  <h3>Authors</h3>
  <table className="table table-bordered">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {authors.map(author => (
        <tr key={author._id}>
          <td>{author.firstName} {author.lastName}</td>
          <td>{author.email}</td>
          <td>{author.isActive ? "Active" : "Blocked"}</td>
          <td>
            <button
              className={`btn ${author.isActive ? "btn-danger" : "btn-success"}`}
              onClick={() => toggleStatus(author._id)}
            >
              {author.isActive ? "Disable" : "Enable"}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  )
}

export default AdminProfile;
