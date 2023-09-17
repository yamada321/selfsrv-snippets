// ==UserScript==
// @name         imm trans
// @version      0.2.1
// @include *
// @description  alt+a to translate page, alt+b to translate input, see comments below. Google translate api call adpated from https://addons.mozilla.org/en-US/firefox/addon/translation-selected-text/?utm_content=addons-manager-reviews-link&utm_medium=firefox-browser&utm_source=firefox-browser which i find very useful.
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    let domContentLoadedFlag = false;
    let cnt_now = -1;

    function translateText(to_lang, text, callback) {
       var translation_promise = function(){
           const url = "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&sl=auto";
           return fetch(url + "&tl=" + to_lang + "&q=" + encodeURIComponent(text)).then(
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
                translateText("en", originalText, translation => {
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
                translateText("en", originalText, translation => {
                    paragraph.innerHTML += `<span style='background-color:#fff4d9 !important; color:black !important;'><br>▷${translation}▬<br><br>`;
                });
                cnt++;
                i++;
                cnt_now++;
                if (cnt>=8) {break;}
            }


    }

    function trans_input(){
        const inputField = document.activeElement;
        const origin = inputField.value;
        const tmp = origin.split(/\s+/);
        const targetLang = tmp[0];
        translateText(targetLang, tmp.slice(1).join(" "), translation=>{
            inputField.value = translation;
            }
        );
    }


    window.addEventListener('DOMContentLoaded', function() {
        domContentLoadedFlag = true;
    });
    document.addEventListener('keydown', function(event) {
        // Translate whole page.
	// At first trigger, translate h1 through h4 and first 8 p tags. 
	// Afterwards, translate 8 more paragraphs at each time. 
        if (event.altKey && event.key === 'a' && domContentLoadedFlag) {
            event.preventDefault(); // Prevent the default browser behavior
            processParagraphs();
        }
    });
    document.addEventListener('keydown', function(event) {
        // Translate input: the input is prefix with the target language code, 
	// e.g. "en my text" for translating to English (original lang 
	// is up to auto detection). This prefix will be stripped. 
	// FIXME: prompt failure when timeout, e.g. cn is not a valid prefix.
        if (event.altKey && event.key === 'b' && domContentLoadedFlag) {
            event.preventDefault(); // Prevent the default browser behavior
            trans_input();
        }
    });
})();
