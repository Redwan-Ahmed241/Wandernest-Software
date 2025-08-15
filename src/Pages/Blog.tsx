import { FunctionComponent, useCallback } from 'react';
// Tailwind conversion: remove CSS import
import Footer from '../Components/Footer';


const Blogs:FunctionComponent = () => {
  	
  	const onDepth5FrameClick = useCallback(() => {
    		// Add your code here
  	}, []);
  	
  	return (
					<div className="min-h-screen bg-white text-primary-dark font-jakarta">
						<div className="max-w-4xl mx-auto py-8 px-4">
							{/* Header Section */}
							<div className="flex flex-col md:flex-row items-center justify-between mb-8">
								<div className="flex items-center gap-4">
									<img className="w-12 h-12" alt="" src="Depth 5, Frame 0.svg" />
									<b className="text-2xl text-primary">WanderNest</b>
								</div>
								<div className="flex gap-4 mt-4 md:mt-0">
									<button className="px-4 py-2 rounded-lg bg-accent text-primary-dark font-semibold hover:bg-primary-light transition" onClick={onDepth5FrameClick}>Groups</button>
									<button className="px-4 py-2 rounded-lg bg-accent-light text-primary-dark font-semibold hover:bg-primary-light transition" onClick={onDepth5FrameClick}>Blog</button>
									<button className="px-4 py-2 rounded-lg bg-accent text-primary-dark font-semibold hover:bg-primary-light transition" onClick={onDepth5FrameClick}>Contact</button>
								</div>
							</div>

							{/* Search & Sign In Section */}
							<div className="flex items-center justify-between mb-8">
								<div className="flex items-center gap-2">
									<img className="w-8 h-8" alt="" src="Depth 6, Frame 0.svg" />
									<span className="text-lg text-primary-dark">Search</span>
								</div>
								<button className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition">Sign In</button>
							</div>

							{/* Blog Content */}
							<div className="mb-8">
								<h2 className="text-xl font-bold text-primary mb-2">Adventure in Sundarban</h2>
								<div className="text-sm text-gray-500 mb-4">By Omar | July 15, 2023</div>
								<img className="w-full h-64 object-cover rounded-lg mb-4" alt="" src="Depth 6, Frame 0.png" />
								<p className="mb-4">The Sundarbans, a UNESCO World Heritage Site, is a sprawling mangrove forest shared by India and Bangladesh. Its unique biodiversity, including the famous Royal Bengal Tiger, makes it a haven for nature enthusiasts and adventure seekers alike. This blog narrates my thrilling journey exploring the dense wilderness, spotting rare wildlife, and connecting with the local communities who call this enchanting place home.</p>
								<div className="flex gap-2 mb-4">
									<img className="w-24 h-16 object-cover rounded" alt="" src="Depth 7, Frame 0.png" />
									<img className="w-24 h-16 object-cover rounded" alt="" src="Depth 7, Frame 1.png" />
									<img className="w-24 h-16 object-cover rounded" alt="" src="Depth 7, Frame 2.png" />
								</div>
								<p className="mb-4">My trip began with a boat ride through the winding water channels, surrounded by dense mangrove trees. The serene yet mysterious atmosphere was captivating. I had the chance to witness the incredible biodiversity of the region, from crocodiles basking on the banks to vibrant kingfishers darting through the air. The highlight of the trip was spotting a Royal Bengal Tiger in its natural habitat – a moment of awe and exhilaration.</p>
								<p className="mb-4">Beyond the wildlife, the Sundarbans offered a glimpse into the lives of the local communities. I visited small villages where the locals shared stories of their harmonious yet challenging coexistence with nature. Their resilience and deep connection to the forest were truly inspiring.</p>
								<div className="flex gap-8 mt-6">
									<div className="flex flex-col items-center">
										<img className="w-8 h-8" alt="" src="Depth 6, Frame 0.svg" />
										<b className="text-lg text-primary">120</b>
									</div>
									<div className="flex flex-col items-center">
										<img className="w-8 h-8" alt="" src="Depth 6, Frame 0.svg" />
										<b className="text-lg text-primary">45</b>
									</div>
									<div className="flex flex-col items-center">
										<img className="w-8 h-8" alt="" src="Depth 6, Frame 0.svg" />
										<b className="text-lg text-primary">30</b>
									</div>
								</div>
							</div>

							{/* Footer */}
							<Footer />
						</div>
					</div>
		);
};

export default Blogs;
