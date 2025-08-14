import { FunctionComponent, useCallback } from 'react';
import styles from '../Styles/Blog.module.css';
import Footer from '../Components/Footer';


const Blogs:FunctionComponent = () => {
  	
  	const onDepth5FrameClick = useCallback(() => {
    		// Add your code here
  	}, []);
  	
  	return (
    		<div className={styles.blogs}>
      			<div className={styles.blog}>
        				<div className={styles.depth0Frame0}>
          					<div className={styles.depth1Frame0}>
            						<div className={styles.depth2Frame0}>
              							<div className={styles.depth3Frame0}>
                								<div className={styles.depth4Frame0}>
                  									<img className={styles.depth5Frame0} alt="" src="Depth 5, Frame 0.svg" />
                  									<div className={styles.depth5Frame1}>
                    										<b className={styles.wandernest}>WanderNest</b>
                  									</div>
                								</div>
                								<div className={styles.depth4Frame1}>
                  									<div className={styles.depth5Frame11} onClick={onDepth5FrameClick}>
                    										<div className={styles.groups}>Groups</div>
                  									</div>
                  									<div className={styles.depth5Frame11} onClick={onDepth5FrameClick}>
                    										<div className={styles.groups}>Blog</div>
                  									</div>
                  									<div className={styles.depth5Frame11} onClick={onDepth5FrameClick}>
                    										<div className={styles.groups}>Contact</div>
                  									</div>
                								</div>
              							</div>
              							<div className={styles.depth3Frame1}>
                								<div className={styles.depth4Frame01}>
                  									<div className={styles.depth5Frame01}>
                    										<img className={styles.depth6Frame0} alt="" src="Depth 6, Frame 0.svg" />
                    										<div className={styles.depth6Frame1}>
                      											<div className={styles.search}>Search</div>
                    										</div>
                  									</div>
                								</div>
                								<div className={styles.depth4Frame11}>
                  									<div className={styles.depth5Frame02}>
                    										<div className={styles.depth6Frame01}>
                      											<b className={styles.signIn}>Sign In</b>
                    										</div>
                  									</div>
                								</div>
              							</div>
            						</div>
            						<div className={styles.depth2Frame1}>
              							<div className={styles.depth3Frame01}>
                								<div className={styles.depth4Frame02}>
                  									<div className={styles.depth5Frame03}>
                    										<div className={styles.depth5Frame1}>
                      											<div className={styles.adventureInSundarban}>Adventure in Sundarban</div>
                    										</div>
                    										<div className={styles.depth6Frame11}>
                      											<div className={styles.byOmar}>By Omar | July 15, 2023</div>
                    										</div>
                  									</div>
                								</div>
                								<div className={styles.depth1Frame0}>
                  									<div className={styles.depth5Frame04}>
                    										<img className={styles.depth6Frame03} alt="" src="Depth 6, Frame 0.png" />
                  									</div>
                								</div>
                								<div className={styles.depth4Frame2}>
                  									<div className={styles.byOmar}>The Sundarbans, a UNESCO World Heritage Site, is a sprawling mangrove forest shared by India and Bangladesh. Its unique biodiversity, including the famous Royal Bengal Tiger, makes it a haven for nature enthusiasts and adventure seekers alike. This blog narrates my thrilling journey exploring the dense wilderness, spotting rare wildlife, and connecting with the local communities who call this enchanting place home.</div>
                								</div>
                								<div className={styles.depth4Frame3}>
                  									<div className={styles.depth5Frame05}>
                    										<div className={styles.depth6Frame04}>
                      											<img className={styles.depth7Frame0} alt="" src="Depth 7, Frame 0.png" />
                      											<img className={styles.depth7Frame1} alt="" src="Depth 7, Frame 1.png" />
                      											<img className={styles.depth7Frame1} alt="" src="Depth 7, Frame 2.png" />
                    										</div>
                  									</div>
                								</div>
                								<div className={styles.depth4Frame2}>
                  									<div className={styles.byOmar}>My trip began with a boat ride through the winding water channels, surrounded by dense mangrove trees. The serene yet mysterious atmosphere was captivating. I had the chance to witness the incredible biodiversity of the region, from crocodiles basking on the banks to vibrant kingfishers darting through the air. The highlight of the trip was spotting a Royal Bengal Tiger in its natural habitat – a moment of awe and exhilaration.</div>
                								</div>
                								<div className={styles.depth4Frame2}>
                  									<div className={styles.byOmar}>Beyond the wildlife, the Sundarbans offered a glimpse into the lives of the local communities. I visited small villages where the locals shared stories of their harmonious yet challenging coexistence with nature. Their resilience and deep connection to the forest were truly inspiring.</div>
                								</div>
                								<div className={styles.depth4Frame6}>
                  									<div className={styles.depth5Frame06}>
                    										<img className={styles.depth6Frame05} alt="" src="Depth 6, Frame 0.svg" />
                    										<div className={styles.depth5Frame1}>
                      											<b className={styles.b}>120</b>
                    										</div>
                  									</div>
                  									<div className={styles.depth5Frame06}>
                    										<img className={styles.depth6Frame05} alt="" src="Depth 6, Frame 0.svg" />
                    										<div className={styles.depth5Frame1}>
                      											<b className={styles.b}>45</b>
                    										</div>
                  									</div>
                  									<div className={styles.depth5Frame06}>
                    										<img className={styles.depth6Frame05} alt="" src="Depth 6, Frame 0.svg" />
                    										<div className={styles.depth5Frame1}>
                      											<b className={styles.b}>30</b>
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
