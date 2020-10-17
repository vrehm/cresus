module.exports = ({ env }) => ({
    email: {
        provider: "sendmail",
        settings: {
            defaultFrom: "contact@vincentrehm.fr",
            defaultReplyTo: "contact@vincentrehm.fr",
        },
    },
});