# Welcome to UI app architecture showcase

It is customary in frontend world to demonstrate different architecutres by implementing a simple counter and then a TODO list app. The problem is, both cases are quite simple and neither showcase nor test a given apporach against real world requirments. This project attempts to bridge the gap by implementing a minimal set of requirments such as tabbed ui, user input validation, derived fields, timed actions etc. that you are likely to have in the real world. The goal is to provide standrtised prooving ground, where same app implementations can be compared (much like TODO list apps projecs) and people looking for hints at code organization can study them. My initial personal goal was to have a set of requirments to test new frameworks before using them in my proffesional projects.

Set of requirments provided can also be used for learning purposes. I made them highly representative of enterprise app development process. 

Individual implementations are contained in branches. To make your own - start in the `main` branch, `src` folder contains app entry point and mock `api` clients to be used.  

# Requirments

**Disclaimer**: this requirements are intentionally formulated in a realistic manner, rather than best possible manner. Use commonsense and look at API signatures. Unless someone specifically told you otherwise, this task is not about aesthetics or CSS. This task is about code quality and architecture. Final result does not have to look exactly like sketch, or be beautiful, but must have correct behavior.
*That being said, you should probably reuse HTML and CSS from an existing implementation to make your life easier and maintain unified visuals.*

Desired final result sketch: 

![](/requirments-sketches/1.png)

1.	Api is emulated by 3 client classes in `./src/api` . Files in that folder are to be used as-is (no modifications to them).

2.	App is to use tabs, 1 deal per tab. Many independent deals can be in-process at the same time. App must have buttons to create a new tab and close existing tab (see sketch).

3.	When a new tab is open – list of possible car models must be retrieved from `getAvaliableCarModels` and of possible insurance plans from `getAvaliableInsurancePlans`. This lists are not shared between tabs – each tab has its own. Each list can be refreshed from the api via a button. User must select 1 car model and can select 0 or more insurance plans. Once car model is chosen – it is displayed in tab header.

4.	Final price of the deal formula: 

**Final price = car base price + sum(insurance plan rate * car base price) for each insurance plan.**

5.	For downpayment, user can enter any string, but it is only valid when a positive whole number is entered. If anything else is entered – an error message is shown:

*For invalid number:*

![](/requirments-sketches/2.png)

*For negative number:*

![](/requirments-sketches/3.png)

*If final price is available and downpayment exceeds it:*

![](/requirments-sketches/4.png)

*User is allowed to enter K for 000 and M for 000000*

6.	‘Set minimum possible’ button calls `getMinimumPossibleDownpayment` method from api and sets provided value to ui.

7.	When a car model is selected and valid downpayment is available – user can press ‘Request approval’ button to call `getApproval`. If failure meesage is returned – it must be shown:

![](/requirments-sketches/5.png)

If approval is granted – notifying message is shown. If approval has expiration date – a timer in seconds is shown in that message and in tab header (header timer keeps ticking even when tab is not active):

![](/requirments-sketches/6.png)

When timer runs out - "Approval expired message" is shown inside tab:

![](/requirments-sketches/7.png)

Approval may be granted without expiration, in which case - it is perpetual (perpetual approvals are granted if AssetProtection insurance is selected). 

8.	Approvals must be cached for a combination of car model, insurance plans and downpayment. If a user changes any parameter – approval is removed, but if the user reverts changes – existing approval is used again automatically. User can have approvals for several valid combinations within 1 deal. Given approval is used as long as current deal params match the ones for which it was given. Approvals are not shared between deals. 

9.	If user has valid approval – they can finalize deal via `finalizeFinancing`. If not successful – received error message must be shown. Otherwise:

![](/requirments-sketches/8.png)

10. Once you are done, **and only then!** check additional requirments in [`requirments-advanced` branch](https://github.com/IKoshelev/ui-app-architecture-showcases/tree/requirments-advanced), to check flexibility of you approach aganist incoming changes.

# App basis

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). If you are working on a case that does not use React at all - the setup is up to you. Consult whoever gave you the task for additional constraints / expectations in terms of frameworks / libraries / patterns. 

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
