import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

// Blog interface (same as in Blog.tsx)
interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: number;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
}

// Mock data for blog details (same as in Blog.tsx)
const mockBlogs: BlogPost[] = [
  {
    id: "1",
    title: "Adventure in Sundarbans",
    content: `The Sundarbans, a UNESCO World Heritage Site, is a sprawling mangrove forest shared by India and Bangladesh. Its unique biodiversity, including the famous Royal Bengal Tiger, makes it a haven for nature enthusiasts and adventure seekers alike.

My journey began early morning from Dhaka, taking a bus to Khulna and then a boat to reach the heart of the Sundarbans. The anticipation was palpable as we navigated through the narrow waterways, surrounded by dense mangrove trees that seemed to whisper ancient secrets.

The first glimpse of this mystical land was breathtaking. The intertwining roots of mangrove trees created a natural maze, while the water reflected the green canopy above. Our guide, a local fisherman named Karim, shared stories of his encounters with the wildlife that calls this place home.

**Wildlife Encounters**

The Sundarbans is home to an incredible array of wildlife. During our three-day expedition, we spotted:

- **Royal Bengal Tigers**: The apex predators of this ecosystem. We were fortunate to catch a glimpse of one swimming across a channel – a sight that will forever be etched in my memory.
- **Spotted Deer**: Graceful creatures that serve as the primary prey for tigers.
- **Crocodiles**: Ancient reptiles basking on muddy banks, completely still until they sense movement.
- **Dolphins**: Playful Gangetic dolphins that followed our boat, their fins cutting through the murky water.
- **Birds**: Over 300 species including kingfishers, herons, and the magnificent fish eagles.

**Local Communities**

Beyond the wildlife, the Sundarbans offered a glimpse into the lives of local communities who have learned to coexist with this challenging environment. We visited Kotka village, where families have lived for generations, making their living from fishing and honey collection.

The resilience of these people is remarkable. They've developed unique techniques for tiger-safe fishing and have an intricate knowledge of tidal patterns. Their boats are designed specifically for navigating the shallow, winding channels of the mangroves.

**Conservation Efforts**

The Sundarbans faces numerous threats including climate change, pollution, and poaching. Local conservation groups are working tirelessly to protect this unique ecosystem. During our visit, we learned about:

- Tiger monitoring programs using camera traps
- Mangrove reforestation projects
- Alternative livelihood programs for local communities
- Eco-tourism initiatives that provide sustainable income

**Practical Tips for Visitors**

If you're planning to visit the Sundarbans, here are some essential tips:

1. **Best Time**: November to February when the weather is cooler and wildlife is more active
2. **Permits**: Required for entry – arrange through licensed tour operators
3. **Safety**: Always stay with your guide and follow safety protocols
4. **Gear**: Bring binoculars, camera with zoom lens, insect repellent, and sunscreen
5. **Respect**: Maintain distance from wildlife and follow eco-friendly practices

The Sundarbans taught me that true adventure lies not just in the thrill of spotting a tiger, but in understanding and respecting the delicate balance of nature. This experience has deepened my appreciation for Bangladesh's natural heritage and the urgent need to protect it for future generations.`,
    excerpt: "Discover the mysterious mangrove forests and wildlife of the Sundarbans in this thrilling adventure story.",
    author: "Omar Rahman",
    date: "2023-07-15",
    category: "Adventure",
    image: "Figma_photos/fisherman-sundarbans-india-looking-catch-mangrove-islands-west-bengal-74904922.jpg",
    readTime: 8,
    tags: ["Sundarbans", "Wildlife", "Adventure", "Bangladesh"],
    likes: 120,
    comments: 45,
    shares: 30
  },
  {
    id: "2",
    title: "Cox's Bazar: World's Longest Sea Beach",
    content: `Cox's Bazar boasts the world's longest unbroken sandy sea beach, stretching over 120 kilometers along the Bay of Bengal. This coastal paradise offers breathtaking sunsets, fresh seafood, and endless opportunities for relaxation and adventure.

**The Journey to Paradise**

My journey to Cox's Bazar began with a flight from Dhaka, though many travelers prefer the scenic bus route that winds through the hill districts. As the plane descended, I caught my first glimpse of the endless stretch of golden sand meeting the azure waters of the Bay of Bengal – a sight that never fails to take your breath away.

**The Beach Experience**

The main beach area near the town center is bustling with activity. Local vendors sell everything from fresh coconuts to colorful beach accessories. Horse rides along the shore are particularly popular during sunset, offering a romantic way to experience the beach's beauty.

For those seeking tranquility, the southern stretches of the beach, particularly around Himchari and Inani, offer more secluded experiences. Here, you can walk for hours without encountering crowds, with only the sound of waves and seabirds for company.

**Sunset Magic**

Cox's Bazar is renowned for its spectacular sunsets. Every evening, locals and tourists gather along the shore to witness the sun's dramatic descent into the Bay of Bengal. The sky transforms into a canvas of oranges, pinks, and purples, reflecting beautifully on the wet sand.

The best sunset viewing spots include:
- **Laboni Beach**: The main beach area with cafes and restaurants nearby
- **Sugandha Beach**: Less crowded with fishing boats creating picturesque silhouettes
- **Kolatoli Beach**: Perfect for photography with minimal crowds

**Culinary Delights**

The seafood in Cox's Bazar is exceptional. Fresh catches arrive daily, and beachside restaurants serve everything from grilled prawns to elaborate fish curries. Don't miss:

- **Hilsa Fish Curry**: Bangladesh's national fish prepared with traditional spices
- **Prawn Malai Curry**: Creamy coconut-based curry with jumbo prawns
- **Crab Masala**: Spicy preparation perfect with steamed rice
- **Dry Fish**: Local delicacy, though an acquired taste for some

**Adventure Activities**

Beyond relaxing on the beach, Cox's Bazar offers numerous activities:

- **Surfing**: Growing in popularity with several surf schools now operating
- **Parasailing**: Experience the coastline from above
- **Jet Skiing**: Thrilling rides across the waves
- **Beach Cycling**: Rent bikes and explore the coastline
- **Fishing**: Join local fishermen for early morning expeditions

**Nearby Attractions**

Cox's Bazar serves as a gateway to several other attractions:

- **Himchari National Park**: Waterfalls and hiking trails
- **Inani Beach**: Coral stones and clearer waters
- **Maheshkhali Island**: Buddhist temples and traditional fishing villages
- **Teknaf**: Southernmost point of Bangladesh

**Best Time to Visit**

The ideal time to visit Cox's Bazar is from October to March when the weather is pleasant and rainfall is minimal. The monsoon season (June to September) brings heavy rains but also fewer crowds and lower prices.

Cox's Bazar offers something for everyone – whether you're seeking adventure, relaxation, or cultural experiences. The combination of natural beauty, warm hospitality, and affordable prices makes it a must-visit destination in Bangladesh.`,
    excerpt: "Experience the magic of the world's longest natural sea beach and its stunning sunsets.",
    author: "Fatima Khan",
    date: "2023-08-10",
    category: "Beach",
    image: "Figma_photos/cox-s-bazaar-syed-zakir-hossain-1584366863439.jpg",
    readTime: 6,
    tags: ["Cox's Bazar", "Beach", "Sunset", "Bangladesh"],
    likes: 89,
    comments: 32,
    shares: 25
  },
  {
    id: "3",
    title: "Exploring the Hills of Bandarban",
    content: `Bandarban, nestled in the Chittagong Hill Tracts, offers a perfect escape into nature with its rolling hills, pristine lakes, and indigenous communities. From trekking to Nilgiri to experiencing the unique culture of hill tribes, Bandarban is a treasure trove for adventurous travelers.

**Gateway to the Hills**

Bandarban town serves as the perfect base for exploring the hill districts. The journey from Chittagong takes about 2-3 hours by road, with the landscape gradually transforming from plains to rolling hills covered in dense forests.

The town itself has a unique character, with indigenous markets, Buddhist temples, and a laid-back atmosphere that immediately sets it apart from the bustling cities of Bangladesh.

**Nilgiri Hills: The Crown Jewel**

No trip to Bandarban is complete without visiting Nilgiri, often called the "Blue Hills." The journey to the top involves a thrilling ride up winding mountain roads, offering spectacular views at every turn.

At the summit, visitors are rewarded with panoramic views of the surrounding hills shrouded in clouds. The experience is particularly magical during sunrise and sunset when the hills take on different hues.

**Adventure Activities**

Bandarban offers numerous adventure opportunities:

**Trekking and Hiking**
- **Keokradong**: Second highest peak in Bangladesh
- **Tahjindong**: Challenging trek through tribal villages
- **Chimbuk Hill**: Accessible by road with excellent views

**Water Adventures**
- **Sangu River**: White water rafting and river cruising
- **Nilgiri Lake**: Boating and fishing
- **Boga Lake**: High-altitude lake perfect for camping

**Cultural Experiences**
- **Tribal Villages**: Visit Marma, Chakma, and Tripura communities
- **Traditional Crafts**: Learn weaving and bamboo crafts
- **Local Festivals**: Experience Biju, Sangrai, and other celebrations

**Indigenous Culture**

The hill districts are home to numerous indigenous communities, each with their own language, culture, and traditions. The Marma people, with their Buddhist heritage, have beautiful monasteries and pagodas scattered throughout the hills.

Visiting tribal villages offers insights into sustainable living practices that have been passed down through generations. The communities practice shifting cultivation, traditional crafts, and maintain a harmonious relationship with the forest environment.

**Flora and Fauna**

Bandarban's forests are rich in biodiversity. The area is home to elephants, leopards, various species of primates, and hundreds of bird species. The forests are also known for their medicinal plants and rare orchids.

**Accommodation Options**

From budget guesthouses to eco-resorts, Bandarban offers accommodation for every type of traveler:

- **Government Rest Houses**: Basic but clean accommodation
- **Eco-resorts**: Sustainable lodging with nature views
- **Tribal Homestays**: Authentic cultural experiences
- **Camping**: For the adventurous, camping under the stars

**Photography Tips**

Bandarban is a photographer's paradise. The best shots include:
- Early morning mist over the hills
- Sunset from Nilgiri viewpoint
- Traditional tribal architecture
- Terraced agricultural lands
- Waterfalls during monsoon season

**Responsible Tourism**

When visiting Bandarban, it's important to practice responsible tourism:
- Respect indigenous cultures and traditions
- Don't litter in natural areas
- Support local businesses and guides
- Follow designated trails to minimize environmental impact

Bandarban offers a unique blend of natural beauty and cultural richness that makes it one of Bangladesh's most rewarding destinations for travelers seeking authentic experiences away from the typical tourist trail.`,
    excerpt: "Journey through the scenic hills and discover the rich cultural heritage of Bangladesh's hill tribes.",
    author: "Rajib Hasan",
    date: "2023-09-05",
    category: "Hills",
    image: "Figma_photos/bandarban.jpg",
    readTime: 10,
    tags: ["Bandarban", "Hills", "Trekking", "Culture"],
    likes: 156,
    comments: 67,
    shares: 42
  },
  {
    id: "4",
    title: "Heritage Walk in Old Dhaka",
    content: `Old Dhaka is a living museum of Mughal architecture, bustling bazaars, and centuries-old traditions. Walk through the narrow lanes of Shankhari Bazaar, visit the historic Lalbagh Fort, and experience the vibrant street food culture that defines this ancient city.

**A Journey Through Time**

Old Dhaka, known as "Puran Dhaka" in Bengali, is the historic core of Bangladesh's capital. Founded in the 17th century during the Mughal period, this area has witnessed the rise and fall of empires, the birth of a nation, and the evolution of a unique urban culture.

Walking through Old Dhaka is like stepping back in time. The narrow streets, lined with centuries-old buildings, tell stories of merchants, artisans, and rulers who once called this place home.

**Historical Landmarks**

**Lalbagh Fort**
Built in the 17th century by Mughal Prince Muhammad Azam, son of Emperor Aurangzeb, Lalbagh Fort stands as one of the finest examples of Mughal architecture in Bangladesh. The fort complex includes the tomb of Pari Bibi, the Diwan-i-Aam, and beautiful gardens.

**Ahsan Manzil (Pink Palace)**
Once the residence of the Nawabs of Dhaka, this pink-colored palace is now a museum showcasing the lifestyle of Dhaka's former rulers. The architecture blends European and Mughal styles, reflecting the cosmopolitan nature of 19th-century Dhaka.

**Huseni Dalan**
An important Shia mosque and imambara, Huseni Dalan is the center of Muharram observances in Dhaka. The building's architecture reflects Persian influences and houses historical artifacts.

**Traditional Bazaars**

**Shankhari Bazaar**
This 400-year-old street is famous for its conch shell artisans and traditional Hindu craftsmen. The narrow lane is lined with shops selling religious items, traditional jewelry, and musical instruments.

**Chawk Bazaar**
One of the oldest commercial areas in Dhaka, Chawk Bazaar is famous for its traditional sweets, especially during Ramadan. The area comes alive during Iftar time with countless food stalls.

**Shakhari Bazaar**
Known for traditional metalwork and handicrafts, this bazaar offers everything from brass utensils to decorative items crafted using centuries-old techniques.

**Culinary Heritage**

Old Dhaka is the culinary heart of Bangladesh. The area is famous for:

**Traditional Sweets**
- **Chomchom**: Spongy syrup-soaked sweet
- **Rasmalai**: Cheese balls in flavored milk
- **Mishti Doi**: Sweet yogurt in clay pots

**Street Food**
- **Fuchka**: Spicy water-filled crispy shells
- **Chotpoti**: Tangy chickpea snack
- **Haleem**: Slow-cooked lentil and meat stew
- **Kebabs**: Grilled meat specialties

**Biryani Tradition**
Old Dhaka is renowned for its unique style of biryani, particularly the famous "Puran Dhaka Biryani" with its distinctive aroma and flavor profile.

**Architectural Heritage**

The architecture of Old Dhaka reflects various influences:

**Mughal Elements**
- Pointed arches and domes
- Intricate geometric patterns
- Use of red brick and white lime mortar

**Colonial Influences**
- European-style buildings from the British period
- Administrative buildings with neo-classical features

**Traditional Bengali Architecture**
- Courtyard houses (uthon bari)
- Decorative terracotta work
- Traditional ventilation systems

**Cultural Traditions**

Old Dhaka maintains many traditions that have disappeared elsewhere:

**Festivals and Celebrations**
- **Durga Puja**: Grand celebrations in traditional pandals
- **Kali Puja**: Nighttime festivities with elaborate decorations
- **Eid Celebrations**: Community gatherings and traditional feasts

**Traditional Crafts**
- Conch shell carving
- Traditional weaving
- Metalwork and jewelry making
- Pottery and ceramics

**Photography Tips**

Capturing Old Dhaka requires patience and respect:
- Early morning light is ideal for architecture
- Ask permission before photographing people
- Focus on details: doorways, windows, street scenes
- Contrast between old and new makes compelling shots

**Planning Your Visit**

**Best Time**: October to March when weather is pleasant
**Duration**: Allow at least a full day for proper exploration
**Guide**: Consider hiring a local guide for historical context
**Safety**: Stay aware of traffic and crowds in narrow streets

**Preservation Challenges**

Old Dhaka faces numerous challenges:
- Urban development pressure
- Traffic congestion
- Deteriorating historic buildings
- Loss of traditional crafts

Several organizations are working to preserve this heritage, including restoration projects and cultural documentation efforts.

Old Dhaka represents the soul of Bangladesh – a place where history, culture, and tradition converge in the bustling streets of a living city. Each visit reveals new layers of this complex urban tapestry that has evolved over four centuries.`,
    excerpt: "Step back in time and explore the rich history and culture of Old Dhaka's heritage sites.",
    author: "Shabnam Ara",
    date: "2023-09-20",
    category: "Heritage",
    image: "Figma_photos/fc09d33522052723c107a6d1fe5741b0-ahsan-manzil.jpg",
    readTime: 7,
    tags: ["Dhaka", "Heritage", "History", "Culture"],
    likes: 203,
    comments: 89,
    shares: 56
  },
  {
    id: "5",
    title: "Culinary Journey Through Bangladesh",
    content: `From the spicy fish curries of Sylhet to the sweet delicacies of Comilla, Bangladesh offers a rich tapestry of flavors. This culinary journey explores the diverse regional cuisines, street food culture, and traditional cooking methods that make Bangladeshi cuisine unique.

**The Foundation of Bengali Cuisine**

Bengali cuisine is built around rice and fish, reflecting the geography of this riverine country. The saying "Machhe-Bhate Bangali" (fish and rice make a Bengali) perfectly captures the essence of Bangladeshi food culture.

The cuisine has been influenced by various cultures over centuries - from the Mughals who brought rich, aromatic dishes to the British colonial period that introduced new ingredients and cooking techniques.

**Regional Specialties**

**Dhaka Division**
The capital region is known for its sophisticated Mughal-influenced cuisine:
- **Kacchi Biryani**: Layer of rice and meat slow-cooked in a sealed pot
- **Shahi Tukra**: Royal bread pudding with nuts and cream
- **Nargisi Kofta**: Egg-stuffed meatballs in rich gravy

**Chittagong Division**
Coastal cuisine with emphasis on seafood:
- **Mezbani Mangsho**: Spicy beef curry served at celebrations
- **Shutki Mach**: Dried fish preparations
- **Hilsa Curry**: The national fish prepared in various styles

**Sylhet Division**
Known for aromatic dishes and unique flavors:
- **Shatkora Beef**: Beef curry with wild citrus
- **Panta Ilish**: Fermented rice with hilsa fish
- **Seven-layer Tea**: Famous layered tea from Sreemangal

**Rajshahi Division**
Famous for sweets and dairy products:
- **Chomchom**: Spongy cottage cheese sweet
- **Kalojam**: Dark, syrup-soaked sweet balls
- **Sandesh**: Milk-based confection

**Rangpur Division**
Known for simple, flavorful dishes:
- **Pabda Fish Curry**: Small fish in light gravy
- **Doi Bora**: Lentil fritters in yogurt
- **Local vegetables**: Unique preparations of indigenous vegetables

**Street Food Culture**

Bangladesh's street food scene is vibrant and diverse:

**Dhaka Street Food**
- **Fuchka**: Crispy shells filled with spicy water
- **Chotpoti**: Tangy chickpea and potato mix
- **Jhalmuri**: Spicy puffed rice snack
- **Beguni**: Battered and fried eggplant

**Regional Street Food**
- **Chittagong's Akhni**: Rice dish with meat and spices
- **Sylhet's Shish Kebab**: Grilled meat skewers
- **Comilla's Roshmalai**: Sweet cheese balls in milk

**Traditional Cooking Methods**

**Clay Pot Cooking (Matir Chula)**
Traditional clay pots impart a unique earthy flavor to dishes. This method is still used for special occasions and traditional recipes.

**Steam Cooking (Bhapa)**
A healthy cooking method using banana leaves or covered pots. Popular for fish and vegetable preparations.

**Slow Cooking (Dum)**
Inherited from Mughal cuisine, this method involves sealing the pot and cooking on low heat, allowing flavors to develop fully.

**Fermentation**
Used for rice (panta bhat), fish (shutki), and vegetables (pickles), fermentation adds unique flavors and preserves food.

**Seasonal Cooking**

**Summer Dishes**
- **Panta Bhat**: Fermented rice with onions and chilies
- **Lassi**: Yogurt-based cooling drinks
- **Ice cream and kulfi**: Traditional frozen desserts

**Monsoon Specials**
- **Khichuri**: Comfort food of rice and lentils
- **Fried foods**: Beguni, pakoras, and fritters
- **Hot tea**: Spiced tea to ward off the chill

**Winter Delicacies**
- **Date Palm Jaggery**: Fresh from winter harvest
- **Payesh**: Rice pudding made with new rice
- **Pitha**: Traditional rice cakes and sweets

**Spices and Ingredients**

**Essential Spices**
- **Panch Phoron**: Five-spice blend unique to Bengal
- **Turmeric**: Used fresh and dried
- **Mustard Oil**: Primary cooking medium
- **Green Chilies**: For heat and flavor

**Unique Ingredients**
- **Hilsa Fish**: National fish of Bangladesh
- **Coconut**: Used in various forms
- **Banana Leaves**: For wrapping and steaming
- **Milk and Dairy**: For sweets and desserts

**Cooking Techniques**

**Bhuna**: Slow-cooking spices until oil separates
**Kosha**: Dry-frying to concentrate flavors
**Jhol**: Light gravy-based preparations
**Bhorta**: Mashed preparations with mustard oil

**Food and Culture**

Food in Bangladesh is deeply connected to culture and traditions:

**Religious Observances**
- **Iftar**: Special foods for breaking Ramadan fast
- **Eid Feasts**: Elaborate meals for celebrations
- **Puja Foods**: Vegetarian dishes for Hindu festivals

**Life Events**
- **Wedding Feasts**: Multi-course elaborate meals
- **Birth Celebrations**: Sweet distribution
- **Funeral Foods**: Simple, community-prepared meals

**Hospitality**
Bengali hospitality is legendary, with guests always offered food and tea. The phrase "Esho, bosho, khao" (come, sit, eat) embodies this culture.

**Modern Food Scene**

While traditional cuisine remains strong, Bangladesh's food scene is evolving:

**Fusion Cuisine**
- Bengali-Chinese dishes
- Modern interpretations of classics
- International influences

**Health Consciousness**
- Organic farming movements
- Reduced oil cooking
- Traditional superfoods rediscovered

**Food Tourism**
- Heritage food walks
- Cooking classes for tourists
- Food festivals celebrating regional cuisines

Bangladeshi cuisine is a testament to the country's rich cultural heritage, reflecting its history, geography, and the warmth of its people. Each dish tells a story, each meal is a celebration, and every flavor carries the essence of this beautiful land.`,
    excerpt: "Embark on a flavorful adventure through Bangladesh's diverse culinary landscape.",
    author: "Chef Karim",
    date: "2023-09-12",
    category: "Food",
    image: "Figma_photos/555536.jpg",
    readTime: 9,
    tags: ["Food", "Culture", "Traditional", "Bangladesh"],
    likes: 178,
    comments: 91,
    shares: 67
  },
  {
    id: "6",
    title: "River Life on the Padma",
    content: `The mighty Padma River is the lifeline of Bangladesh, supporting millions of people along its banks. Experience the vibrant river culture, from fishing communities to river markets, and witness how this great river shapes the daily lives of the Bengali people.

**The Mighty Padma**

The Padma River, known as the Ganges in India, enters Bangladesh as one of the most significant waterways in South Asia. This mighty river has shaped the geography, culture, and economy of Bengal for millennia, earning its place as the spiritual and practical lifeline of the region.

Flowing for over 120 kilometers through Bangladesh before joining the Meghna River, the Padma carries not just water, but the hopes, dreams, and livelihoods of millions of people who depend on its bounty.

**Life Along the Banks**

**Fishing Communities**

The fishing communities along the Padma have developed a unique culture over generations. These communities, known as "Jele" in Bengali, have intimate knowledge of the river's moods, fish migration patterns, and seasonal changes.

Their traditional boats, called "dingi" and "kheyya," are perfectly adapted for river fishing. These vessels are not just tools but extensions of the fishermen themselves, crafted with skills passed down through generations.

**Traditional Fishing Methods**
- **Current Jal**: Large nets operated by multiple fishermen
- **Polo Jal**: Circular throw nets for shallow waters
- **Ilish Fishing**: Specialized techniques for catching hilsa fish
- **Night Fishing**: Using lights to attract fish in deeper waters

**River Markets and Trade**

The Padma serves as a natural highway for trade and commerce. River ports along its banks buzz with activity as goods move between districts:

**Goalanda Ghat**
One of the busiest river ports, Goalanda connects the northern and southern regions of Bangladesh. The ferry terminal here handles thousands of passengers and vehicles daily.

**Paturia-Daulatdia Ferry**
This crucial link connects Manikganj and Rajbari districts, facilitating trade and passenger movement across the river.

**Agricultural Trade**
Farmers from both sides of the river bring their produce to riverside markets:
- Rice from the fertile floodplains
- Jute from traditional growing areas
- Vegetables and fruits
- Dairy products from river-fed pastures

**Cultural Significance**

**Religious Importance**

The Padma holds deep religious significance for both Hindus and Muslims. Hindu pilgrims consider it sacred as part of the Ganges system, while Muslims respect it as one of the rivers of paradise mentioned in Islamic tradition.

**River Festivals**
- **Ganga Aarti**: Evening prayers offered to the river
- **Boat Races**: Traditional competitions during festivals
- **Fish Festivals**: Celebrations of the hilsa catch season

**Folk Culture**

The river has inspired countless folk songs, stories, and legends:
- **Bhatiyali Songs**: Traditional boat songs of the Padma
- **River Legends**: Stories of river spirits and mythical creatures
- **Folk Tales**: Adventures of fishermen and river traders

**Seasonal Rhythms**

**Monsoon Season (June-September)**
During monsoons, the Padma swells dramatically, sometimes expanding to several kilometers in width. This season brings:
- Abundant fish catches
- Flooding of low-lying areas
- Rich silt deposits that fertilize farmland
- Challenging navigation conditions

**Dry Season (October-May)**
As waters recede, a different rhythm emerges:
- Sandbars and chars (river islands) emerge
- Easier river crossing
- Concentrated fish populations
- Agricultural activities on exposed riverbed

**Environmental Challenges**

**River Erosion**
The Padma is notorious for its erosive power, constantly changing course and claiming riverside settlements. Thousands of families lose their homes annually to river erosion.

**Climate Change Impact**
- Irregular flooding patterns
- Changing fish migration routes
- Saltwater intrusion during dry seasons
- Extreme weather events

**Pollution Concerns**
- Industrial waste from upstream
- Agricultural runoff
- Plastic pollution
- Sewage discharge from riverside towns

**Economic Importance**

**Fisheries**
The Padma supports one of Bangladesh's most important fishing industries:
- **Hilsa (Ilish)**: The national fish, primarily caught in the Padma
- **Rui, Katla, Mrigel**: Major carp species
- **Export Industry**: Fish products exported globally

**Transportation**
- Ferry services connecting districts
- Cargo transportation
- Passenger launches
- Traditional boat services

**Agriculture**
The river's floodplains are among the most fertile in Bangladesh:
- Rice cultivation in flooded areas
- Vegetable farming on chars
- Jute production along banks

**Modern Developments**

**Padma Bridge**
The recently completed Padma Bridge represents a monumental achievement, connecting the southern districts directly to Dhaka and the northern regions.

**River Training Projects**
Various projects aim to manage the river's course and reduce erosion:
- Concrete block protection
- Geobag installations
- River dredging programs

**Conservation Efforts**

**Fish Sanctuaries**
Protected areas during breeding seasons help maintain fish populations.

**Community Programs**
Local organizations work to:
- Reduce pollution
- Promote sustainable fishing
- Protect river ecosystems
- Support displaced communities

**Photography and Tourism**

The Padma offers incredible opportunities for photographers and tourists:

**Best Photography Spots**
- Sunrise over the river from Maawa
- Fishing boats at Goalanda
- Ferry crossings at Paturia
- Chars during dry season

**River Tourism**
- Traditional boat rides
- Fishing expeditions with locals
- Cultural tours of riverside villages
- River cruise experiences

**Future Challenges and Opportunities**

**Sustainable Development**
Balancing economic development with environmental protection remains a key challenge. Future plans include:
- Eco-friendly river ports
- Sustainable fishing practices
- Pollution control measures
- Climate adaptation strategies

**Tourism Potential**
The river's cultural and natural heritage offers significant tourism opportunities:
- Heritage boat tours
- Cultural immersion programs
- Photography expeditions
- Educational trips

The Padma River continues to be the backbone of life in central Bangladesh. Its waters carry not just silt and fish, but the dreams and struggles of millions who call its banks home. Understanding and respecting this relationship between people and river is crucial for sustainable development and cultural preservation.

From the morning mist rising over fishing boats to the evening calls of boatmen returning home, the Padma offers a glimpse into the soul of Bengal – a land where rivers and people flow together in an eternal dance of life.`,
    excerpt: "Discover the rich cultural heritage and daily life along Bangladesh's mighty Padma River.",
    author: "Nasir Ahmed",
    date: "2023-08-28",
    category: "Culture",
    image: "Figma_photos/burigangha.jpg",
    readTime: 7,
    tags: ["River", "Culture", "Community", "Bangladesh"],
    likes: 134,
    comments: 56,
    shares: 38
  }
];

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the blog post by ID
  const blog = mockBlogs.find(blog => blog.id === id);

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white py-12 px-4 mt-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/blogs')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition"
            >
              Back to Blogs
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    // Split content by double line breaks to create paragraphs
    return content.split('\n\n').map((paragraph, index) => {
      // Check if paragraph is a heading (starts with **)
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        const headingText = paragraph.slice(2, -2);
        return (
          <h3 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            {headingText}
          </h3>
        );
      }
      
      // Check if paragraph contains bullet points
      if (paragraph.includes('- **')) {
        const items = paragraph.split('\n').filter(line => line.trim().startsWith('- '));
        return (
          <ul key={index} className="space-y-2 mb-6">
            {items.map((item, itemIndex) => {
              // Handle bold text in list items
              const cleanItem = item.replace('- **', '').replace(/\*\*/g, '');
              const [boldPart, ...rest] = cleanItem.split(':');
              return (
                <li key={itemIndex} className="flex">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>
                    <strong className="text-gray-900">{boldPart}:</strong>
                    {rest.length > 0 && <span className="text-gray-700">{rest.join(':')}</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-gray-700 mb-6 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <>
      <Navbar />
      <article className="min-h-screen bg-white py-12 px-4 mt-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-8 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </button>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                {blog.category}
              </span>
              <span className="text-gray-500 text-sm">{blog.readTime} min read</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex items-center justify-between text-gray-600 mb-6">
              <div className="flex items-center gap-4">
                <span>By <strong>{blog.author}</strong></span>
                <span>{formatDate(blog.date)}</span>
              </div>
            </div>

            {/* Featured Image */}
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgODBMMjI1IDEyMEwxNzUgMTYwVjgwWiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4K";
              }}
            />
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {formatContent(blog.content)}
          </div>

          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Social Stats */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex gap-6 text-gray-600">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  {blog.likes} likes
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  {blog.comments} comments
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  {blog.shares} shares
                </span>
              </div>
              
              <div className="flex gap-3">
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition">
                  Like
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Related Articles Section */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">More Travel Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockBlogs
                .filter(relatedBlog => relatedBlog.id !== blog.id)
                .slice(0, 2)
                .map((relatedBlog) => (
                  <article
                    key={relatedBlog.id}
                    onClick={() => navigate(`/blogs/${relatedBlog.id}`)}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <img
                      src={relatedBlog.image}
                      alt={relatedBlog.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgODBMMjI1IDEyMEwxNzUgMTYwVjgwWiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4K";
                      }}
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                          {relatedBlog.category}
                        </span>
                        <span className="text-gray-500 text-sm">{relatedBlog.readTime} min read</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {relatedBlog.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {relatedBlog.excerpt}
                      </p>
                      <div className="text-sm text-gray-500">
                        By {relatedBlog.author} • {formatDate(relatedBlog.date)}
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
};

export default BlogDetail;