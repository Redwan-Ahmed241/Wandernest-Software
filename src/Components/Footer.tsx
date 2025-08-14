import React from "react";
import { useNavigate } from "react-router-dom";
// Tailwind conversion: all styles are now inline utility classes

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.depth2Frame3}>
      <div className={styles.depth3Frame02}>
        <div className={styles.depth4Frame03}>
          <div className={styles.depth5Frame06}>
            <div className={styles.depth6Frame05} onClick={() => navigate('/about-us')} style={{ cursor: 'pointer' }}>
              <div className={styles.aboutUs}>About Us</div>
            </div>
            <div className={styles.depth6Frame12} onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>
              <div className={styles.aboutUs}>Contact</div>
            </div>
            <div className={styles.depth6Frame05} onClick={() => navigate('/terms')} style={{ cursor: 'pointer' }}>
              <div className={styles.aboutUs}>Terms of Service</div>
            </div>
            <div className={styles.depth6Frame05} onClick={() => navigate('/PrivacyPolicy')} style={{ cursor: 'pointer' }}>
              <div className={styles.aboutUs}>Privacy Policy</div>
            </div>
          </div>

          <div className={styles.depth5Frame12}>
            <img className={styles.depth6Frame06} alt="Facebook" src="/Figma_photoes/facebook.svg" />
            <img className={styles.depth6Frame06} alt="Twitter" src="/Figma_photoes/twitter.svg" />
            <img className={styles.depth6Frame06} alt="Instagram" src="/Figma_photoes/insta.svg" />
          </div>

          <div className={styles.depth5Frame22}>
            <div className={styles.aboutUs}>@2025 WanderNest, All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
