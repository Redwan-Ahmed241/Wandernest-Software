import { FunctionComponent, useCallback } from 'react';


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
											return (
												<div className="min-h-screen bg-white flex flex-col items-center py-8 px-2 md:px-8">
													{/* Navbar */}
													<nav className="w-full flex flex-row justify-between items-center mb-8">
														<div className="flex flex-row items-center gap-2">
															<img className="h-10 w-10" alt="" src="Depth 4, Frame 0.svg" />
															<button onClick={onDepth4FrameClick} className="text-xl font-bold text-blue-700">WanderNest</button>
														</div>
														<div className="flex flex-row gap-6 items-center">
															<button onClick={onDepth4FrameClick} className="text-base text-gray-700 hover:text-blue-600">Destinations</button>
															<button onClick={onDepth4FrameClick} className="text-base text-gray-700 hover:text-blue-600">Hotels</button>
															<button onClick={onDepth4FrameClick} className="text-base text-gray-700 hover:text-blue-600">Flights</button>
															<button onClick={onDepth4FrameClick} className="text-base text-gray-700 hover:text-blue-600">Packages</button>
															<button onClick={onDepth4FrameClick} className="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700">Sign up</button>
															<button onClick={onDepth4FrameClick} className="px-4 py-1 rounded bg-gray-200 text-blue-700 font-semibold hover:bg-gray-300">Log in</button>
															<img className="h-8 w-8" alt="" src="Depth 5, Frame 2.svg" />
														</div>
													</nav>
													{/* Main Content */}
													<main className="w-full max-w-3xl flex flex-col gap-8">
														<section className="bg-blue-50 rounded-lg shadow p-6 flex flex-col items-center">
															<h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2">Trust & Safety</h1>
															<p className="text-gray-700 text-center mb-4">Your safety is our priority.</p>
															<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
																<div className="flex flex-col gap-2">
																	<b className="text-lg text-blue-700">Community Guidelines</b>
																	<b className="text-lg text-blue-700">User Verification</b>
																	<b className="text-lg text-blue-700">Content Moderation</b>
																	<b className="text-lg text-blue-700">Emergency Support</b>
																</div>
																<div className="flex flex-col gap-2">
																	<b className="text-lg text-blue-700">Frequently Asked Questions</b>
																	<div className="flex items-center gap-2">
																		<span className="text-gray-700">What are the Community Guidelines?</span>
																		<img className="h-6 w-6" alt="" src="Depth 7, Frame 1.svg" />
																	</div>
																</div>
															</div>
														</section>
													</main>
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
                                                																								