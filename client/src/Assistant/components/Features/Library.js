import React, { useState, useEffect } from 'react';
import '../../styles/features/library.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faFileMedical, faVideoCamera, faMessage, faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3, // Number of items to show at once
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1
      }
    }
  ]
};


const books = [
  { id: 1, title: 'First Trimester', author: 'Bea Benella Rosal', cover: '/img/topic1.jpg' },
  { id: 2, title: 'Second Trimester', author: 'Bea Benella Rosal', cover: '/img/topic2.jpg' },
  { id: 3, title: 'Third Trimester', author: 'Bea Benella Rosal', cover: '/img/topic3.jpg' },
  { id: 4, title: 'Weekly Pregnancy', author: 'Bea Benella Rosal', cover: '/img/topic4.jpg' },
  { id: 5, title: 'Pregnancy Symptoms', author: 'Bea Benella Rosal', cover: '/img/topic5.jpg' },
  { id: 6, title: 'Signs of Labor', author: 'Bea Benella Rosal', cover: '/img/labor1.jpg' },
  { id: 7, title: 'Pregnancy Discharge', author: 'Bea Benella Rosal', cover: '/img/bg6.jpg' },
  { id: 8, title: 'Morning Sickness', author: 'Bea Benella Rosal', cover: '/img/pic1.jpg' },
  { id: 9, title: 'Infertility', author: 'Bea Benella Rosal', cover: '/img/bg5.jpg' },
  { id: 10, title: 'Infertility', author: 'Bea Benella Rosal', cover: '/img/article1.webp' },
  { id: 11, title: 'Infertility', author: 'Bea Benella Rosal', cover: '/img/bg2.webp' },
  { id: 12, title: 'Infertility', author: 'Bea Benella Rosal', cover: '/img/bg1.webp' },
];


// Map book IDs to their routes
const bookRoutes = {
  1: '/library-item1',
  2: '/library-item2',
  3: '/library-item3',
  4: '/library-item4',
  5: '/library-item5',
  6: '/library-item6',
  7: '/library-item7',
  8: '/library-item8',
  9: '/library-item9',
  10: '/library-item10',
  11: '/library-item11',
  12: '/library-item12',
};

const Library = () => {
  const [lastRead, setLastRead] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load the last read books from local storage on component mount
  useEffect(() => {
    const savedLastRead = JSON.parse(localStorage.getItem('lastRead')) || [];
    console.log(savedLastRead); // Ensure this logs the expected array of books
    setLastRead(savedLastRead);
  }, []);

  const handleBookClick = (book) => {
    const updatedLastRead = [book, ...lastRead.filter(b => b.id !== book.id)];
    setLastRead(updatedLastRead);

    // Save the updated last read list to local storage
    localStorage.setItem('lastRead', JSON.stringify(updatedLastRead));
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="library-layout">
      <nav className="library-sidebar">
        <div className="library-profile-section">
          <img src="img/topic4.jpg" alt="Profile Picture" className="library-profile-picture" />
          <div className="library-profile-info">
            <p className="library-welcome-text">Welcome <br />Back,</p>
            <p className="library-user-name">Elizabeth</p>
          </div>
        </div>
        <div className="library-nav-links">
          <ul>
            <li><Link to="/app"><FontAwesomeIcon icon={faHome} /> Home</Link></li>
            <li><Link to="/medicalrecords"><FontAwesomeIcon icon={faFileMedical} /> Medical Records</Link></li>
            <li><Link to="/virtual-consultation"><FontAwesomeIcon icon={faVideoCamera} /> Consultation</Link></li>
            <li><Link to="/belly-talk"><FontAwesomeIcon icon={faMessage} /> BellyTalk</Link></li>
          </ul>
        </div>
        <div className="library-logout">
          <Link to="/logout">
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </Link>
        </div>
      </nav>
      <div className="main-content">
        <header className="library-header">
          <div className="library-title">MatriCare.</div>
          <div className="header-actions">
            <input
              type="text"
              className="search-bar-library"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="action-button">New Release</button>
            <button className="action-button">Saved</button>
          </div>
        </header>

        <section id="last-read" className="last-read-section">
          <h2>Books You Last Read</h2>
                    <Slider {...sliderSettings}>
            {lastRead.length > 0 ? (
              lastRead.map((book) => (
                <div key={book.id} className="last-read-item">
                  <div className="book-background">
                    <img src={book.cover} alt={book.title} className="book-cover" />
                    <div className="book-details">
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">Author: {book.author}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No books read yet.</p>
            )}
          </Slider>

        </section>


        <section id="library" className="library-section">
          <h2>Library</h2>
          <div className="book-list-container">
            {filteredBooks.map((book) => (
              <Link to={bookRoutes[book.id]} key={book.id} className="library-item" onClick={() => handleBookClick(book)}>
                <img src={book.cover} alt={book.title} className="book-cover" />
                <div className="book-details">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">Author: {book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>


      </div>
    </div>
  );
};

export default Library;
