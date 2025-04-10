import { useState, useEffect } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '@clerk/clerk-react'
import { useOutletContext } from "react-router-dom";

function Articles() {

  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { selectedCategory } = useOutletContext(); // Get selectedCategory from context



  //get all articles
  async function getArticles() {
    //get jwt token
    const token=await getToken()
    //make authenticated req
    let res = await axios.get('http://localhost:3000/author-api/articles',{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    if (res.data.message === 'articles') {
      setArticles(res.data.payload)
      setError('')
    } else {
      setError(res.data.message)
    }
  }
  console.log(error)

  // Filter articles based on selected category
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter((a) => a.category === selectedCategory));
    }
  }, [selectedCategory, articles]);

  //goto specific article
  function gotoArticleById(articleObj){
      navigate(`../${articleObj.articleId}`,{ state:articleObj})
  }


  useEffect(() => {
    getArticles()
  }, [])

  console.log(articles)

  return (
    <div className="container">
      {error && <p className="display-4 text-center mt-5 text-danger">{error}</p>}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
        {filteredArticles.map((articleObj) => (
          <div className="col" key={articleObj.articleId}>
            <div className="card h-100">
              <div className="card-body">
                <div className="author-details text-end">
                  <img
                    src={articleObj.authorData.profileImageUrl}
                    width="40px"
                    className="rounded-circle"
                    alt=""
                  />
                  <p>
                    <small className="text-secondary">{articleObj.authorData.nameOfAuthor}</small>
                  </p>
                </div>
                <h5 className="card-title">{articleObj.title}</h5>
                <p className="card-text">{articleObj.content.substring(0, 80) + "...."}</p>
                <button className="custom-btn btn-4"onClick={()=>gotoArticleById(articleObj)}>
                  Read more
                </button>
              </div>
              <div className="card-footer">
                <small className="text-body-secondary">
                  Last updated on {articleObj.dateOfModification}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Articles