import React, { FunctionComponent, useCallback, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from '../App/Layout';

const FILTERS = [
  { label: 'Popular', value: 'popular' },
  { label: 'Highest Rated', value: 'highest' },
  { label: 'Newest', value: 'newest' },
  { label: 'Budget-friendly', value: 'budget' },
  { label: 'Fast Delivery', value: 'fast' },
  { label: 'Halal', value: 'halal' },
];

const Restaurant:FunctionComponent = () => {
  const _navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('popular');
  const [priceRange, setPriceRange] = useState(1000); // Example max price
  // Optionally, add filter state if you want dropdowns like Packages
  // const [openFilter, setOpenFilter] = useState<string | null>(null);
  // const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});

  // Dummy restaurant data for filtering (replace with your real data)
  const restaurants = [
    {
      name: 'NORTH END coffee',
      location: 'Shahajadpur, Dhaka',
      image: '/Figma_photoes/NE.jpeg',
      rating: '4.8★ (1,200+ reviews)',
      cuisine: 'Bengali cuisine',
      price: 350,
      tags: ['popular', 'highest', 'halal'],
    },
    {
      name: 'Mezzan Haile Aaiun',
      location: 'Chittagong',
      image: '/Figma_photoes/local_cuisine.jpeg',
      rating: '4.7★ (950+ reviews)',
      cuisine: 'Traditional Bangladeshi dishes',
      price: 200,
      tags: ['popular', 'budget', 'halal'],
    },
    {
      name: 'Panshi Restaurant',
      location: 'Sylhet',
      image: '/Figma_photoes/tandoori-chicken.jpg',
      rating: '4.6★ (800+ reviews)',
      cuisine: 'Sylheti specialties',
      price: 150,
      tags: ['popular', 'newest', 'halal'],
    },
    {
      name: 'Sultans Dine',
      location: 'Gulshan 2',
      image: '/Figma_photoes/s-dine.png',
      rating: '4.9★ (1,500+ reviews)',
      cuisine: 'Biryani and kebabs',
      price: 400,
      tags: ['highest', 'fast', 'halal'],
    },
    {
      name: 'Kamrul Hotel',
      location: 'Khulna',
      image: '/Figma_photoes/hqdefault.jpg',
      rating: '4.5★ (700+ reviews)',
      cuisine: 'Orginal Chuijhaal flavors',
      price: 100,
      tags: ['budget', 'halal'],
    },
    {
      name: 'Kacchi Vai',
      location: 'Narayanganj',
      image: '/Figma_photoes/kacchi.jpeg',
      rating: '4.7★ (600+ reviews)',
      cuisine: 'Delicious Kacchi',
      price: 250,
      tags: ['budget', 'fast', 'halal'],
    },
  ];

  // Filter restaurants by search and selected filter
  const filteredRestaurants = restaurants.filter(r =>
    (selectedFilter === 'popular' || r.tags.includes(selectedFilter)) &&
    r.price <= priceRange &&
    (
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase())
    )
  );

  const _onDepth4FrameClick = useCallback(() => {
    // Add your code here
  }, []);
  
  return (
    <Layout>
      <div className={styles.restaurant}>
        <div className={styles.restaurants}>
          <div className={styles.depth0Frame0}>
            <div className={styles.depth1Frame0}>
              <div className={styles.groupParent}>
                <h1 className={styles.topRatedEateries}>Top-Rated Eateries Across Bangladesh</h1>
              </div>
              {/* Search Bar */}
              <div className={styles.searchBarContainer}>
                <img
                  src="/Figma_photoes/search.svg"
                  alt="search"
                  className={styles.searchIconInside}
                />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search restaurants or cuisines"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              {/* Price Range */}
              <div className={styles.priceRangeContainer}>
                <span className={styles.priceRangeLabel}>Max Price:</span>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  className={styles.priceRangeInput}
                />
                <span className={styles.priceRangeValue}>৳{priceRange}</span>
              </div>
              {/* Filter Buttons */}
              <div className={styles.filterButtonsContainer}>
                {FILTERS.map(f => (
                  <button
                    key={f.value}
                    className={styles.filterButton + (selectedFilter === f.value ? ' ' + styles.selected : '')}
                    onClick={() => setSelectedFilter(f.value)}
                    type="button"
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {/* Restaurant Cards Grid */}
              <div className={styles.depth5Frame04}>
                {filteredRestaurants.map(r => (
                  <div className={styles.depth6Frame09} key={r.name}>
                    <img className={styles.cardImage} alt="" src={r.image} />
                    <div className={styles.cardContent}>
                      <div className={styles.cardTitle}>{r.name} <span style={{fontWeight:400, color:'#888'}}>({r.location})</span></div>
                      <div className={styles.cardDescription}>{r.rating} · {r.cuisine}</div>
                      {r.price && <div className={styles.priceTag}>৳{r.price}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Restaurant;
