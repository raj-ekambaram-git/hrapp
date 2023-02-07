import { ESIGN_TABS_KEYS } from "../../constants";

const docusign = require('docusign-esign');
const fs = require('fs');

export { authenticate, populateTabsData };

function populateTabsData(docuSign, configData){
  console.log("CONFIG DATA:::"+JSON.stringify(configData))

  const signHereTabs = [];
  const initialHereTabs = [];
  const dateSignedTabs = [];
  const titleTabs = [];
  const textTabs = [];
  const numberTabs = [];
  const dateTabs = [];
  const emailTabs = [];
  const noteTabs = [];
  const firstNameTabs = [];
  const lastNameTabs = [];
  const fullNameTabs = [];


  if(configData && configData.length > 0) {
    configData?.map((config) => {
      console.log("config::::"+JSON.stringify(config))
      switch(config.type) {
        case ESIGN_TABS_KEYS.signHereTabs:   
            console.log("inside the sign ehre...")
            let signHere = docuSign.SignHere.constructFromObject({
              anchorString: config.key,
              anchorYOffset: "10",
              anchorUnits: "pixels",
              anchorXOffset: "20",              
            });   
            if(signHere) {
              signHereTabs.push(signHere)
            }
          break;
        case ESIGN_TABS_KEYS.initialHereTabs:         
            let initialHere = docuSign.InitialHere.constructFromObject({
              anchorString: config.key,
              anchorYOffset: "10",
              anchorUnits: "pixels",
              anchorXOffset: "20",
            });   
            if(initialHere) {
              initialHereTabs.push(initialHere)
            }        
          break;
        case ESIGN_TABS_KEYS.dateSignedTabs:       
            let dateSigned = docuSign.DateSigned.constructFromObject({
              anchorString: config.key,
              anchorYOffset: "10",
              anchorUnits: "pixels",
              anchorXOffset: "20",
            });   
            if(dateSigned) {
              dateSignedTabs.push(dateSigned)
            }              

          break;
        case ESIGN_TABS_KEYS.titleTabs:         
            let title = docuSign.Title.constructFromObject({
              anchorString: config.key,
              anchorYOffset: "10",
              anchorUnits: "pixels",
              anchorXOffset: "20",
            });   
            if(title) {
              titleTabs.push(title)
            }              

          break;
        case ESIGN_TABS_KEYS.textTabs:    
            let text = docuSign.Text.constructFromObject({
              anchorString: config.key,
              anchorYOffset: "10",
              anchorUnits: "pixels",
              anchorXOffset: "20",
              value: config.value
            });   
            if(text) {
              textTabs.push(text)
            }                             
          break;
        case ESIGN_TABS_KEYS.numberTabs:           
            // let number = docuSign.Number.constructFromObject({
            //   anchorString: config.key,
            //   value: config.value
            // });   
            // if(number) {
            //   numberTabs.push(number)
            // }                    
          break;
        case ESIGN_TABS_KEYS.dateTabs:     
            // let date = docuSign.Date.constructFromObject({
            //   anchorString: config.key,
            //   anchorYOffset: "10",
            //   anchorUnits: "pixels",
            //   anchorXOffset: "20",
            //   value: config.value
            // });   
            // if(date) {
            //   dateTabs.push(date)
            // }                    
          break;
        case ESIGN_TABS_KEYS.emailTabs:    
            let email = docuSign.Email.constructFromObject({
              anchorString: config.key,
              anchorYOffset: "10",
              anchorUnits: "pixels",
              anchorXOffset: "20",
              value: config.value
            });   
            if(email) {
              emailTabs.push(email)
            }                     
          break;
        case ESIGN_TABS_KEYS.noteTabs:    
            let note = docuSign.Note.constructFromObject({
              anchorString: config.key,
              anchorYOffset: "10",
              anchorUnits: "pixels",
              anchorXOffset: "20",
              value: config.value
            });   
            if(note) {
              noteTabs.push(note)
            }                     
          break;
        case ESIGN_TABS_KEYS.firstNameTabs:  
            let firstName = docuSign.FirstName.constructFromObject({
              anchorString: config.key,
              anchorYOffset: "10",
              anchorUnits: "pixels",
              anchorXOffset: "20",
            });   
            if(firstName) {
              firstNameTabs.push(firstName)
            }                       
          break;
        case ESIGN_TABS_KEYS.lastNameTabs:   
            let lastName = docuSign.LastName.constructFromObject({
              anchorString: config.key,
              anchorYOffset: "10",
              anchorUnits: "pixels",
              anchorXOffset: "20",
            });   
            if(lastName) {
              lastNameTabs.push(lastName)
            }                      
          break;
        case ESIGN_TABS_KEYS.fullNameTabs:  
            let fullName = docuSign.FullName.constructFromObject({
              anchorString: config.key,
              anchorYOffset: "10",
              anchorUnits: "pixels",
              anchorXOffset: "20",
            });   
            if(fullName) {
              fullNameTabs.push(fullName)
            }                       
          break;

      }
    })

    console.log("SIGNE JHERE TABS::"+JSON.stringify(signHereTabs))
    return docuSign.Tabs.constructFromObject({
      signHereTabs: signHereTabs,
      initialHereTabs: initialHereTabs,
      dateSignedTabs: dateSignedTabs,
      titleTabs: titleTabs,
      textTabs: textTabs,
      numberTabs: numberTabs,
      dateTabs: dateTabs,
      emailTabs: emailTabs,
      noteTabs: noteTabs,
      firstNameTabs: firstNameTabs,
      lastNameTabs: lastNameTabs,
      fullNameTabs: fullNameTabs,

    });

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
