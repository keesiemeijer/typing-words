import { FormSettings, defaultLimits } from "../App";
import { isValidSettingsObject } from "./validate";

export const getWords = (settings: FormSettings): string[] => {
    if (!isValidSettingsObject(settings)) {
        return [];
    }

    const randomString = generateStringFromCharacters(settings.chars, 1000);

    let words: string[] = [];
    let wordLength = settings.wordLength;
    for (let index = 0; index < settings.wordsToGenerate; index++) {
        if (settings.randomWordLength) {
            wordLength = getRandomNumber(defaultLimits.wordLength.min, settings.wordLength);
        }
        words[index] = generateRandomString(randomString, wordLength);
    }

    return words;
};

export const convertWordsToString = (words: string[], columns: number = 5): string => {
    if (!Array.isArray(words) || !words.length || typeof columns !== "number") {
        return "";
    }
    let wordListString = "";
    for (let index = 0; index < words.length; index++) {
        if (typeof words[index] === "string") {
            wordListString += words[index];
            wordListString += (index + 1) % columns === 0 ? "\n" : " ";
        }
    }
    return wordListString;
};

const generateStringFromCharacters = (chars: string, stringLength: number = 50): string => {
    let string = "";

    const charLength = chars.length;
    const loopCount = Math.floor(stringLength / charLength);
    const missing = stringLength - charLength * loopCount;

    for (let index = 0; index < loopCount; index++) {
        string += shuffleString(chars);
    }

    if (missing > 0) {
        for (let index = 0; index < missing; index++) {
            // get's random character from string
            string += chars[Math.floor(Math.random() * chars.length)];
        }
    }

    return shuffleString(string);
};

const generateRandomString = (chars: string, length: number): string => {
    let result = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars.charAt(randomIndex);
    }

    return result;
};

const shuffleString = (string: string): string => {
    var a = string.split(""),
        n = a.length;

    for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
};

const getRandomNumber = (min: number, max: number): number => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};
