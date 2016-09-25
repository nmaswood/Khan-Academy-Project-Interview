# Khan-Academy-Project-Interview

## To experience
Go to [Code Editor](http://nasrmaswood.com)
## To run
Go to  /final and open up index.html in a browser this is the minified version of the code.

P.S. If you have an issue accessing the website make sure you type in http://nasrmaswood.com and NOT http://www.nasrmaswood.com it is some GoDaddy hosting issue I have yet to work out.

## Source
### Libraries used
No external libraries were used. I did not think I needed anymore than vanilla css, js, html. Gulp was used to convert es6 to es5 and minify the code.
### Individual Files
##### /src/js
##### validate.js 
This file contains the core api functions: black list, white list and general structure as well as a few helper functions.
##### editor.js
This file contains all code related to setting up the coding editor. e.g. using Ace to grab and then process user input.
##### dom.js
This file contains all the code used for populating the HTML page.
##### util.js
This file contains some useful helper functions.

##### /src/test
All files here contain unit tests corresponding to their file in src.

## Design Decisions
### Esprima vs. Acorn
My implementation is library agnostic, however that being said I chose to use esprima in the final product.
##### Ease of Use
I created the API in Esprima and tried it using Acorn. Seeing as all my unit tests from Esprima passed in Acorn there was no discernible difference between using the two libraries. I only used the parse method for either library.
##### Docs
Esprima definitely is better documented. The project has a website where you can try the library and test it in a code editor. This was very helpful and allowed to pick it up very quickly.
##### Benchmarks 
Acorn's benchmark mark tests on their website as well as the general sentiment online points in the direction that acorn is the faster library. However, personally, I found Esprima to be faster. I timed how long my unit tests took (on average on my computer using Chrome). I did not use any of acorn's tree traversal methods which may have sped things up considerably. However, given my implementation I think Esprima is the more straight forward choice.
##### Size
Acorn is about half the size of Esprima however to me 64k is worth the time saved by figuring out why my implementation is so much slower in Acorn.

| Lib        | No-Big-String (10 Trials) | Big-String (10 Trials)  | Filesize
| --- |:---:| -----:| :---:|
| Esprima | 4.56 | 1158.00 | 130kb
| Acorn | 4.33    |   27085.27 | 64kb

### Browser Support
| Chrome       | Mozilla| Safari  | IE
| --- |:---:| -----:| :---:|
| YES | YES | YES | YES

*NOTE  IE10 was tested via Safari Developer's browser emulator.

**
I did not anticipate browser compatability being an issue because I transpiled down to es5 and did not use any other libs.
### General Design Comments
### Text Editor Choice

#### Ace Code Editor
Khan Academy uses Ace so it seemed like a very rational choice. Overall, the code editor seemed like less a significant choice than Esprima / Acorn so I did not try Code Mirror to see how it worked.

### What happens on large inputs / General UX

In order to make the effect of running the three api functions less noticeable I used a debouncer that only ran the function every half second or so. This debounce timeout scales with the amount of time the api takes to run. And if the time taken exceeds a  certain threshold I disable automatic tests and make manual test running the norm.
