// ==UserScript==
// @name         imm trans
// @version      0.1
// @include *
// @description  imm trans but short enough for trivial audit
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    let domContentLoadedFlag = false;
    let cnt = 0;

       function translateText(text, callback) {
        const apiKey = '';
        const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                prompt: `Translate the following English text to Chinese:\n\n"${text}"\n\nTranslation:`,
                max_tokens: 1000, // Adjust as needed
            }),
            onload: function(response) {
                const translation = JSON.parse(response.responseText).choices[0].text;
                callback(translation);
            }
        });
    }



    function processParagraphs() {
        //console.log('?');
        const paragraphs = document.querySelectorAll('p, h1, h2');

        //paragraphs.forEach(paragraph => {
        //    const originalText = paragraph.textContent;
        //    const placeholderTranslation = 'Placeholder Translation'; // Replace with actual translation later
        //    console.log(`Original Text: ${originalText}`);
        //    console.log(`Translation: ${placeholderTranslation}`);
        //    console.log('---'); // Separator between paragraphs
        //    paragraph.innerHTML += "<br><u>my text</u><br>";
        //});

        for (const paragraph of paragraphs) {
            const originalText = paragraph.textContent;
            translateText(originalText, translation => {
                console.log(`Original Text: ${originalText}`);
                console.log(`Translation: ${translation}`);
                console.log('---'); // Separator between paragraphs
                paragraph.innerHTML += `<br><u>${translation}</u><br>`;
            });
            cnt++;
            if (cnt>=8) {
                break;
            }
        };
    }


    window.addEventListener('DOMContentLoaded', function() {
        domContentLoadedFlag = true;
    });
    document.addEventListener('keydown', function(event) {
        // Check if Alt key and A key are pressed
        if (event.altKey && event.key === 'a' && domContentLoadedFlag) {
            event.preventDefault(); // Prevent the default browser behavior
            processParagraphs();
        }
    });
})();
