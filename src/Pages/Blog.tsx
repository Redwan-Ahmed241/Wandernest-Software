import { FunctionComponent, useCallback } from 'react';
import Footer from '../Components/Footer';


const Blogs:FunctionComponent = () => {
  	
  	const onDepth5FrameClick = useCallback(() => {
    		// Add your code here
  	}, []);
  	
  	return (
    		<div className="w-full relative h-auto text-left text-lg text-gray-900 font-['Plus_Jakarta_Sans']">
      			<div className="absolute top-0 left-0 bg-white w-full flex flex-col items-start justify-start">
        				<div className="w-full bg-white overflow-hidden flex flex-col items-start justify-start min-h-[800px]">
          					<div className="w-full flex flex-col items-start justify-start">
            						<div className="w-full border-b border-gray-300 flex flex-row items-center justify-between py-3 px-10 gap-0">
              							<div className="flex flex-row items-center justify-start gap-8">
                								<div className="flex flex-row items-center justify-start gap-4">
                  									<img className="w-4 h-4" alt="" src="Depth 5, Frame 0.svg" />
                  									<div className="flex flex-col items-start justify-start">
                    										<b className="text-lg leading-6">WanderNest</b>
                  									</div>
                								</div>
                								<div className="flex flex-row items-center justify-start gap-9">
                  									<div className="flex flex-col items-start justify-start cursor-pointer" onClick={onDepth5FrameClick}>
                    										<div className="text-sm leading-5 font-medium">Groups</div>
                  									</div>
                  									<div className="flex flex-col items-start justify-start cursor-pointer" onClick={onDepth5FrameClick}>
                    										<div className="text-sm leading-5 font-medium">Blog</div>
                  									</div>
                  									<div className="flex flex-col items-start justify-start cursor-pointer" onClick={onDepth5FrameClick}>
                    										<div className="text-sm leading-5 font-medium">Contact</div>
                  									</div>
                								</div>
              							</div>
              							<div className="flex-1 flex flex-row items-start justify-end gap-8 text-base text-amber-700">
                								<div className="flex flex-col items-start justify-start min-w-40 max-w-64">
                  									<div className="w-full flex-1 rounded-xl flex flex-row items-start justify-start">
                    										<img className="w-10 rounded-l-xl max-h-full" alt="" src="Depth 6, Frame 0.svg" />
                    										<div className="flex-1 rounded-r-xl bg-orange-50 overflow-hidden flex flex-row items-center justify-start py-2 px-4 pl-2">
                      											<div className="relative leading-6">Search</div>
                    										</div>
                  									</div>
                								</div>
                								<div className="flex flex-row items-start justify-start text-center text-sm text-white">
                  									<div className="w-21 rounded-2xl bg-green-600 h-10 overflow-hidden flex-shrink-0 flex flex-row items-center justify-center px-4 box-border min-w-21 max-w-[480px]">
                    										<div className="overflow-hidden flex flex-col items-center justify-start">
                      											<b className="text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap">Sign In</b>
                    										</div>
                  									</div>
                								</div>
              							</div>
            						</div>
            						<div className="w-full flex-1 flex flex-row items-start justify-center py-5 px-40 box-border text-base">
              							<div className="flex-1 overflow-hidden flex flex-col items-start justify-start max-w-4xl">
                								<div className="w-full flex flex-row items-start justify-between flex-wrap content-start p-4 text-4xl">
                  									<div className="flex flex-col items-start justify-start gap-3 min-w-72">
                    										<div className="flex flex-col items-start justify-start">
                      											<div className="w-full relative tracking-tight leading-11 font-extrabold">Adventure in Sundarban</div>
                    										</div>
                    										<div className="w-full flex flex-col items-start justify-start text-base text-amber-700">
                      											<div className="w-full relative leading-6">By Omar | July 15, 2023</div>
                    										</div>
                  									</div>
                								</div>
                								<div className="w-full flex flex-col items-start justify-start">
                  									<div className="w-full flex-1 flex flex-col items-start justify-start p-3">
                    										<img className="w-full relative rounded-xl max-w-full overflow-hidden h-80 flex-shrink-0 object-cover min-h-80" alt="" src="Depth 6, Frame 0.png" />
                  									</div>
                								</div>
                								<div className="w-full flex flex-col items-start justify-start py-1 px-4 box-border">
                  									<div className="w-full relative leading-6">The Sundarbans, a UNESCO World Heritage Site, is a sprawling mangrove forest shared by India and Bangladesh. Its unique biodiversity, including the famous Royal Bengal Tiger, makes it a haven for nature enthusiasts and adventure seekers alike. This blog narrates my thrilling journey exploring the dense wilderness, spotting rare wildlife, and connecting with the local communities who call this enchanting place home.</div>
                								</div>
                								<div className="w-full bg-white flex flex-row items-start justify-start p-4">
                  									<div className="w-full rounded-xl bg-white h-auto overflow-hidden flex-shrink-0 flex flex-col items-start justify-start">
                    										<div className="w-full flex-1 flex flex-row items-start justify-start gap-2">
                      											<img className="w-full relative rounded-xl max-w-full overflow-hidden h-auto flex-shrink-0 object-cover" alt="" src="Depth 7, Frame 0.png" />
                      											<img className="w-full relative rounded-xl max-w-full overflow-hidden h-auto flex-shrink-0 object-cover" alt="" src="Depth 7, Frame 1.png" />
                      											<img className="w-full relative rounded-xl max-w-full overflow-hidden h-auto flex-shrink-0 object-cover" alt="" src="Depth 7, Frame 2.png" />
                    										</div>
                  									</div>
                								</div>
                								<div className="w-full flex flex-col items-start justify-start py-1 px-4 box-border">
                  									<div className="w-full relative leading-6">My trip began with a boat ride through the winding water channels, surrounded by dense mangrove trees. The serene yet mysterious atmosphere was captivating. I had the chance to witness the incredible biodiversity of the region, from crocodiles basking on the banks to vibrant kingfishers darting through the air. The highlight of the trip was spotting a Royal Bengal Tiger in its natural habitat – a moment of awe and exhilaration.</div>
                								</div>
                								<div className="w-full flex flex-col items-start justify-start py-1 px-4 box-border">
                  									<div className="w-full relative leading-6">Beyond the wildlife, the Sundarbans offered a glimpse into the lives of the local communities. I visited small villages where the locals shared stories of their harmonious yet challenging coexistence with nature. Their resilience and deep connection to the forest were truly inspiring.</div>
                								</div>
                								<div className="w-full flex flex-row items-start justify-between flex-wrap content-start py-2 px-4 gap-4 text-sm text-amber-700">
                  									<div className="flex flex-row items-center justify-center py-2 px-3 gap-2">
                    										<img className="w-6 h-6" alt="" src="Depth 6, Frame 0.svg" />
                    										<div className="w-full relative leading-5">
                      											<b>120</b>
                    										</div>
                  									</div>
                  									<div className="flex flex-row items-center justify-center py-2 px-3 gap-2">
                    										<img className="w-6 h-6" alt="" src="Depth 6, Frame 0.svg" />
                    										<div className="w-full relative leading-5">
                      											<b>45</b>
                    										</div>
                  									</div>
                  									<div className="flex flex-row items-center justify-center py-2 px-3 gap-2">
                    										<img className="w-6 h-6" alt="" src="Depth 6, Frame 0.svg" />
                    										<div className="w-full relative leading-5">
                      											<b>30</b>
                    										</div>
                  									</div>
                								</div>
              							</div>
              							<div className={styles.depth3Frame11}>
                								<div className={styles.depth4Frame03} />
              							</div>
            						</div>
          					</div>
        				</div>
      			</div>
      			{/* <div className={styles.footer}>
        				<div className={styles.depth3Frame02}>
          					<div className={styles.depth4Frame04}>
            						<div className={styles.depth5Frame07}>
              							<div className={styles.depth6Frame08} onClick={onDepth5FrameClick}>
                								<div className={styles.byOmar}>About Us</div>
              							</div>
              							<div className={styles.depth6Frame15}>
                								<div className={styles.byOmar}>Contact</div>
              							</div>
              							<div className={styles.depth6Frame08} onClick={onDepth5FrameClick}>
                								<div className={styles.byOmar}>Terms of Service</div>
              							</div>
              							<div className={styles.depth6Frame08} onClick={onDepth5FrameClick}>
                								<div className={styles.byOmar}>Privacy Policy</div>
              							</div>
            						</div>
            						<div className={styles.depth5Frame13}>
              							<img className={styles.depth6Frame05} alt="" src="Depth 6, Frame 0.svg" />
              							<img className={styles.depth6Frame05} alt="" src="Depth 6, Frame 1.svg" />
              							<img className={styles.depth6Frame05} alt="" src="Depth 6, Frame 2.svg" />
            						</div>
            						<div className={styles.depth5Frame22}>
              							<div className={styles.byOmar}>@2025 WanderNest, All rights reserved.</div>
            						</div>
          					</div>
        				</div>
      			</div> */}
	  			<Footer></Footer>
    		</div>
		);
};

export default Blogs;
