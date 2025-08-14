import { FunctionComponent, useCallback } from "react";
import styles from "../Styles/PrivacyPolicy.module.css";

const PrivacyPolicy: FunctionComponent = () => {
  const onDepth4FrameClick = useCallback(() => {}, []);

  return (
    <div className={styles.privacyPolicy}>
      <div className={styles.depth0Frame0}>
        <div className={styles.depth1Frame0}>
          <div className={styles.navbar}>
            <div className={styles.depth3Frame0}>
              <img
                className={styles.depth4Frame0}
                alt=""
                src="/figma_photos/wandernest.svg"
              />
              <div className={styles.depth4Frame1} onClick={onDepth4FrameClick}>
                <b className={styles.wandernest}>WanderNest</b>
              </div>
            </div>
            <div className={styles.depth3Frame1}>
              <div className={styles.depth4Frame01}>
                <div
                  className={styles.depth4Frame1}
                  onClick={onDepth4FrameClick}
                >
                  <div className={styles.destinations}>Destinations</div>
                </div>
                <div
                  className={styles.depth4Frame1}
                  onClick={onDepth4FrameClick}
                >
                  <div className={styles.destinations}>Hotels</div>
                </div>
                <div className={styles.depth5Frame2}>
                  <div className={styles.flights} onClick={onDepth4FrameClick}>
                    Flights
                  </div>
                </div>
                <div
                  className={styles.depth4Frame1}
                  onClick={onDepth4FrameClick}
                >
                  <div className={styles.destinations}>Packages</div>
                </div>
              </div>
              <div className={styles.depth4Frame11}>
                <div
                  className={styles.depth5Frame01}
                  onClick={onDepth4FrameClick}
                >
                  <div className={styles.depth6Frame0}>
                    <b className={styles.signUp}>Sign up</b>
                  </div>
                </div>
                <div
                  className={styles.depth5Frame11}
                  onClick={onDepth4FrameClick}
                >
                  <div className={styles.depth6Frame0}>
                    <b className={styles.signUp}>Log in</b>
                  </div>
                </div>
                <img
                  className={styles.depth5Frame21}
                  alt=""
                  src="/figma_photos/world.svg"
                />
              </div>
            </div>
          </div>
          <div className={styles.depth2Frame1}>
            <div className={styles.depth3Frame01}>
              <div className={styles.depth4Frame02}>
                <div className={styles.depth5Frame02}>
                  <div className={styles.privacyPolicy1}>Privacy Policy</div>
                </div>
              </div>
              <div className={styles.depth4Frame12}>
                <div className={styles.lastUpdatedJune}>
                  Last updated: June 30, 2023
                </div>
              </div>
              <div className={styles.depth4Frame2}>
                <b className={styles.wandernest}>1. Introduction</b>
              </div>
              <div className={styles.depth4Frame3}>
                <div className={styles.weAreCommitted}>
                  We are committed to safeguarding the privacy of our website
                  visitors and service users.
                </div>
              </div>
              <div className={styles.depth4Frame2}>
                <b className={styles.wandernest}>
                  2. How we use your personal data
                </b>
              </div>
              <div className={styles.depth4Frame3}>
                <div className={styles.weAreCommitted}>
                  In this Section 2 we have set out:
                </div>
              </div>
              <div className={styles.depth4Frame2}>
                <b className={styles.wandernest}>
                  3. Retaining and deleting personal data
                </b>
              </div>
              <div className={styles.depth4Frame3}>
                <div className={styles.weAreCommitted}>
                  This Section 3 sets out our data retention policies and
                  procedure, which are designed to help ensure that we comply
                  with our legal obligations in relation to the retention and
                  deletion of personal data.
                </div>
              </div>
              <div className={styles.depth4Frame2}>
                <b className={styles.wandernest}>4. Amendments</b>
              </div>
              <div className={styles.depth4Frame3}>
                <div className={styles.weAreCommitted}>
                  We may update this policy from time to time by publishing a
                  new version on our website.
                </div>
              </div>
              <div className={styles.depth4Frame2}>
                <b className={styles.wandernest}>5. Your rights</b>
              </div>
              <div className={styles.depth4Frame3}>
                <div className={styles.weAreCommitted}>
                  In this Section 5, we have summarised the rights that you have
                  under data protection law. Some of the rights are complex, and
                  not all of the details have been included in our summaries.
                  Accordingly, you should read the relevant laws and guidance
                  from the regulatory authorities for a full explanation of
                  these rights.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
