import { FunctionComponent, useState } from "react";
// Tailwind conversion: remove CSS import
import Layout from "../App/Layout";

interface ReviewProps {
  name: string;
  date: string;
  rating: number;
  comment: string;
  likes: number;
  dislikes: number;
}

const Review: FunctionComponent<ReviewProps & { avatar: string }> = ({
  name,
  date,
  rating,
  comment,
  likes,
  dislikes,
  avatar,
}) => {
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
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center gap-4 mb-2">
        <img className="w-12 h-12 rounded-full object-cover" alt={name} src={avatar} />
        <div>
          <div className="font-bold text-primary text-lg">{name}</div>
          <div className="text-xs text-gray-500">{date}</div>
        </div>
      </div>
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <img
            key={i}
            className="w-5 h-5"
            alt=""
            src="/figma_photos/star.svg"
            style={{ opacity: i < rating ? 1 : 0.3 }}
          />
        ))}
      </div>
      <div className="mb-2 text-primary-dark text-sm">{comment}</div>
      <div className="flex gap-4 mt-2">
        <button className={`flex items-center gap-1 px-3 py-1 rounded-lg border border-border ${liked ? 'bg-primary text-white' : 'bg-accent-light text-primary-dark'} transition`} onClick={handleLike}>
          <img className="w-4 h-4" alt="Like" src="/figma_photos/like.svg" />
          <span>{likes + (liked ? 1 : 0)}</span>
        </button>
        <button className={`flex items-center gap-1 px-3 py-1 rounded-lg border border-border ${disliked ? 'bg-red-200 text-red-700' : 'bg-accent-light text-primary-dark'} transition`} onClick={handleDislike}>
          <img className="w-4 h-4" alt="Dislike" src="/figma_photos/dislike.svg" />
          <span>{dislikes + (disliked ? 1 : 0)}</span>
        </button>
      </div>
    </div>
  );
};

const HiringGuide: FunctionComponent = () => {
  const handleHire = () => {
    alert("You have hired this guide!");
  };
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i <= 4 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i);
    } else if (i === 5 && currentPage < 5) {
      pageNumbers.push("...");
    } else if (i === currentPage + 2 && currentPage < totalPages - 2) {
      pageNumbers.push("...");
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-accent-light font-jakarta">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <img className="w-20 h-20 rounded-full object-cover" alt="Nadir Hussein" src="/figma_photos/nadir.jpg" />
              <div>
                <h1 className="text-2xl font-bold text-primary mb-1">Nadir Hussein</h1>
                <p className="text-primary-dark text-base">Sundarban Wildlife Guide</p>
              </div>
            </div>
            <button className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition mt-4 md:mt-0" onClick={handleHire}>Hire Now</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-xl font-bold text-primary mb-1">10+</div>
              <div className="text-xs text-primary-dark">Years Experience</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-xl font-bold text-primary mb-1">4.8/5</div>
              <div className="text-xs text-primary-dark">Rating</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-xl font-bold text-primary mb-1">150+</div>
              <div className="text-xs text-primary-dark">Tours Guided</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-xl font-bold text-primary mb-1">$50</div>
              <div className="text-xs text-primary-dark">Per Hour</div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-2">About Nadir</h2>
            <p className="text-primary-dark text-sm mb-4">Nadir is a certified Sundarban wildlife guide with over a decade of experience. Specializing in tiger tracking and bird watching, he has extensive knowledge of the mangrove ecosystem. Fluent in English, Bengali, and Hindi, Nadir provides engaging and informative tours that connect visitors with nature.</p>
            <h2 className="text-lg font-bold text-primary mb-2">Specialties</h2>
            <ul className="list-disc pl-6 text-primary-dark text-sm">
              <li>Wildlife photography tours</li>
              <li>Bird watching expeditions</li>
              <li>Night safari adventures</li>
              <li>Cultural immersion experiences</li>
              <li>Eco-friendly tourism</li>
            </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-2">Rating Distribution</h2>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(stars)].map((_, i) => (
                      <img key={i} className="w-4 h-4" alt="★" src="/figma_photos/star.svg" />
                    ))}
                  </div>
                  <div className="flex-1 h-3 bg-accent-light rounded overflow-hidden">
                    <div style={{ width: `${[72, 20, 5, 2, 1][5 - stars]}%`, backgroundColor: stars === 5 ? '#abb79a' : '#e8decf' }} className="h-3 rounded" />
                  </div>
                  <div className="text-xs text-primary-dark">{[72, 20, 5, 2, 1][5 - stars]}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-2">Client Reviews</h2>
            <Review
              name="Mizan Rahman"
              date="September 15, 2023"
              rating={5}
              comment="Nadir's knowledge of the Sundarbans is incredible! He showed us tigers on our very first day. His passion for wildlife conservation is inspiring. Would book again in a heartbeat!"
              likes={10}
              dislikes={1}
              avatar="/figma_photos/OIF.jpeg"
            />
            <Review
              name="Kabbo Haque"
              date="September 5, 2023"
              rating={5}
              comment="Our family had an amazing experience with Nadir. He tailored the tour to include activities for both kids and adults. His stories about the Sundarbans made the trip unforgettable!"
              likes={15}
              dislikes={2}
              avatar="/figma_photos/OIP (9).jpeg"
            />
            <Review
              name="Tasnim Ahmed"
              date="August 22, 2023"
              rating={4}
              comment="Professional and knowledgeable guide. The boat tour was well-organized and Nadir pointed out wildlife we would have completely missed on our own. Only wish we had more time!"
              likes={8}
              dislikes={0}
              avatar="/figma_photos/OIP (10).jpeg"
            />
            <div className="flex gap-2 flex-wrap mt-4">
              {pageNumbers.map((num, idx) =>
                num === "..." ? (
                  <span key={idx} className="px-2 text-gray-400">...</span>
                ) : (
                  <span
                    key={num}
                    className={`px-3 py-1 rounded-lg cursor-pointer text-sm font-semibold ${num === currentPage ? 'bg-primary text-white' : 'bg-accent-light text-primary-dark hover:bg-primary-light'}`}
                    onClick={() => typeof num === "number" && setCurrentPage(num)}
                  >
                    {num}
                  </span>
                )
              )}
              {currentPage < totalPages && (
                <span
                  className="px-3 py-1 rounded-lg cursor-pointer text-sm font-semibold bg-accent-light text-primary-dark hover:bg-primary-light"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </span>
              )}
            </div>
          </div>
        </div>
    </Layout>
  );
}

export default HiringGuide;
