// ==UserScript==
// @name         imm trans
// @version      0.2
// @include *
// @description  alt+a to trigger. imm trans but short enough for trivial audit, it just calls google translate. Translate headers (all) and <p> (8 in each go). Google translate api url adpated from https://addons.mozilla.org/en-US/firefox/addon/translation-selected-text/?utm_content=addons-manager-reviews-link&utm_medium=firefox-browser&utm_source=firefox-browser which i find very useful. 
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    let domContentLoadedFlag = false;
    let cnt_now = -1;

       function translateText(text, callback) {
       var translation_promise = function(){
           const url = "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&sl=auto";
           return fetch(url + "&tl=en&q=" + encodeURIComponent(text)).then(
		   r => r.ok ? r.json().then(j => j.sentences.map(s => s.trans).join("")) : "Error: " + r.statusText,
		   e => "Error: " + e.message);
       }
        translation_promise().then(callback);
    }



    function processParagraphs() {
        if (cnt_now<=0){
            const paragraphs = document.querySelectorAll('h1, h2, h3, h4');

            for (const paragraph of paragraphs) {
                const originalText = paragraph.textContent;
                translateText(originalText, translation => {
                    //console.log(`Original Text: ${originalText}`);
                    //console.log(`Translation: ${translation}`);
                    //console.log('---');
                    paragraph.innerHTML += `<span style='background-color:#f4c6f4 !important; color:black !important;'><br>▷${translation}▬<br><br>`;
                });
            }
            cnt_now = 0;
        }

            const paragraphs = document.querySelectorAll('p');
            let cnt = 0;
            let i = 0;
            for (const paragraph of paragraphs) {
                if (i<cnt_now){
                    i++;
                    continue;
                }
                const originalText = paragraph.textContent;
                translateText(originalText, translation => {
                    paragraph.innerHTML += `<span style='background-color:#fff4d9 !important; color:black !important;'><br>▷${translation}▬<br><br>`;
                });
                cnt++;
                i++;
                cnt_now++;
                if (cnt>=8) {break;}
            }


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
