import React, { useEffect, useState } from 'react';
import facade from '../../util/apiFacade';
import NavBar from '../NavBar';
import "../../css/SavedImages.css";

const Admin = () => {
    const [picturesWithRatings, setPicturesWithRatings] = useState(null);
    const accessKey = '6txTsQqD6LOmxYEbY9XG7cawzA7_el54xcjdNeW-4AM'; // Replace with your Unsplash access key
    const totalStars = 5;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDataFromPictures = async () => {
            try {
                setLoading(true);
                setError(null); // Clear previous errors
                const pictureEndpoint = 'pictures/';
                const pictureMethod = 'GET';
                const pictureResponse = await facade.fetchData(pictureEndpoint, pictureMethod);

                if (pictureResponse && pictureResponse.length > 0) {
                    const ratingsPromises = pictureResponse.map(async (picture) => {
                        try {
                            const ratingsEndpoint = 'ratings/' + picture.id;
                            const ratingsMethod = 'GET';
                            const ratingsResponse = await facade.fetchData(ratingsEndpoint, ratingsMethod);
                            return { ...picture, ratings: ratingsResponse };
                        } catch (error) {
                            console.error('Error fetching ratings for picture ID:', picture.id, error);
                            return picture;
                        }
                    });

                    const picturesWithRatings = await Promise.all(ratingsPromises);
                    setPicturesWithRatings(picturesWithRatings);
                } else {
                    setPicturesWithRatings([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDataFromPictures();
    }, []);

    const handleOnClick = async (id) => {
        try {
            const endpoint = 'pictures/picture/' + id;
            const method = 'DELETE';
            const response = await facade.fetchData(endpoint, method, true);
            console.log('Picture deleted:', response);
            setPicturesWithRatings(prevPictures => prevPictures.filter(picture => picture.id !== id));
        } catch (error) {
            console.error('Error deleting picture:', error);
            setError('Error deleting picture. Please try again later.');
        }
    };

    const handleOnRate = async (value, picture_id) => {
        try {
            // Save the rating
            const response = await facade.fetchData('ratings/' + picture_id + "/" + value, 'POST', true);
            console.log('Rating saved:', response);

            // Retrieve the updated rating for the picture
            const updatedRatingResponse = await facade.fetchData('ratings/' + picture_id, 'GET');

            // Update the picture's rating in state
            const updatedPictures = picturesWithRatings.map((picture) => {
                if (picture.id === picture_id) {
                    return { ...picture, ratings: updatedRatingResponse };
                }
                return picture;
            });

            setPicturesWithRatings(updatedPictures);
        } catch (error) {
            console.error('Error saving rating:', error);
            setError('Error saving rating. Please try again later.');
        }
    };

    return (
        <>
            <NavBar />
            <div className="admin-pictures-container">
                <h1 className="admin-pictures-title">All Saved Images</h1>
                {loading ? (
                    <p className="loading-message">Loading...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : picturesWithRatings && picturesWithRatings.length > 0 ? (
                    <div className="admin-image-grid">
                        {picturesWithRatings.map((picture, picIndex) => (
                            <div key={picture.id} className="admin-image-card">
                                <img
                                    onClick={() => handleOnClick(picture.id)}
                                    src={picture.url}
                                    alt={`Picture ${picIndex}`}
                                    title={picture.alt ? picture.alt : `Picture ${picIndex}`}
                                    className="admin-image-item"
                                />
                                <div className="photographer-info">
                                    <p>Photographer: {picture.pname}</p>
                                    <p><a href={picture.puserLink} target="_blank" rel="noreferrer">View Profile</a></p>
                                    <a href={`${picture.pdownLink}?client_id=${accessKey}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className='link-2-photo-g'>Link to download</a>
                                        <br/>
                                        <a href={`${picture.url}?client_id=${accessKey}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className='link-2-photo-g'>Link to full size</a>
                                </div>
                                <div className="rating-section">
                                    {[...Array(totalStars)].map((_, starIndex) => {
                                        const ratingValue = starIndex + 1;
                                        return (
                                            <span
                                                key={starIndex}
                                                onClick={() => handleOnRate(ratingValue, picture.id)}
                                                className={`rating-star ${ratingValue <= picture.ratings ? 'active' : ''}`}
                                            >
                                                ★
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-pictures-message">No pictures available.</p>
                )}
            </div>
        </>
    );
};

export default Admin;
