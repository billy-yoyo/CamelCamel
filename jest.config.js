process.env.apiConfig = 'apiConfig.json';

module.exports = {
    "roots": [
        "test/",
    ],
    "testMatch": [
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    }
};