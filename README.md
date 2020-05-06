# Requirments

**Disclaimer**: this requirements are intentionally formulated in a realistic manner, rather than best possible manner. Use commonsense and look at API signatures. Unless someone specifically told you otherwise, this task is not about aesthetics or CSS. This task is about code quality and architecture. Final result does not have to look exactly like sketch, or be beautiful, but must have correct behavior. 

Desired final result sketch: 

![](/requirments-sketches/1.png)

1.	Api is emulated by 3 client classes in https://github.com/IKoshelev/react-mobx-mvvm-showcase/tree/starter/src/api . Files in that folder are to be used as-is (no modifications to them).

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


6.	‘Set minimum possible’ button calls `getMinimumPossibleDownpayment` method from api and sets provided value to ui.

7.	When a car model is selected and valid downpayment is available – user can press ‘Request approval’ button to call `getApproval`. If failure meesage is returned – it must be shown:

![](/requirments-sketches/5.png)

If approval is granted – notifying message is shown. If approval has expiration date – a timer in seconds is shown in that message and in tab header:

![](/requirments-sketches/6.png)

When timer runs out:

![](/requirments-sketches/7.png)

8.	Approvals must be cached for a combination of car model, insurance plans and downpayment. If a user changes any parameter – approval is removed, but if the user reverts changes – existing approval is used again automatically. User can have approvals for several valid combinations within 1 deal. Given approval is used as long as current deal params match the ones for which it was approved. Approvals are not shared between deals. 

9.	If user has valid approval – they can finalize deal via `finalizeFinancing`. If not successful – received error message must be shown. Otherwise:

![](/requirments-sketches/8.png)

# App basis

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Consult whoever gave you the task for additional constraints / expectations int terms of frameworks / libraries / patterns. 

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
