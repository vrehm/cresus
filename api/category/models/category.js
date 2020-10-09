// const slugify = require('slugify');
const slugid = require('slugid');

module.exports = {
    /**
     * Triggered before category creation.
     */
    lifecycles: {
        async beforeCreate(data) {
            // const string = data.name + '-' + data.owner + '-' + new Date().getTime();
            const slug = slugid.nice();
            data.slug = slug;
        },
        async beforeUpdate(params, data) {
            // const string = data.name + '-' + data.owner + '-' + new Date().getTime();
            const slug = slugid.nice();
            data.slug = slug;
        },
    },
};