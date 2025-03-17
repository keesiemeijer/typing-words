import { FormSettings, defaultSettings, defaultLimits } from "../App";

export const isObject = (item: any) => {
    return typeof item === "object" && !Array.isArray(item) && item !== null && item !== undefined;
};

export const sanitizeSettings = (settings: FormSettings): FormSettings => {
    const validKeys = Object.keys(defaultSettings);
    // Removes all properties not in  DateListItemDefault
    Object.keys(settings).forEach((key) => validKeys.includes(key) || delete settings[key as keyof FormSettings]);

    return settings;
};

export const isValidSettingsObject = (settings: FormSettings): boolean => {
    // Return false if the settings is not an object
    if (!isObject(settings)) {
        console.log("not an object");
        return false;
    }

    // All types from the interface FormSettings
    const strings = ["chars"];
    const numbers = ["wordsToGenerate", "wordLength", "columns"];
    const booleans = ["randomWordLength"];

    const types = strings.concat(numbers, booleans);

    // Check type keys is the same as default keys
    // Just to make sure we validate every property
    const defaults = Object.keys(defaultSettings);
    if (types.sort().join("") !== defaults.sort().join("")) {
        console.log(types, " - types doesn't match defaults");
        return false;
    }

    const isValid = types.every((key) => {
        if (!settings.hasOwnProperty(key)) {
            console.log(key + " - property doesn't exist");
            return false;
        }

        const typeValue = settings[key as keyof FormSettings];

        if (strings.indexOf(key) > -1) {
            if (typeof typeValue === "string") {
                if ("chars" === key && typeValue.trim().length < 2) {
                    console.log(typeValue + " - Not enough chars");
                    return false;
                }
            } else {
                console.log(key + " - not a string");
                return false;
            }
        }

        if (booleans.indexOf(key) > -1) {
            if (typeof typeValue !== "boolean") {
                console.log(key + " - not a boolean");
                return false;
            }
        }

        if (numbers.indexOf(key) > -1) {
            if (typeof typeValue === "number") {
                if ("words" === key && typeValue < 1) {
                    console.log(key + " - Not enough words");
                    return false;
                }
                if ("wordLength" === key && typeValue < 2) {
                    console.log(key + " - Not enough caracters");
                    return false;
                }
            } else {
                console.log(key + " - Not a number");
                return false;
            }
        }
        return true;
    });

    if (isValid) {
        return isValidLimits(settings);
    }
    return false;
};

const isValidLimits = (settings: FormSettings): boolean => {
    return ["chars", "wordsToGenerate", "wordLength", "columns"].every((key) => {
        let keyValue = settings[key as keyof FormSettings];
        if (key === "chars" && typeof keyValue === "string") {
            keyValue = keyValue.length;
        }

        if (typeof keyValue !== "number") {
            console.log(key + " - Limit not a number");
            return false;
        }

        if (keyValue > defaultLimits[key]["max"]) {
            console.log(key + " - Over limit");
            return false;
        }

        if (keyValue < defaultLimits[key]["min"]) {
            console.log(key + " - Under limit");
            return false;
        }

        return true;
    });
};
