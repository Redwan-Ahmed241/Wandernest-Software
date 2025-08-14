import { FunctionComponent, useCallback } from 'react';


const GiftCard:FunctionComponent = () => {
  	
  	const onDepth4FrameClick = useCallback(() => {
    		// Add your code here
  	}, []);
  	
  	return (
    		<div className={styles.giftCard}>
      			<div className={styles.navbar}>
        				<div className={styles.depth3Frame0}>
          					<img className={styles.depth4Frame0} alt="" src="Depth 4, Frame 0.svg" />
          					<div className={styles.depth4Frame1} onClick={onDepth4FrameClick}>
            						<b className={styles.wandernest}>WanderNest</b>
          					</div>
        				</div>
        				<div className={styles.depth3Frame1}>
          					<div className={styles.depth4Frame01}>
            						<div className={styles.depth4Frame1} onClick={onDepth4FrameClick}>
              							<div className={styles.destinations}>Destinations</div>
            						</div>
            						<div className={styles.depth4Frame1} onClick={onDepth4FrameClick}>
              							<div className={styles.destinations}>Hotels</div>
            						</div>
            						<div className={styles.depth4Frame1} onClick={onDepth4FrameClick}>
              							<div className={styles.flights} onClick={onDepth4FrameClick}>Flights</div>
            						</div>
            						<div className={styles.depth4Frame1} onClick={onDepth4FrameClick}>
              							<div className={styles.flights} onClick={onDepth4FrameClick}>Packages</div>
            						</div>
          					</div>
          					<div className={styles.depth4Frame11}>
            						<div className={styles.depth5Frame01} onClick={onDepth4FrameClick}>
              							<div className={styles.depth6Frame0}>
                								<b className={styles.signUp}>Sign up</b>
              							</div>
            						</div>
            						<div className={styles.depth5Frame11} onClick={onDepth4FrameClick}>
              							<div className={styles.depth6Frame0}>
                								<b className={styles.signUp}>Log in</b>
              							</div>
            						</div>
            						<img className={styles.depth5Frame21} alt="" src="Depth 5, Frame 2.svg" />
          					</div>
        				</div>
      			</div>
      			<div className={styles.depth2Frame1}>
        				<div className={styles.depth3Frame01}>
          					<div className={styles.depth4Frame02}>
            						<div className={styles.depth5Frame02}>
              							<div className={styles.depth6Frame02}>
                								<div className={styles.depth7Frame0}>
                  									<div className={styles.depth8Frame0}>
                    										<div className={styles.giftTheJoy}>Gift the Joy of Travel</div>
                  									</div>
                  									<div className={styles.depth8Frame1}>
                    										<div className={styles.giveYourLoved}>Give your loved ones the gift of exploring Bangladesh with WanderNest.</div>
                  									</div>
                								</div>
                								<div className={styles.depth7Frame1}>
                  									<div className={styles.depth8Frame01}>
                    										<div className={styles.depth6Frame0}>
                      											<b className={styles.buyGiftCard}>Buy Gift Card</b>
                    										</div>
                  									</div>
                  									<div className={styles.depth8Frame11}>
                    										<div className={styles.depth6Frame0}>
                      											<b className={styles.buyGiftCard}>Redeem Gift Card</b>
                    										</div>
                  									</div>
                								</div>
              							</div>
            						</div>
          					</div>
          					<div className={styles.depth4Frame12}>
            						<b className={styles.howItWorks}>How It Works</b>
          					</div>
          					<div className={styles.depth4Frame2}>
            						<div className={styles.depth5Frame03}>
              							<div className={styles.depth6Frame03}>
                								<img className={styles.depth7Frame01} alt="" src="Depth 7, Frame 0.svg" />
                								<div className={styles.depth7Frame11}>
                  									<div className={styles.depth8Frame02}>
                    										<b className={styles.chooseAGift}>Choose a Gift Card</b>
                  									</div>
                  									<div className={styles.depth8Frame12}>
                    										<div className={styles.selectACard}>Select a card value and design.</div>
                  									</div>
                								</div>
              							</div>
              							<div className={styles.depth6Frame03}>
                								<img className={styles.depth7Frame01} alt="" src="Depth 7, Frame 0.svg" />
                								<div className={styles.depth7Frame11}>
                  									<div className={styles.depth8Frame02}>
                    										<b className={styles.chooseAGift}>Send to Recipient</b>
                  									</div>
                  									<div className={styles.depth8Frame12}>
                    										<div className={styles.selectACard}>Personalize and send it instantly.</div>
                  									</div>
                								</div>
              							</div>
              							<div className={styles.depth6Frame03}>
                								<img className={styles.depth7Frame01} alt="" src="Depth 7, Frame 0.svg" />
                								<div className={styles.depth7Frame11}>
                  									<div className={styles.depth8Frame02}>
                    										<b className={styles.chooseAGift}>Redeem for Travel</b>
                  									</div>
                  									<div className={styles.depth8Frame12}>
                    										<div className={styles.selectACard}>Use the card for trips on WanderNest.</div>
                  									</div>
                								</div>
              							</div>
            						</div>
          					</div>
          					<div className={styles.depth4Frame12}>
            						<b className={styles.howItWorks}>Why Choose WanderNest Gift Cards?</b>
              							</div>
              							<div className={styles.depth4Frame4}>
                								<div className={styles.depth5Frame04}>
                  									<div className={styles.depth6Frame04}>
                    										<div className={styles.perfectForAny}>Perfect for Any Occasion</div>
                  									</div>
                  									<div className={styles.depth6Frame11}>
                    										<div className={styles.giveYourLoved}>Flexible, easy to use, and redeemable for travel packages, hotels, and more.</div>
                  									</div>
                								</div>
                								<div className={styles.depth5Frame12}>
                  									<div className={styles.depth5Frame03}>
                    										<div className={styles.depth6Frame03}>
                      											<img className={styles.depth7Frame01} alt="" src="Depth 8, Frame 0.svg" />
                      											<div className={styles.depth7Frame11}>
                        												<div className={styles.depth8Frame02}>
                          													<b className={styles.chooseAGift}>Flexible Amounts</b>
                        												</div>
                        												<div className={styles.depth8Frame12}>
                          													<div className={styles.selectACard}>Choose from multiple denominations.</div>
                        												</div>
                      											</div>
                    										</div>
                    										<div className={styles.depth6Frame03}>
                      											<img className={styles.depth7Frame01} alt="" src="Depth 8, Frame 0.svg" />
                      											<div className={styles.depth7Frame11}>
                        												<div className={styles.depth8Frame02}>
                          													<b className={styles.chooseAGift}>No Expiry</b>
                        												</div>
                        												<div className={styles.depth8Frame12}>
                          													<div className={styles.selectACard}>Gift cards never expire.</div>
                        												</div>
                      											</div>
                    										</div>
                    										<div className={styles.depth6Frame03}>
                      											<img className={styles.depth7Frame01} alt="" src="Depth 8, Frame 0.svg" />
                      											<div className={styles.depth7Frame11}>
                        												<div className={styles.depth8Frame02}>
                          													<b className={styles.chooseAGift}>Wide Usage</b>
                        												</div>
                        												<div className={styles.depth8Frame12}>
                          													<div className={styles.selectACard}>Use for hotels, flights, and packages.</div>
                        												</div>
                      											</div>
                    										</div>
                  									</div>
                								</div>
              							</div>
              							</div>
              							<div className={styles.depth3Frame11}>
                								<div className={styles.depth4Frame03} />
              							</div>
              							</div>
              							</div>);
            						};
            						
            						export default GiftCard;
            						