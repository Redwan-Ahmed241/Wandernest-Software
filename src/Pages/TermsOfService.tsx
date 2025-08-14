import { FunctionComponent, useCallback } from 'react';
import Layout from '../App/Layout';

const TermsOfService:FunctionComponent = () => {
  	
  	const onDepth4FrameClick = useCallback(() => {
    		// Add your code here
  	}, []);
  	
  	return (<Layout>
    		<div className={styles.termsOfService}>
      			<div className={styles.depth0Frame0}>
        				<div className={styles.depth1Frame0}>
          				
          					<div className={styles.depth2Frame1}>
            						<div className={styles.depth3Frame01}>
              							<div className={styles.depth4Frame02}>
                								<div className={styles.depth5Frame02}>
                  									<div className={styles.termsOfService1}>Terms of Service</div>
                								</div>
              							</div>
              							<div className={styles.depth4Frame12}>
                								<div className={styles.theseTermsOf}>These Terms of Service (the 'Agreement') are an agreement between WanderNest, Inc. ('WanderNest' or 'us'), the owner and operator of wandernest.com (the 'Site'), the WanderNest software (the 'Software'), and you ('you' or 'You'), a user of the Site or Software. This Agreement sets forth the general terms and conditions of your use of the Site and the Software.</div>
              							</div>
              							<div className={styles.depth4Frame2}>
                								<b className={styles.accounts}>Accounts</b>
              							</div>
              							<div className={styles.depth4Frame12}>
                								<div className={styles.theseTermsOf}>Account Creation. In order to use the Software, you must create an account on the Site (an 'Account'). You represent and warrant that all information you submit when you create your Account is accurate, current and complete, and that you will keep your Account information accurate, current or complete. If WanderNest believes that your information is not accurate, current or complete, we have the right to refuse you access to the Site and Software, and to terminate or suspend your Account.</div>
              							</div>
              							<div className={styles.depth4Frame2}>
                								<b className={styles.accounts}>Modifications</b>
              							</div>
              							<div className={styles.depth4Frame12}>
                								<div className={styles.theseTermsOf}>To the Agreement. WanderNest reserves the right to change this Agreement from time to time. The most current version of this Agreement will be located on the Site. You understand and agree that if you use the Software after the date on which the Agreement has changed, WanderNest will treat your use as acceptance of the updated Agreement.</div>
              							</div>
            						</div>
          					</div>
        				</div>
      			</div>
    		</div>
					</Layout>);
};

export default TermsOfService;
