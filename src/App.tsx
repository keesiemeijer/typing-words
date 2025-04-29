import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { getWords, convertWordsToString, getLimitText } from "./utils/utils";
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
    wordsToGenerate: 30,
    wordLength: 7,
    columns: 5,
    randomWordLength: false,
};

export interface Limits {
    [key: string]: { min: number; max: number };
}

export const defaultLimits: Limits = {
    chars: { min: 1, max: 500 },
    wordsToGenerate: { min: 1, max: 1000 },
    wordLength: { min: 1, max: 30 },
    columns: { min: 0, max: 15 },
};

export const pluralNouns: { [key: string]: string } = {
    word: "words",
    column: "columns",
    character: "characters",
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

    // Hook for when word string changes
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
            const wordsGenerated = getWords(formSettings);
            setSettings(formSettings);
            setWords(wordsGenerated);
            toast.info(wordsGenerated.length + " Words Generated");
        } else {
            toast.error("No words generated. Invalid Settings");
        }
    };

    return (
        <div className="app">
            <div className="header">
                <h1>
                    <span className="those-are">Those are </span>
                    <span className="typing-words">Typing Words</span>
                </h1>
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
                        Characters to create random words from (minimum {getLimitText(defaultLimits.chars.min, "character")}, maximum{" "}
                        {getLimitText(defaultLimits.chars.max, "character")}).
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
                        Words to generate (minimum {getLimitText(defaultLimits.wordsToGenerate.min, "word")}, maximum{" "}
                        {getLimitText(defaultLimits.wordsToGenerate.max, "word")}).
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
                        Maximum characters in a word (minimum {getLimitText(defaultLimits.wordLength.min, "character")}, maximum{" "}
                        {getLimitText(defaultLimits.wordLength.max, "character")}).
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
                            Create words with random length.
                        </label>
                    </div>
                    <small id="randomWordLengthHelp" className="form-text text-muted">
                        Uses word length set above for longest word length.
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
                        Word list columns (minimum {getLimitText(defaultLimits.columns.min, "column")}, maximum{" "}
                        {getLimitText(defaultLimits.columns.max, "column")}).
                        <br />
                        Colums are words seperated by spaces with line breaks after the column length.
                        <br />
                        Zero columns are words seperated by spaces without line breaks.
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
                {words.length > 0 && settings.columns > 0 && <pre>{convertWordsToString(words, settings.columns)}</pre>}
                {words.length > 0 && settings.columns === 0 && <p>{convertWordsToString(words, settings.columns)}</p>}
            </div>
            <ToastContainer />
        </div>
    );
}

export default App;
