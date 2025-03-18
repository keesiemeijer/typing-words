import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { getWords, convertWordsToString } from "./utils/utils";
import { isValidSettingsObject } from "./utils/validate";

export interface FormSettings {
    chars: string;
    wordsToGenerate: number;
    wordLength: number;
    columns: number;
    randomWordLength: boolean;
}

export const defaultSettings: FormSettings = {
    chars: "",
    wordsToGenerate: 50,
    wordLength: 5,
    columns: 5,
    randomWordLength: false,
};

export interface Limits {
    [key: string]: { min: number; max: number };
}

export const defaultLimits: Limits = {
    chars: { min: 2, max: 100 },
    wordsToGenerate: { min: 1, max: 1000 },
    wordLength: { min: 2, max: 30 },
    columns: { min: 1, max: 15 },
};

function App() {
    const [words, setWords] = useState<string[]>([]);
    const [settings, setSettings] = useState(defaultSettings);

    // HTML elements
    const charsInput = useRef<HTMLInputElement>(null);
    const wordsToGenerateInput = useRef<HTMLInputElement>(null);
    const randomWordLengthInput = useRef<HTMLInputElement>(null);
    const wordLengthInput = useRef<HTMLInputElement>(null);
    const sentenceLengthInput = useRef<HTMLInputElement>(null);
    const results = useRef<HTMLDivElement>(null);

    // Hook for when list item count changes
    useEffect(() => {
        if (words.length && results.current) {
            results.current.scrollIntoView();
        }
    }, [convertWordsToString(words)]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newSettings: any = {
            chars: charsInput,
            wordsToGenerate: wordsToGenerateInput,
            wordLength: wordLengthInput,
            randomWordLength: randomWordLengthInput,
            columns: sentenceLengthInput,
        };
        // Get values from the form elements
        Object.keys(newSettings).forEach(function (key) {
            const element = newSettings[key];

            // default value
            let value: any = defaultSettings[key as keyof FormSettings];

            if (["randomWordLength", "randomSentenceLength", "sentenceFormat"].includes(key)) {
                // checkbox values
                if (element.current) {
                    // new value
                    value = element.current.checked;
                }
            } else {
                if (element.current) {
                    // new value
                    value = element.current.value.trim();
                    // Update form with trimmed values
                    element.current.value = value;
                }
            }

            // Assign element values
            newSettings[key] = value;
        });

        // Casting strings to number
        newSettings["wordsToGenerate"] = +newSettings["wordsToGenerate"];
        newSettings["wordLength"] = +newSettings["wordLength"];
        newSettings["columns"] = +newSettings["columns"];

        const formSettings: FormSettings = { ...settings, ...newSettings };

        if (isValidSettingsObject(formSettings)) {
            setSettings(formSettings);
            setWords(getWords(formSettings));
            toast.info("Words Generated");
        } else {
            toast.error("No words generated. Invalid Settings");
        }
    };

    return (
        <div className="app">
            <div className="header">
                <h1>Generate Typing Practice Words</h1>
                <p>Generate a list of practice words with the charachters you provide</p>
            </div>
            <form className="app-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="chars" className="form-label">
                        Characters
                    </label>
                    <input
                        ref={charsInput}
                        id="chars"
                        name="chars"
                        type="text"
                        minLength={defaultLimits.chars.min}
                        maxLength={defaultLimits.chars.max}
                        className="form-control"
                        defaultValue={settings.chars}
                        aria-describedby="titleHelp"
                        required={true}
                    />
                    <small id="titleHelp" className="form-text text-muted">
                        Characters to create random words from (minimum {defaultLimits.chars.min} charachters, maximum {defaultLimits.chars.max} characters)
                        <br />
                        Duplicate characters are allowed.
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="words" className="form-label">
                        Words to generate
                    </label>
                    <input
                        ref={wordsToGenerateInput}
                        id="wordsToGenerate"
                        name="wordsToGenerate"
                        type="number"
                        min={defaultLimits.wordsToGenerate.min}
                        max={defaultLimits.wordsToGenerate.max}
                        className="form-control"
                        defaultValue={settings.wordsToGenerate}
                        aria-describedby="wordsHelp"
                        required={true}
                    />
                    <small id="word-lengthHelp" className="form-text text-muted">
                        Words to generate (minimum {defaultLimits.wordsToGenerate.min} word, maximum {defaultLimits.wordsToGenerate.max} words)
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="wordLength" className="form-label">
                        Word Length
                    </label>
                    <input
                        ref={wordLengthInput}
                        id="wordLength"
                        name="wordLength"
                        type="number"
                        min={defaultLimits.wordLength.min}
                        max={defaultLimits.wordLength.max}
                        className="form-control"
                        defaultValue={settings.wordLength}
                        aria-describedby="wordLengthHelp"
                        required={true}
                    />
                    <small id="wordLengthHelp" className="form-text text-muted">
                        Maximum characters in a word (minimum {defaultLimits.wordLength.min} characters, maximum {defaultLimits.wordLength.max} characters)
                    </small>
                </div>
                <div className="form-group">
                    <div className="form-check">
                        <input
                            ref={randomWordLengthInput}
                            id="randomWordLength"
                            name="randomWordLength"
                            type="checkbox"
                            className="form-check-input"
                            defaultChecked={settings.randomWordLength}
                            aria-describedby="randomWordLengthHelp"
                        />
                        <label htmlFor="randomWordLength" className="form-check-label">
                            Create words with random length
                        </label>
                    </div>
                    <small id="randomWordLengthHelp" className="form-text text-muted">
                        Uses word length set above for longest word length
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="wordLength" className="form-label">
                        Columns
                    </label>
                    <input
                        ref={sentenceLengthInput}
                        id="columns"
                        name="columns"
                        type="number"
                        min={defaultLimits.columns.min}
                        max={defaultLimits.columns.max}
                        className="form-control"
                        defaultValue={settings.columns}
                        aria-describedby="wordLengthHelp"
                        required={true}
                    />
                    <small id="wordLengthHelp" className="form-text text-muted">
                        Maximum colums for the word list (minimum {defaultLimits.columns.min} column, maximum {defaultLimits.columns.max} columns)
                    </small>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        Generate Words
                    </button>
                </div>
            </form>

            <div className="wordlist" ref={results}>
                {words.length > 0 && (
                    <p>
                        Words generated: {words.length}
                        <br />
                        Duplicate words: {words.length - new Set(words).size}
                    </p>
                )}
                {words.length > 0 && <pre>{convertWordsToString(words, settings.columns)}</pre>}
            </div>
            <ToastContainer />
        </div>
    );
}

export default App;
