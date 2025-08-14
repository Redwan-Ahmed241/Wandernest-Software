import Layout from '../App/Layout';

interface ReviewProps {
  name: string;
  date: string;
  rating: number;
  comment: string;
  likes: number;
  dislikes: number;
}

const Review: FunctionComponent<ReviewProps & { avatar: string }> = ({ name, date, rating, comment, likes, dislikes, avatar }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  
  const handleLike = () => {
    setLiked(!liked);
    if (!liked && disliked) setDisliked(false);
  };
  
  const handleDislike = () => {
    setDisliked(!disliked);
    if (!disliked && liked) setLiked(false);
  };

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <img className={styles.avatar} alt={name} src={avatar} />
        <div className={styles.reviewerInfo}>
          <div className={styles.reviewerName}>{name}</div>
          <div className={styles.reviewDate}>{date}</div>
        </div>
      </div>
      
      <div className={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <img 
            key={i}
            className={styles.starIcon} 
            alt="" 
            src="/Figma_photoes/star.svg" 
            style={{ opacity: i < rating ? 1 : 0.3 }}
          />
        ))}
      </div>
      
      <div className={styles.reviewComment}>{comment}</div>
      
      <div className={styles.feedbackContainer}>
        <div 
          className={`${styles.feedbackButton} ${liked ? styles.activeFeedback : ''}`} 
          onClick={handleLike}
        >
          <img 
            className={styles.feedbackIcon} 
            alt="Like" 
            src="/Figma_photoes/like.svg" 
          />
          <span>{likes + (liked ? 1 : 0)}</span>
        </div>
        
        <div 
          className={`${styles.feedbackButton} ${disliked ? styles.activeFeedback : ''}`} 
          onClick={handleDislike}
        >
          <img 
            className={styles.feedbackIcon} 
            alt="Dislike" 
            src="/Figma_photoes/dislike.svg" 
          />
          <span>{dislikes + (disliked ? 1 : 0)}</span>
        </div>
      </div>
    </div>
  );
};

const HiringGuide: FunctionComponent = () => {
  const handleHire = () => {
    alert('You have hired this guide!');
  };
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i <= 4 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pageNumbers.push(i);
    } else if (i === 5 && currentPage < 5) {
      pageNumbers.push('...');
    } else if (i === currentPage + 2 && currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }
  }

  return (
    <Layout>
      <div className={styles.hiringGuide}>
        <div className={styles.guideContainer}>
          <div className={styles.guideHeader}>
            <div className={styles.guideProfile}>
              <img className={styles.profileImage} alt="Nadir Hussein" src="/Figma_photoes/nadir.jpg" />
              <div className={styles.profileInfo}>
                <h1 className={styles.guideName}>Nadir Hussein</h1>
                <p className={styles.guideSpecialty}>Sundarban Wildlife Guide</p>
              </div>
            </div>
            
            <button className={styles.hireButton} onClick={handleHire}>
              Hire Now
            </button>
          </div>
          
          <div className={styles.guideStats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>10+</div>
              <div className={styles.statLabel}>Years Experience</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statValue}>4.8/5</div>
              <div className={styles.statLabel}>Rating</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statValue}>150+</div>
              <div className={styles.statLabel}>Tours Guided</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statValue}>$50</div>
              <div className={styles.statLabel}>Per Hour</div>
            </div>
          </div>
          
          <div className={styles.guideDetails}>
            <div className={styles.detailSection}>
              <h2 className={styles.sectionTitle}>About Nadir</h2>
              <p className={styles.sectionContent}>
                Nadir is a certified Sundarban wildlife guide with over a decade of experience. 
                Specializing in tiger tracking and bird watching, he has extensive knowledge of 
                the mangrove ecosystem. Fluent in English, Bengali, and Hindi, Nadir provides 
                engaging and informative tours that connect visitors with nature.
              </p>
            </div>
            
            <div className={styles.detailSection}>
              <h2 className={styles.sectionTitle}>Specialties</h2>
              <ul className={styles.specialtyList}>
                <li>Wildlife photography tours</li>
                <li>Bird watching expeditions</li>
                <li>Night safari adventures</li>
                <li>Cultural immersion experiences</li>
                <li>Eco-friendly tourism</li>
              </ul>
            </div>
          </div>
          
          <div className={styles.ratingDistribution}>
            <h2 className={styles.sectionTitle}>Rating Distribution</h2>
            <div className={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className={styles.ratingBar}>
                  <div className={styles.ratingStars}>
                    {[...Array(stars)].map((_, i) => (
                      <img key={i} className={styles.smallStar} alt="★" src="/Figma_photoes/star.svg" />
                    ))}
                  </div>
                  <div className={styles.barContainer}>
                    <div 
                      className={styles.barFill} 
                      style={{ 
                        width: `${[72, 20, 5, 2, 1][5 - stars]}%`,
                        backgroundColor: stars === 5 ? '#abb79a' : '#e8decf'
                      }}
                    ></div>
                  </div>
                  <div className={styles.ratingPercent}>
                    {[72, 20, 5, 2, 1][5 - stars]}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.reviewsSection}>
            <h2 className={styles.sectionTitle}>Client Reviews</h2>
            
            <Review 
              name="Mizan Rahman"
              date="September 15, 2023"
              rating={5}
              comment="Nadir's knowledge of the Sundarbans is incredible! He showed us tigers on our very first day. His passion for wildlife conservation is inspiring. Would book again in a heartbeat!"
              likes={10}
              dislikes={1}
              avatar="/Figma_photoes/OIF.jpeg"
            />
            
            <Review 
              name="Kabbo Haque"
              date="September 5, 2023"
              rating={5}
              comment="Our family had an amazing experience with Nadir. He tailored the tour to include activities for both kids and adults. His stories about the Sundarbans made the trip unforgettable!"
              likes={15}
              dislikes={2}
              avatar="/Figma_photoes/OIP (9).jpeg"
            />
            
            <Review 
              name="Tasnim Ahmed"
              date="August 22, 2023"
              rating={4}
              comment="Professional and knowledgeable guide. The boat tour was well-organized and Nadir pointed out wildlife we would have completely missed on our own. Only wish we had more time!"
              likes={8}
              dislikes={0}
              avatar="/Figma_photoes/OIP (10).jpeg"
            />
            <div className={styles.paginationBar}>
              {pageNumbers.map((num, idx) =>
                num === '...'
                  ? <span key={idx} className={styles.ellipsis}>...</span>
                  : <span
                      key={num}
                      className={
                        num === currentPage
                          ? `${styles.pageNumber} ${styles.activePage}`
                          : styles.pageNumber
                      }
                      onClick={() => typeof num === 'number' && setCurrentPage(num)}
                    >
                      {num}
                    </span>
              )}
              {currentPage < totalPages && (
                <span className={styles.pageNumber} onClick={() => setCurrentPage(currentPage + 1)}>
                  Next
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HiringGuide;
