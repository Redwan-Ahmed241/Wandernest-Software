import { FunctionComponent, useCallback } from 'react';
import styles from '../Styles/support.module.css';

const Support: FunctionComponent = () => {
  const onDepth7FrameClick = useCallback(() => {
    // Add your code here
  }, []);

  return (
    <div className={styles.support}>
      <div className={styles.aboutcontactWrapper}>
        <div className={styles.aboutcontact}>
          <div className={styles.depth0Frame0}>
            <div className={styles.depth1Frame0}>
              <div className={styles.depth2Frame0}>
                <div className={styles.depth3Frame0}>
                  <div className={styles.depth4Frame0}>
                    <div className={styles.depth1Frame0}>
                      <div className={styles.depth6Frame0}>
                        <div className={styles.depth7Frame0}>
                          <div className={styles.depth8Frame0}>
                            <div className={styles.about}>About</div>
                          </div>
                        </div>
                        <div className={styles.depth7Frame0}>
                          <div className={styles.depth8Frame0}>
                            <div className={styles.about}>Help Center</div>
                          </div>
                        </div>
                        <div className={styles.depth7Frame0}>
                          <div className={styles.depth8Frame0}>
                            <div className={styles.about}>Community</div>
                          </div>
                        </div>
                        <div className={styles.depth7Frame4} onClick={onDepth7FrameClick}>
                          <div className={styles.depth8Frame0}>
                            <div className={styles.about}>{`Trust & Safety`}</div>
                          </div>
                        </div>
                        <div className={styles.depth7Frame5}>
                          <div className={styles.depth8Frame0}>
                            <div className={styles.about}>Support</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.depth5Frame1} onClick={onDepth7FrameClick}>
                      <div className={styles.depth6Frame01}>
                        <b className={styles.visitHelpCenter}>Visit help center</b>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.depth3Frame1}>
                  <div className={styles.depth4Frame01}>
                    <div className={styles.depth5Frame01}>
                      <b className={styles.support2}>Support</b>
                    </div>
                  </div>
                  <div className={styles.depth4Frame1}>
                    <div className={styles.depth5Frame02}>
                      <div className={styles.depth6Frame02}>
                        <img className={styles.depth7Frame01} alt="" src="Depth 7, Frame 0.svg" />
                        <div className={styles.depth7Frame11}>
                          <div className={styles.searchForAnswers}>Search for answers...</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.depth4Frame2}>
                    <div className={styles.depth5Frame03}>
                      <div className={styles.depth6Frame03}>
                        <div className={styles.covid19}>Covid-19</div>
                      </div>
                    </div>
                    <div className={styles.depth5Frame03}>
                      <div className={styles.depth6Frame03}>
                        <div className={styles.about}>Cancellation options</div>
                      </div>
                    </div>
                    <div className={styles.depth5Frame03}>
                      <div className={styles.depth6Frame03}>
                        <div className={styles.about}>Security deposit</div>
                      </div>
                    </div>
                    <div className={styles.depth5Frame03}>
                      <div className={styles.depth6Frame03}>
                        <div className={styles.about}>Payment options</div>
                      </div>
                    </div>
                    <div className={styles.depth5Frame03}>
                      <div className={styles.depth6Frame03}>
                        <div className={styles.about}>Accessibility</div>
                      </div>
                    </div>
                    <div className={styles.depth5Frame03}>
                      <div className={styles.depth6Frame03}>
                        <div className={styles.about}>More topics</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.depth4Frame3}>
                    <b className={styles.mostPopular}>Most popular</b>
                  </div>
                  <div className={styles.depth4Frame4}>
                    <div className={styles.depth5Frame04}>
                      <div className={styles.depth6Frame09}>
                        <div className={styles.whatIsAirbnbs}>What is Airbnb's enhanced cleaning protocol?</div>
                      </div>
                      <div className={styles.depth6Frame1}>
                        <div className={styles.findOutMore}>Find out more about our new cleaning protocol</div>
                      </div>
                    </div>
                    <img className={styles.depth5Frame12} alt="" src="Depth 5, Frame 1.svg" />
                  </div>
                  <div className={styles.depth4Frame4}>
                    <div className={styles.depth5Frame04}>
                      <div className={styles.depth6Frame09}>
                        <div className={styles.whatIsAirbnbs}>How do I cancel a reservation?</div>
                      </div>
                      <div className={styles.depth6Frame11}>
                        <div className={styles.findOutMore}>Learn how to cancel a reservation</div>
                      </div>
                    </div>
                    <img className={styles.depth5Frame12} alt="" src="Depth 5, Frame 1.svg" />
                  </div>
                  <div className={styles.depth4Frame4}>
                    <div className={styles.depth5Frame04}>
                      <div className={styles.depth6Frame09}>
                        <div className={styles.whatIsAirbnbs}>What is a security deposit and how does it work?</div>
                      </div>
                      <div className={styles.depth6Frame12}>
                        <div className={styles.findOutMore}>Read about the benefits of the security deposit</div>
                      </div>
                    </div>
                    <img className={styles.depth5Frame12} alt="" src="Depth 5, Frame 1.svg" />
                  </div>
                  <div className={styles.depth4Frame3}>
                    <b className={styles.mostPopular}>Get help from our community</b>
                  </div>
                  <div className={styles.depth4Frame4}>
                    <div className={styles.depth5Frame04}>
                      <div className={styles.depth6Frame012}>
                        <div className={styles.whatIsAirbnbs}>Visit our community</div>
                      </div>
                      <div className={styles.depth6Frame13}>
                        <div className={styles.findOutMore}>Find answers and general info in our community</div>
                      </div>
                    </div>
                    <img className={styles.depth5Frame12} alt="" src="Depth 5, Frame 1.svg" />
                  </div>
                  <div className={styles.depth4Frame4}>
                    <div className={styles.depth5Frame04}>
                      <div className={styles.depth6Frame013}>
                        <div className={styles.whatIsAirbnbs}>{`Host Q&A`}</div>
                      </div>
                      <div className={styles.depth6Frame13}>
                        <div className={styles.findOutMore}>Ask questions and get help from other hosts</div>
                      </div>
                    </div>
                    <img className={styles.depth5Frame12} alt="" src="Depth 5, Frame 1.svg" />
                  </div>
                  <div className={styles.depth4Frame4}>
                    <div className={styles.depth5Frame04}>
                      <div className={styles.depth6Frame014}>
                        <div className={styles.whatIsAirbnbs}>Urgent issues</div>
                      </div>
                      <div className={styles.depth6Frame13}>
                        <div className={styles.findOutMore}>Discuss urgent issues with other hosts</div>
                      </div>
                    </div>
                    <img className={styles.depth5Frame12} alt="" src="Depth 5, Frame 1.svg" />
                  </div>
                  <div className={styles.depth4Frame11}>
                    <div className={styles.depth5Frame010}>
                      <div className={styles.depth6Frame01}>
                        <b className={styles.visitHelpCenter}>Contact us</b>
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
        <div className={styles.depth3Frame01}>
          <div className={styles.depth4Frame02}>
            <div className={styles.depth5Frame011}>
              <div className={styles.depth6Frame016} onClick={onDepth7FrameClick}>
                <div className={styles.aboutUs}>About Us</div>
              </div>
              <div className={styles.depth6Frame16}>
                <div className={styles.aboutUs}>Contact</div>
              </div>
              <div className={styles.depth6Frame016} onClick={onDepth7FrameClick}>
                <div className={styles.aboutUs}>Terms of Service</div>
              </div>
              <div className={styles.depth6Frame016} onClick={onDepth7FrameClick}>
                <div className={styles.aboutUs}>Privacy Policy</div>
              </div>
            </div>
            <div className={styles.depth5Frame18}>
              <img className={styles.depth6Frame017} alt="" src="Depth 6, Frame 0.svg" />
              <img className={styles.depth6Frame017} alt="" src="Depth 6, Frame 1.svg" />
              <img className={styles.depth6Frame017} alt="" src="Depth 6, Frame 2.svg" />
            </div>
            <div className={styles.depth5Frame21}>
              <div className={styles.aboutUs}>@2025 WanderNest, All rights reserved.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
