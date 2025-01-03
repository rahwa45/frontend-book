import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";

const EditBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishYear: "",
  });
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch book details when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (!token) {
      alert("No token found. Please log in.");
      navigate("/login"); // Redirect to login page if no token is found
      return;
    }

    axios
      .get(`https://backend-6wvj.onrender.com/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token in the Authorization header
        },
      })
      .then((res) => {
        setFormData({
          title: res.data.title,
          author: res.data.author,
          publishYear: res.data.publishYear,
        });
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        alert("An error happened. Please check the console.");
        console.log(error);
      });
  }, [id, navigate]); // Added navigate as dependency to avoid warnings

  // Handle form submission
  const handleEditBook = (e) => {
    e.preventDefault(); // Prevent the default form submit behavior

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      navigate("/login");
      return;
    }

    // Prepare the data to be updated
    const updatedBook = {
      title: formData.title,
      author: formData.author,
      publishYear: formData.publishYear,
    };

    // Send the PUT request with authorization token and data
    axios
      .put(`https://backend-6wvj.onrender.com/books/${id}`, updatedBook, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // After a successful update, navigate to another page or show a success message
        alert("Book updated successfully!");
        navigate("/home");
      })
      .catch((error) => {
        alert("An error occurred. Please check the console.");
        console.log(error);
      });
  };

  // If data is still loading, show a loading indicator
  if (loading) {
    return (
      <div className="p-4 d-flex align-items-center justify-content-center container style=height: 100vh flex-column display-4 mb-5">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 d-flex align-items-center justify-content-center container p-4 style=height: 100vh flex-column log bg-light">
      <BackButton />
      <h1 className="my-4">Edit Book</h1>

      <form onSubmit={handleEditBook}>
        <div className="p-4">
          <label className="mx-4">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="mx-5 px-4 py-2"
            required
          />
        </div>
        <div className="my-4">
          <label className="mx-4">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            className="mx-5 px-4 py-2"
            required
          />
        </div>
        <div className="my-4">
          <label className="mx-4">Publish Year</label>
          <input
            type="text"
            name="publishYear"
            value={formData.publishYear}
            onChange={(e) =>
              setFormData({ ...formData, publishYear: e.target.value })
            }
            className="mx-3 px-4 py-2"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg mx-4">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditBook;
