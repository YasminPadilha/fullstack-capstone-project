// src/components/DetailsPage/DetailsPage.js

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DetailsPage = () => {
  const { productId } = useParams(); // Access the productId from the URL
  const navigate = useNavigate();
  const [gift, setGift] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for authentication
  useEffect(() => {
    if (!sessionStorage.getItem("authToken")) {
      navigate("/app/login"); // Redirect to login page if not authenticated
    }
  }, [navigate]);

  // Fetch gift details
  useEffect(() => {
    const fetchGiftDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/gifts/${productId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch gift details");
        }
        const data = await response.json();
        setGift(data);
        setComments(data.comments || []); // Assuming the gift object has a 'comments' array
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGiftDetails();
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, [productId]);

  // Handle the back button click
  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="details-page">
      {gift ? (
        <>
          <button onClick={handleBackClick}>Back</button>
          <h1>{gift.name}</h1>
          <img
            src={gift.image || "/images/no-image.png"} // Default image if no image is available
            alt={gift.name}
            className="product-image-large"
          />
          <div className="gift-details">
            <p>
              <strong>Category:</strong> {gift.category}
            </p>
            <p>
              <strong>Condition:</strong> {gift.condition}
            </p>
            <p>
              <strong>Date Added:</strong>{" "}
              {new Date(gift.date_added * 1000).toLocaleDateString()}
            </p>{" "}
            {/* Assuming Unix timestamp */}
            <p>
              <strong>Age:</strong> {gift.age_years} years
            </p>
            <p>
              <strong>Description:</strong> {gift.description}
            </p>
          </div>

          <div className="comments-section">
            <h3>Comments</h3>
            {comments.length > 0 ? (
              <ul>
                {comments.map((comment, index) => (
                  <li key={index}>{comment.text}</li>
                ))}
              </ul>
            ) : (
              <p>No comments available for this gift.</p>
            )}
          </div>
        </>
      ) : (
        <div>No gift found</div>
      )}
    </div>
  );
};

export default DetailsPage;
