import { useContext, useEffect, useState } from "react";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onSelectRole(e) {
    //clear error property
    setError("");
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;
    let res = null;

    console.log("Current User:", currentUser); // Debug
    console.log("Current Email:", currentUser?.email); // Debug
    try {
      // // Fetch admin emails and use them directly instead of waiting for state update
      // if (payload.isBlocked) {
      //   setError("Your account is blocked. Please contact admin.");
      //   return;
      // }
      if (selectedRole === "user") {
        const response = await axios.get(
          "http://localhost:3000/admin-api/users"
        );

        const status_user = response.data.payload[0].isActive;
        if (status_user === false) {
          setError("Your account is blocked. Please contact admin.");
          return;
        }
      }

      if (selectedRole === "author") {
        const response = await axios.get(
          "http://localhost:3000/admin-api/authors"
        );

        const status_user = response.data.payload[0].isActive;
        if (status_user === false) {
          setError("Your account is blocked. Please contact admin.");
          return;
        }
      }

      if (selectedRole === "admin") {
        const res = await axios.get("http://localhost:3000/admin-api/admins");
        console.log("Admin Emails from API:", res.data); // Debug

        if (!res.data.includes(currentUser?.email)) {
          setError("You are not authorized to select the Admin role.");
          return;
        }
        navigate(`/admin-profile/${currentUser.email}`);
        return;
      } else if (selectedRole === "author") {
        res = await axios.post(
          "http://localhost:3000/author-api/author",
          currentUser
        );
        let { message, payload } = res.data;
        // console.log(message, payload)
        if (message === "author") {
          setCurrentUser({ ...currentUser, ...payload });
          //save user to localstorage
          localStorage.setItem("currentuser", JSON.stringify(payload));
          // setError(null)
        } else {
          setError(message);
        }
      } else if (selectedRole === "user") {
        // Fetch all users from the backend

        console.log(currentUser);
        res = await axios.post(
          "http://localhost:3000/user-api/user",
          currentUser
        );
        let { message, payload } = res.data;
        console.log(message);
        if (message === "user") {
          setCurrentUser({ ...currentUser, ...payload });
          //save user to localstorage
          localStorage.setItem("currentuser", JSON.stringify(payload));
        } else {
          setError(message);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (isSignedIn === true) {
      setCurrentUser({
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    if (currentUser?.role === "user" && error.length === 0) {
      navigate(`/user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "author" && error.length === 0) {
      console.log("first");
      navigate(`/author-profile/${currentUser.email}`);
    }
  }, [currentUser]);

  // console.log("cu",currentUser)
  //console.log("is loaded",isLoaded)

  return (
    <div className="container">
      {isSignedIn === false && (
        <div>
          <img
            className="float-end "
            src="https://img.freepik.com/free-photo/successful-computer-gadget-digital-close_1220-888.jpg"
            width="700px"
            alt=""
          />
          <h1 className="text-1xl font-semibold font ">
            An article is<br></br>not just text;
          </h1>
          <h1 className="text-2xl font-semibold  font ">
            it’s knowledge, perspective,<br></br>and power <br></br>combined.
          </h1>
        </div>
      )}

      {isSignedIn === true && (
        <div>
          <div className="d-flex justify-content-evenly align-items-center bg-info p-3">
            <img
              src={user.imageUrl}
              width="100px"
              className="rounded-circle"
              alt=""
            />
            <p className="display-6 bg-info">{user.firstName}</p>
            <p className="lead bg-info fs-3">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
          <p className="lead">Select role</p>
          {error.length !== 0 && (
            <p
              className="text-danger fs-5"
              style={{ fontFamily: "sans-serif" }}
            >
              {error}
            </p>
          )}
          <div className="d-flex role-radio py-3 justify-content-center">
            <div className="form-check me-4 role-radio">
              <input
                type="radio"
                name="role"
                id="author"
                value="author"
                className="form-check-input "
                onChange={onSelectRole}
              />
              <label
                htmlFor="author"
                className="form-check-label role-radio fs-3"
              >
                Author
              </label>
            </div>
            <div className="form-check me-4 role-radio">
              <input
                type="radio"
                name="role"
                id="user"
                value="user"
                className="form-check-input"
                onChange={onSelectRole}
              />
              <label
                htmlFor="user"
                className="form-check-label role-radio fs-3"
              >
                User
              </label>
            </div>
            <div className="form-check role-radio">
              <input
                type="radio"
                name="role"
                id="admin"
                value="admin"
                className="form-check-input"
                onChange={onSelectRole}
              />
              <label
                htmlFor="admin"
                className="form-check-label role-radio fs-3"
              >
                Admin
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
