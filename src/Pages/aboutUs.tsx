import React from 'react';
import Layout from '../App/Layout';

const teamMembers = [
  {
    name: 'Ejaz Uddin Swaron',
    country: 'Bangladesh',
    img: '/Figma_photoes/thePhoto-modified-reduced.png',
    desc: 'Passionate developer with expertise in creating modern web applications.'
  },
  {
    name: 'Shah Redwan Ahmed',
    country: 'Bangladesh',
    img: '/Figma_photoes/redwan-bro-modified-reduced.png',
    desc: 'Passionate developer with expertise in creating modern web applications.'
  },
  {
    name: 'Iftikhar Majumder',
    country: 'Bangladesh',
    img: '/Figma_photoes/ifty_bro_2-modified_reduced.png',
    desc: 'Passionate developer with expertise in creating modern web applications.'
  },
  {
    name: 'Mojjammel Hossain',
    country: 'Bangladesh',
    img: '/Figma_photoes/mithil_bro-modified_reduced.png',
    desc: 'Passionate developer with expertise in creating modern web applications.'
  },
  {
    name: 'Abathi Arifeen',
    country: 'Bangladesh',
    img: '/Figma_photoes/abtahi_bro-modified-reduced.png',
    desc: 'Passionate developer with expertise in creating modern web applications.'
  },
];

const AboutUs: React.FC = () => {
  return (
    <Layout>
      <div className={styles.aboutUsPage}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroOverlay}>
            <h1 className={styles.heroTitle}>Explore purposefully, Travel meaningfully, Feel at home anywhere.</h1>
            <p className={styles.heroSubtitle}>Find Your Nest, Wander the World.</p>
          					</div>
        				</div>
        			
        {/* Team Section */}
        <section className={styles.teamSection}>
          <h2 className={styles.teamTitle}>Meet the Team</h2>
          <div className={styles.teamGrid}>
            {teamMembers.map((member, idx) => (
              <div className={styles.teamCard} key={idx}>
                <img src={member.img} alt={member.name} className={styles.teamPhoto} />
                <div className={styles.teamInfo}>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <div className={styles.teamCountry}>{member.country}</div>
                  <div className={styles.teamDesc}>{member.desc}</div>
      			</div>
              </div>
            ))}
          </div>
        </section>
    		</div>
			</Layout>	
			);
};

export default AboutUs;
