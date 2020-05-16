# Good new Everyone!
Crazy Ivan Motors has really extended its business thanks to the app you've made! Now we are getting international customers and need to handle deals in foreign currencies! Check latest commit in this branch to see how the API was extended to handle foreign currencies.  Here is a mockup of what our business needs for now:

![](/requirments-sketches/9.png)

**New Requirements**
1.	Existing deals should work as before.

2.	Add button to create a foreign currency deal tab.

3.	Foreign currency deal allows user to select a currency. All payments are converted from bas price in USD to that currency. New API methods are called for ‘set minimum possible currency’ and ‘request approval’.

4.	Header shows selected currency (this also lets our users easily see foreign currency deal tabs).

5.	Otherwise – foreign currency deal tab behaves the same as existing deal tab

**Note**: Foreign currency deal is just the first of many planed new deal types, each with its own little pricing quirk – the purpose of this new requirements is to show, how a given architecutre approach allows to reuse existing code in new situations. Please don’t hide this functionality behind a flag in existing deal code, since you will soon have 10 such flags for new deal types. Existing deal code may have extensibility points added, or made reusable in some other way you come up with, but it should not know, how exactly it will be extended. Keep it SOLID ;-) .
