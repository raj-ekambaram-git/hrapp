const docusign = require('docusign-esign');
const fs = require('fs');

export { authenticate, populateTabsData };

function populateTabsData(docuSign, configData){
  console.log("CONFIG DATA:::"+JSON.stringify(configData))


  if(configData && configData.length > 0) {
    configData?.map((config) => {

      console.log("config::::"+JSON.stringify(config))
      // let signHere1 = docuSign.SignHere.constructFromObject({
      //   anchorString: "**signature_1**",
      //   anchorYOffset: "10",
      //   anchorUnits: "pixels",
      //   anchorXOffset: "20",
      // });
      // // Tabs are set per recipient / signer
      // let signerTabs = docuSign.Tabs.constructFromObject({
      //   signHereTabs: [signHere1],
      // });
  
    })

  }
}

async function authenticate(SCOPES){
    const jwtLifeSec = 60 * 60, // requested lifetime for the JWT is 10 min
      dsApi = new docusign.ApiClient();
    dsApi.setOAuthBasePath(process.env.ESIGN_BASE_PATH.replace('https://', '')); // it should be domain only.
    let rsaKey = fs.readFileSync('keys/docusign.key');
  
    try {
      const results = await dsApi.requestJWTUserToken(process.env.ESIGN_CLIENT_ID,
        process.env.ESIGN_USER_ID, SCOPES, rsaKey,
        jwtLifeSec);
        // console.log("RESULTS:::"+JSON.stringify(results))
      const accessToken = results.body.access_token;
  
      // get user info
      const userInfoResults = await dsApi.getUserInfo(accessToken);

      console.log("userInfoResults:::"+JSON.stringify(userInfoResults))
  
      // use the default account
      let userInfo = userInfoResults.accounts.find(account =>
        account.isDefault === "true");
  
      return {
        accessToken: results.body.access_token,
        apiAccountId: userInfo.accountId,
        basePath: `${userInfo.baseUri}/restapi`
      };
    } catch (e) {
      console.log(e);
      let body = e.response && e.response.body;
      // Determine the source of the error
      if (body) {
          // The user needs to grant consent
        if (body.error && body.error === 'consent_required') {
          if (getConsent(SCOPES)){ return this.authenticate(); };
        } else {
          // Consent has been granted. Show status code for DocuSign API error
          this._debug_log(`\nAPI problem: Status code ${e.response.status}, message body:
          ${JSON.stringify(body, null, 4)}\n\n`);
        }
      }
    }
  }



function getConsent(SCOPES) {
    var urlScopes = SCOPES.join('+');
  
    // Construct consent URL
    var redirectUri = process.env.ESIGN_REDIRECT_URI;
    var consentUrl = process.env.ESIGN_REDIRECT_CONSENT_URL +
                        `scope=${urlScopes}&client_id=`+process.env.ESIGN_CLIENT_ID+`&redirect_uri=`+process.env.BONEEDS_ESIGN_REDIRECT_URI+`}`;
    console.log(consentUrl);
    let consentGranted = prompt("");
    if(consentGranted == "1"){
      return true;
    } else {
      console.error("Please grant consent!");
      process.exit();
    }
  }


export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb", // Set desired value here
    },
  },
};
