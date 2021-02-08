# Rubicon 📝👾⌚
``` MLH Fellowship Hackathon Submission ```
Rubicon is a VScode extension that allows developers to make the timeconsuming task of writing documentaiton easier.

## Inspiration☀️ 
Currently the process of writing documentation is After discovering Jinja's capabilities of rendering templates, we wanted to use Jinja to help convert user's documentation input, into exportable or saved files.

 <p align="center">
 <img  src="https://media.giphy.com/media/vJJILrBwPx2pT74eqA/giphy.gif" width="650" height="350"/></p>
 </p>  
## User Stories (What it does)✨       
- [x] User can access Rubicon through VScode editor  
- [x] User can write title and description for the project    
- [x] User can attach files and copy/paste code    
- [x] User can go to the landing page and learn more about the extension  
- [x] Jinja renders user input and renders it into to a formated documentation template   
- [x] Jinja's templates can be exported to html, or Github README file    

## How we built it💻    
On the back end 
## Challenges we ran into🐢   
- One of the most time consuming challenge was **building out the VSCode extension**. Neither of us have build extensions before yet because the whole point of our project is to give users the ability to write documentation **while  they code**, we couldnt give up. Most of all  it was challenging to work with Typescript + Webpack since none of us used Typescript before as well as the VSCode Webviews API's which have many functionalities that have to be researched & configured. 
- Converting user's input into Jinja's templates that can be exported was something we had to think through for some time yet we managed to make it work with static data.

## Accomplishments that we're proud of 🥳  
1. Despite of the time zone differences, we were able to collaborate together and complete a challenging yet exciting MVP!
2. We are proud that we didnt give up and tried our best to have the basic features done.

## What we learned🌱  
- Not to underestimate the **"simplicity"** of code extensions especily if building them for the first time since there is a lot of fucntinalities envovled
- Backend with databases is something we got stuck in and want to learn more about so that next time both of us are experienced with it

## What's next for Rubicon🚀
For our next steps, we want to enhace and add on the following elements to Rubicon:
1. Add github authentication - this will add a layer of security as well as help to save the user's input
2. Connect Rubicon to a database so that all the files are saved  - this will allow the user to access previous or current templates
3. Allow the user to access saved templates through Rubicon's website
4. Allow user to pick a variety of Jinja templates - developers have different purposes when writing documentation , we want to tailor documentation to their goals
5. Publish the extension in the VSCode marketplace

## How to run this extension locally:
```
1. git clone "paste the link of the repo" 
2. Open VSCode and type "npm install" 
3. After instillation is done, press F5 to get a local VScode environment up & running ( the rubics cube icon is on the left) 

```
