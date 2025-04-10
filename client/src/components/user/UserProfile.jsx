import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

function UserProfile() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { getToken } = useAuth();
  const location = useLocation();

  // Fetch articles once to extract categories
  async function fetchCategories() {
    const token = await getToken();
    let res = await axios.get("http://localhost:3000/author-api/articles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.message === "articles") {
      const uniqueCategories = ["All", ...new Set(res.data.payload.map((a) => a.category))];
      setCategories(uniqueCategories);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
   <div className="author-profile">
         <ul className="d-flex justify-content-around list-unstyled fs-3">
           <li className="nav-item">
             <NavLink to="articles" className="nav-link">
               Articles
             </NavLink>
           </li>
         </ul>
   
         {/* Show Dropdown only when on Articles Page */}
         {location.pathname.includes("articles") && (
           <div className="mb-4 p-5 border-info">
             <label className="form-label fs-2">Filter by Category:</label>
             <select
               className="form-select"
               value={selectedCategory}
               onChange={(e) => setSelectedCategory(e.target.value)}
             >
               {categories.map((category, index) => (
                 <option key={index} value={category}>
                   {category}
                 </option>
               ))}
             </select>
           </div>
         )}
   
         <div className="mt-5">
           <Outlet context={{ selectedCategory }} />
         </div>
       </div>

  )
}

export default UserProfile 