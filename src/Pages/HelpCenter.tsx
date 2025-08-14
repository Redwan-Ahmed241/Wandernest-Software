import { FunctionComponent, useCallback } from 'react';
import styles from '../Styles/HelpCenter.module.css';


const HelpCenter:FunctionComponent = () => {
  	
  	const onDepth4FrameClick = useCallback(() => {
    		// Add your code here
  	}, []);
  	
  	return (
    		<div className={styles.helpCenter}>
      			<div className={styles.helpCenter1}>
        				<div className={styles.depth0Frame0}>
          					<div className={styles.depth1Frame0}>
            						<div className={styles.depth2Frame0}>
              							<div className={styles.depth3Frame0}>
                								<div className={styles.depth4Frame0}>
                  									<img className={styles.depth4Frame01} alt="" src="Depth 4, Frame 0.svg" />
                  									<div className={styles.depth4Frame1} onClick={onDepth4FrameClick}>
                    										<b className={styles.wandernest}>WanderNest</b>
                  									</div>
                								</div>
                								<div className={styles.depth4Frame11}>
                  									<div className={styles.depth5Frame0}>
                    										<div className={styles.home}>Home</div>
                  									</div>
                  									<div className={styles.depth5Frame0}>
                    										<div className={styles.home}>Contact Us</div>
                  									</div>
                								</div>
              							</div>
              							<div className={styles.depth3Frame1}>
                								<div className={styles.depth4Frame02}>
                  									<div className={styles.depth5Frame01}>
                    										<img className={styles.depth6Frame0} alt="" src="Depth 6, Frame 0.svg" />
                    										<div className={styles.depth6Frame1}>
                      											<div className={styles.search}>Search</div>
                    										</div>
                  									</div>
                								</div>
                								<img className={styles.depth4Frame12} alt="" src="Depth 4, Frame 1.png" />
              							</div>
            						</div>
            						<div className={styles.depth2Frame1}>
              							<div className={styles.depth3Frame01}>
                								<div className={styles.depth4Frame03}>
                  									<div className={styles.depth5Frame02}>
                    										<div className={styles.depth5Frame01}>
                      											<img className={styles.depth6Frame0} alt="" src="Depth 7, Frame 0.svg" />
                      											<div className={styles.depth6Frame1}>
                        												<div className={styles.searchForHelp}>Search  for help or topics...</div>
                      											</div>
                    										</div>
                  									</div>
                								</div>
                								<div className={styles.depth4Frame13}>
                  									<div className={styles.depth5Frame03}>
                    										<div className={styles.depth5Frame0}>
                      											<b className={styles.emergencyContacts}>Emergency Contacts</b>
                    										</div>
                    										<div className={styles.depth6Frame11}>
                      											<div className={styles.reachOutTo}>Reach out to the right team for assistance.</div>
                    										</div>
                  									</div>
                								</div>
                								<div className={styles.depth4Frame2}>
                  									<div className={styles.depth5Frame04}>
                    										<div className={styles.depth6Frame03}>
                      											<div className={styles.depth7Frame01}>
                        												<div className={styles.depth8Frame0}>
                          													<div className={styles.reachOutTo}>Technical Support</div>
                        												</div>
                      											</div>
                      											<div className={styles.depth7Frame11}>
                        												<div className={styles.depth8Frame0}>
                          													<div className={styles.reachOutTo}>Call: +123 456 7890</div>
                        												</div>
                      											</div>
                    										</div>
                    										<div className={styles.depth6Frame12}>
                      											<div className={styles.depth7Frame01}>
                        												<div className={styles.depth8Frame02}>
                          													<div className={styles.reachOutTo}>Medical Assistance</div>
                        												</div>
                      											</div>
                      											<div className={styles.depth7Frame11}>
                        												<div className={styles.depth8Frame02}>
                          													<div className={styles.reachOutTo}>Call: +987 654 3210</div>
                        												</div>
                      											</div>
                    										</div>
                  									</div>
                  									<div className={styles.depth5Frame04}>
                    										<div className={styles.depth6Frame03}>
                      											<div className={styles.depth7Frame03}>
                        												<div className={styles.depth8Frame04}>
                          													<div className={styles.reachOutTo}>Customer Service</div>
                        												</div>
                      											</div>
                      											<div className={styles.depth7Frame13}>
                        												<div className={styles.depth8Frame04}>
                          													<div className={styles.reachOutTo}>Chat: support@example.com</div>
                        												</div>
                      											</div>
                    										</div>
                    										<div className={styles.depth6Frame12}>
                      											<div className={styles.depth7Frame01}>
                        												<div className={styles.depth8Frame02}>
                          													<div className={styles.reachOutTo}>IT Helpdesk</div>
                        												</div>
                      											</div>
                      											<div className={styles.depth7Frame11}>
                        												<div className={styles.depth8Frame02}>
                          													<div className={styles.reachOutTo}>Call: +555 678 1234</div>
                        												</div>
                      											</div>
                    										</div>
                  									</div>
                								</div>
                								<div className={styles.depth4Frame3}>
                  									<b className={styles.frequentlyAskedQuestions}>Frequently Asked Questions</b>
                								</div>
                								<div className={styles.depth4Frame4}>
                  									<div className={styles.depth4Frame0}>
                    										<img className={styles.depth6Frame05} alt="" src="Depth 6, Frame 0.svg" />
                    										<div className={styles.depth6Frame14}>
                      											<div className={styles.depth7Frame05}>
                        												<div className={styles.howToReset}>How to reset my password?</div>
                          													</div>
                          													<div className={styles.depth7Frame15}>
                            														<div className={styles.reachOutTo}>Find out how to securely reset your password.</div>
                          													</div>
                          													</div>
                          													</div>
                          													<img className={styles.depth5Frame11} alt="" src="Depth 5, Frame 1.svg" />
                          													</div>
                          													<div className={styles.depth4Frame5} onClick={onDepth4FrameClick}>
                            														<div className={styles.depth4Frame0}>
                              															<img className={styles.depth6Frame05} alt="" src="Depth 6, Frame 0.svg" />
                              															<div className={styles.depth6Frame14}>
                                																<div className={styles.depth7Frame06}>
                                  																	<div className={styles.howToReset}>How to contact support?</div>
                                    																		</div>
                                    																		<div className={styles.depth7Frame15}>
                                      																			<div className={styles.reachOutTo}>Learn about different ways to reach us.</div>
                                    																		</div>
                                    																		</div>
                                    																		</div>
                                    																		<img className={styles.depth5Frame11} alt="" src="Depth 5, Frame 1.svg" />
                                    																		</div>
                                    																		<div className={styles.depth4Frame4}>
                                      																			<div className={styles.depth4Frame0}>
                                        																				<img className={styles.depth6Frame05} alt="" src="Depth 6, Frame 0.svg" />
                                        																				<div className={styles.depth6Frame14}>
                                          																					<div className={styles.depth7Frame07}>
                                            																						<div className={styles.howToReset}>What to do in case of emergency?</div>
                                              																							</div>
                                              																							<div className={styles.depth7Frame17}>
                                                																								<div className={styles.reachOutTo}>Steps to take during urgent situations.</div>
                                              																							</div>
                                              																							</div>
                                              																							</div>
                                              																							<img className={styles.depth5Frame11} alt="" src="Depth 5, Frame 1.svg" />
                                              																							</div>
                                              																							</div>
                                              																							</div>
                                              																							</div>
                                              																							</div>
                                              																							</div>
                                              																							<div className={styles.footer}>
                                                																								<div className={styles.depth3Frame02}>
                                                  																									<div className={styles.depth4Frame04}>
                                                    																										<div className={styles.depth5Frame08}>
                                                      																											<div className={styles.depth6Frame08} onClick={onDepth4FrameClick}>
                                                        																												<div className={styles.aboutUs}>About Us</div>
                                                      																											</div>
                                                      																											<div className={styles.depth6Frame17}>
                                                        																												<div className={styles.aboutUs}>Contact</div>
                                                      																											</div>
                                                      																											<div className={styles.depth6Frame08} onClick={onDepth4FrameClick}>
                                                        																												<div className={styles.aboutUs}>Terms of Service</div>
                                                      																											</div>
                                                      																											<div className={styles.depth6Frame08} onClick={onDepth4FrameClick}>
                                                        																												<div className={styles.aboutUs}>Privacy Policy</div>
                                                      																											</div>
                                                    																										</div>
                                                    																										<div className={styles.depth5Frame14}>
                                                      																											<img className={styles.depth6Frame09} alt="" src="Depth 6, Frame 0.svg" />
                                                      																											<img className={styles.depth6Frame09} alt="" src="Depth 6, Frame 1.svg" />
                                                      																											<img className={styles.depth6Frame09} alt="" src="Depth 6, Frame 2.svg" />
                                                    																										</div>
                                                    																										<div className={styles.depth5Frame21}>
                                                      																											<div className={styles.aboutUs}>@2025 WanderNest, All rights reserved.</div>
                                                    																										</div>
                                                  																									</div>
                                                																								</div>
                                              																							</div>
                                              																							</div>);
                                            																						};
                                            																						
                                            																						export default HelpCenter;
                                            																						