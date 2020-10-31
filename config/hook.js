module.exports = ({ env }) => ({
    settings: {
        algolia: {
            enabled: true,
            applicationId: env("ALGOLIA_APP_ID"),
            apiKey: env("ALGOLIA_KEY"),
            // debug: true, // default: false
        },
    },
});