import { FunctionComponent, useCallback } from 'react';
import styles from '../Styles/TrustSafety.module.css';


const TrustSafety:FunctionComponent = () => {
  	
  	const onDepth4FrameClick = useCallback(() => {
    		// Add your code here
  	}, []);
  	
  	return (
    		<div className={styles.trustSafety}>
      			<div className={styles.trustSafety1}>
        				<div className={styles.depth0Frame0}>
          					<div className={styles.depth1Frame0}>
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
                  									<div className={styles.depth5Frame2}>
                    										<div className={styles.flights} onClick={onDepth4FrameClick}>Flights</div>
                  									</div>
                  									<div className={styles.depth4Frame1} onClick={onDepth4FrameClick}>
                    										<div className={styles.destinations}>Packages</div>
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
                      											<div className={styles.trustSafety2}>{`Trust & Safety`}</div>
                    										</div>
                    										<div className={styles.depth6Frame1}>
                      											<div className={styles.yourSafetyIs}>Your safety is our priority.</div>
                    										</div>
                  									</div>
                								</div>
                								<div className={styles.depth4Frame12}>
                  									<div className={styles.depth5Frame03}>
                    										<div className={styles.depth6Frame03}>
                      											<div className={styles.depth7Frame0}>
                        												<b className={styles.communityGuidelines}>Community Guidelines</b>
                      											</div>
                    										</div>
                    										<div className={styles.depth6Frame11}>
                      											<div className={styles.depth7Frame01}>
                        												<b className={styles.communityGuidelines}>User Verification</b>
                      											</div>
                    										</div>
                    										<div className={styles.depth6Frame2}>
                      											<div className={styles.depth7Frame02}>
                        												<b className={styles.communityGuidelines}>Content Moderation</b>
                      											</div>
                    										</div>
                    										<div className={styles.depth6Frame3}>
                      											<div className={styles.depth7Frame03}>
                        												<b className={styles.communityGuidelines}>Emergency Support</b>
                      											</div>
                    										</div>
                  									</div>
                								</div>
                								<div className={styles.depth4Frame2}>
                  									<b className={styles.frequentlyAskedQuestions}>Frequently Asked Questions</b>
                								</div>
                								<div className={styles.depth4Frame3}>
                  									<div className={styles.depth5Frame04}>
                    										<div className={styles.depth6Frame04}>
                      											<div className={styles.depth5Frame2}>
                        												<div className={styles.destinations}>What are the Community Guidelines?</div>
                          													</div>
                          													<img className={styles.depth7Frame1} alt="" src="Depth 7, Frame 1.svg" />
                          													</div>
                          													<div className={styles.depth6Frame12}>
                            														<div className={styles.ourCommunityGuidelines}>Our Community Guidelines outline the rules and standards to ensure a safe and respectful environment.</div>
                          													</div>
                          													</div>
                          													<div className={styles.depth5Frame04}>
                            														<div className={styles.depth6Frame04}>
                              															<div className={styles.depth5Frame2}>
                                																<div className={styles.destinations}>How do I verify my account?</div>
                                  																	</div>
                                  																	<img className={styles.depth7Frame1} alt="" src="Depth 7, Frame 1.svg" />
                                  																	</div>
                                  																	</div>
                                  																	<div className={styles.depth5Frame04}>
                                    																		<div className={styles.depth6Frame04}>
                                      																			<div className={styles.depth5Frame2}>
                                        																				<div className={styles.destinations}>What happens when content is flagged?</div>
                                          																					</div>
                                          																					<img className={styles.depth7Frame1} alt="" src="Depth 7, Frame 1.svg" />
                                          																					</div>
                                          																					</div>
                                          																					<div className={styles.depth5Frame04}>
                                            																						<div className={styles.depth6Frame04}>
                                              																							<div className={styles.depth5Frame2}>
                                                																								<div className={styles.destinations}>How to contact emergency support?</div>
                                                  																									</div>
                                                  																									<img className={styles.depth7Frame1} alt="" src="Depth 7, Frame 1.svg" />
                                                  																									</div>
                                                  																									</div>
                                                  																									</div>
                                                  																									<div className={styles.depth4Frame4}>
                                                    																										<div className={styles.depth5Frame05}>
                                                      																											<div className={styles.depth1Frame0}>
                                                        																												<div className={styles.depth1Frame0}>
                                                          																													<div className={styles.quickLinks}>Quick Links</div>
                                                        																												</div>
                                                        																												<div className={styles.depth7Frame14}>
                                                          																													<div className={styles.ourCommunityGuidelines}>Access support and resources.</div>
                                                        																												</div>
                                                      																											</div>
                                                      																											<div className={styles.depth6Frame13}>
                                                        																												<div className={styles.depth7Frame09}>
                                                          																													<img className={styles.depth8Frame0} alt="" src="Depth 8, Frame 0.svg" />
                                                          																													<div className={styles.depth5Frame2}>
                                                            																														<div className={styles.destinations}>Emergency Contacts</div>
                                                          																													</div>
                                                        																												</div>
                                                        																												<div className={styles.depth7Frame15}>
                                                          																													<img className={styles.depth8Frame0} alt="" src="Depth 8, Frame 0.svg" />
                                                          																													<div className={styles.depth5Frame2}>
                                                            																														<div className={styles.destinations}>Help Center</div>
                                                          																													</div>
                                                        																												</div>
                                                        																												<div className={styles.depth7Frame15}>
                                                          																													<img className={styles.depth8Frame0} alt="" src="Depth 8, Frame 0.svg" />
                                                          																													<div className={styles.depth5Frame2}>
                                                            																														<div className={styles.destinations}>Terms of Service</div>
                                                          																													</div>
                                                        																												</div>
                                                        																												<div className={styles.depth7Frame15}>
                                                          																													<img className={styles.depth8Frame0} alt="" src="Depth 8, Frame 0.svg" />
                                                          																													<div className={styles.depth5Frame2}>
                                                            																														<div className={styles.destinations}>Privacy Policy</div>
                                                          																													</div>
                                                        																												</div>
                                                      																											</div>
                                                    																										</div>
                                                  																									</div>
                                                  																									</div>
                                                  																									</div>
                                                  																									</div>
                                                  																									</div>
                                                  																									</div>
                                                  																									<div className={styles.footer}>
                                                    																										<div className={styles.depth3Frame02}>
                                                      																											<div className={styles.depth4Frame03}>
                                                        																												<div className={styles.depth5Frame06}>
                                                          																													<div className={styles.depth6Frame09} onClick={onDepth4FrameClick}>
                                                            																														<div className={styles.yourSafetyIs}>About Us</div>
                                                          																													</div>
                                                          																													<div className={styles.depth6Frame14}>
                                                            																														<div className={styles.yourSafetyIs}>Contact</div>
                                                          																													</div>
                                                          																													<div className={styles.depth6Frame09} onClick={onDepth4FrameClick}>
                                                            																														<div className={styles.yourSafetyIs}>Terms of Service</div>
                                                          																													</div>
                                                          																													<div className={styles.depth6Frame09} onClick={onDepth4FrameClick}>
                                                            																														<div className={styles.yourSafetyIs}>Privacy Policy</div>
                                                          																													</div>
                                                        																												</div>
                                                        																												<div className={styles.depth5Frame13}>
                                                          																													<img className={styles.depth8Frame0} alt="" src="Depth 6, Frame 0.svg" />
                                                          																													<img className={styles.depth8Frame0} alt="" src="Depth 6, Frame 1.svg" />
                                                          																													<img className={styles.depth8Frame0} alt="" src="Depth 6, Frame 2.svg" />
                                                        																												</div>
                                                        																												<div className={styles.depth5Frame23}>
                                                          																													<div className={styles.yourSafetyIs}>@2025 WanderNest, All rights reserved.</div>
                                                        																												</div>
                                                      																											</div>
                                                    																										</div>
                                                  																									</div>
                                                  																									</div>);
                                                																								};
                                                																								
                                                																								export default TrustSafety;
                                                																								