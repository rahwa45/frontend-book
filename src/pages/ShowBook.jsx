import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";

const ShowBook = () => {
  const [book, setBook] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      navigate("/");
      return;
    }
    setLoading(true);
    axios
      .get(`https://backend-6wvj.onrender.com/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setBook(res.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-4 d-flex align-items-center justify-content-center container style=height: 100vh flex-column display-4 mb-5">
        Loading...
      </div>
    );
  }
  return (
    <div className="p-4 d-flex align-items-center justify-around container style=height: 100vh flex-column">
      <BackButton />
      <h1 className="my-4">Show Book</h1>
      <div className="border border-2 rounded rounded-xl p-4">
        {book.image && (
          <div className="w-1/3 pr-4">
            <img src={book.image} alt={book.title} />
          </div>
        )}

        <div className="my-4">
          <span className="border p-1 rounded mx-2">Id</span>
          <span>{book._id}</span>
        </div>

        <div className="my-4">
          <span className="border p-1 rounded mx-2">Title</span>
          <span>{book.title}</span>
        </div>

        <div className="my-4">
          <span className="border p-1 rounded mx-2">Author</span>
          <span>{book.author}</span>
        </div>

        <div className="my-4">
          <span className="border p-1 rounded mx-2">Publish Year</span>
          <span>{book.publishYear}</span>
        </div>

        <div className="my-4">
          <span className="border p-1 rounded mx-2">Create Time</span>
          <span>{new Date(book.createdAt).toString()}</span>
        </div>

        <div className="my-4">
          <span className="border p-1 rounded mx-2">Last Update Time</span>
          <span>{new Date(book.updatedAt).toString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ShowBook;
