# Khan-Academy-Project-Interview
## Esprima vs. Acorn
My implementation is library agnostic, however that being said I chose to use esprima in the final product.
#### Ease of Use
I created the API in Esprima and tried it using Acorn. Seeing as all my unit tests from Esprima passed in Acorn there was no discernible difference between using the two libraries. I only used the parse method for either library.
#### Docs
Esprima definitely is better documented. The project has a website where you can try the library and test it in a code editor. This was very helpful and allowed to pick it up very quickly.
#### Benchmarks 
Acorn's benchmark mark tests on their website as well as the general sentiment online points in the direction that acorn is the faster library. However, personally, I found Esprima to be faster. I timed how long my unit tests took on average on my computer using Chrome put the results are below. This may because I did not use any of acorn's tree traversal methods which may have sped things up considerably. However, given my implementation I think Esprima is the better, more straight forward choice.
#### Size
Acorn is about half the size of Esprima that beings said only larger inputs Acorn is unusably slow (once again that may be due to improper use) however to me 64k is worth the time saved by figuring out why my implemtnation is so much slower in Acorn.

| Lib        | No-Big-String (10 Trials) | Big-String (10 Trials)  | Filesize
| --- |:---:| -----:| :---:|
| Esprima | 4.56 | 1158.00 | 130kb
| Acorn | 4.56    |   27085.27106.06 | 64kb

## Browser Support
## General Design Comments
## Text Editor Choice
Khan Academy uses Ace so it seemed like a very rational choice. Overall, the code editor seemed like less a signifacant choice than Esprima / Acorn so I did not try Code Mirror to see how it worked.

## What happens on large inputs / General UX







