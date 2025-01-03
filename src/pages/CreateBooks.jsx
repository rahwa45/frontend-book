import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useSnackbar } from "notistack";

const CreateBooks = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  // Handle file upload to Cloudinary
  const handleFileUpload = async (file) => {
    if (!file) {
      enqueueSnackbar("Please select an image to upload.", {
        variant: "error",
      });
      return null;
    }

    const formData = new FormData();
    formData.append("file", file); // append the file
    formData.append("upload_preset", "bookss"); // Set your upload preset (you need to create one in Cloudinary)

    try {
      setLoading(true);
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/deizs3n5d/image/upload",
        formData
      );
      return response.data.secure_url; // Return the Cloudinary URL of the image
    } catch (error) {
      console.log("Error uploading image to Cloudinary: ", error);
      return null;
    }
  };

  const handleSaveBook = async () => {
    const token = localStorage.getItem("token");

    if (!title || !author || !publishYear || !image) {
      enqueueSnackbar("Please fill in all fields including the image.", {
        variant: "error",
      });
      return;
    }

    const imageUrl = await handleFileUpload(image); // Get image URL from Cloudinary

    if (!imageUrl) {
      enqueueSnackbar("Failed to upload image. Please try again.", {
        variant: "error",
      });
      return;
    }
    console.log(imageUrl);

    const data = {
      title,
      author,
      publishYear,
      image: imageUrl, // Send the image URL to the backend
    };

    axios
      .post("https://backend-6wvj.onrender.com/books", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        enqueueSnackbar("Book created successfully", { variant: "success" });
        navigate("/home");
      })
      .catch((error) => {
        console.log("Error creating book: ", error);
        enqueueSnackbar("An error occurred. Please try again.", {
          variant: "error",
        });
      });
  };
  if (loading) {
    return (
      <div className="p-4 d-flex align-items-center justify-content-center container style=height: 100vh flex-column display-4 mb-5">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 d-flex align-items-center justify-content-center container style=height: 100vh flex-column log bg-light">
      <BackButton />
      <h1 className="my-4">Create Book</h1>
      <div className="p-4">
        <label className="mx-4">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mx-4 px-4 py-2"
        />
      </div>
      <div className="my-4">
        <label className="mx-4">Author</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="mx-4 px-4 py-2"
        />
      </div>
      <div className="my-4">
        <label className="mx-2">Publish Year</label>
        <input
          type="text"
          value={publishYear}
          onChange={(e) => setPublishYear(e.target.value)}
          className="mx-4 px-4 py-2"
        />
      </div>

      <div className="my-4 mx-4">
        <label className="text-xl mx-4 text-gray-500">Image</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="border-2 border-gray-500   w-full my-2"
        />
      </div>

      <button className="btn btn-primary btn-lg" onClick={handleSaveBook}>
        Save
      </button>
    </div>
  );
};

export default CreateBooks;
