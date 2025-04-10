import { useContext, useEffect, useState } from 'react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Auto detect user role after sign-in
  useEffect(() => {
    if (isSignedIn && user) {
      const detectedUser = {
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      };
      setCurrentUser(detectedUser);
      autoDetectRole(detectedUser);
    }
  }, [isLoaded]);

  async function autoDetectRole(userObj) {
    setError('');
    try {
      // Check if author
      const authorRes = await axios.get("http://localhost:3000/admin-api/authors");
      const authorEntry = authorRes.data.payload.find(
        author => author.email === userObj.email
      );

      if (authorEntry) {
        if (!authorEntry.isActive) {
          setError("Your author account is blocked. Please contact admin.");
          return;
        }
        setCurrentUser({ ...userObj, ...authorEntry, role: 'author' });
        localStorage.setItem("currentuser", JSON.stringify({ ...userObj, ...authorEntry }));
        navigate(`/author-profile/${userObj.email}`);
        return;
      }

      // Check if user
      const userRes = await axios.get("http://localhost:3000/admin-api/authors");
      const userEntry = userRes.data.payload.find(
        u => u.email !== userObj.email
      );

      if (userEntry) {
        if (!userEntry.isActive) {
          setError("Your user account is blocked. Please contact admin.");
          return;
        }
        setCurrentUser({ ...userObj, ...userEntry, role: 'user' });
        localStorage.setItem("currentuser", JSON.stringify({ ...userObj, ...userEntry }));
        navigate(`/user-profile/${userObj.email}`);
        return;
      }

      // Not found
      setError("No valid role found for this account.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className='container'>
      {isSignedIn === false && (
        <div>
          <img
            className='float-end'
            src="https://img.freepik.com/free-photo/successful-computer-gadget-digital-close_1220-888.jpg"
            width="700px"
            alt=""
          />
          <h1 className="text-1xl font-semibold font">
            An article is<br />not just text;
          </h1>
          <h1 className="text-2xl font-semibold font">
            it’s knowledge, perspective,<br />and power <br />combined.
          </h1>
        </div>
      )}

      {isSignedIn === true && (
        <div>
          <div className='d-flex justify-content-evenly align-items-center bg-info p-3'>
            <img src={user.imageUrl} width="100px" className='rounded-circle' alt="" />
            <p className="display-6 bg-info">{user.firstName}</p>
            <p className="lead bg-info fs-3">{user.emailAddresses[0].emailAddress}</p>
          </div>
          <p className="lead">Checking your role...</p>
          {error && (
            <p className="text-danger fs-5" style={{ fontFamily: "sans-serif" }}>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
