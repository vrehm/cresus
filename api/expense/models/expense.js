const slugify = require('slugify');

module.exports = {
    /**
     * Triggered before expense creation.
     */
    lifecycles: {
        async beforeCreate(data) {
            const slug = slugify(data.dateOp.split('T')[0] + ' ' + data.label, { lower: true });
            data.slug = slug;
        },
        async beforeUpdate(params, data) {
            const slug = slugify(data.dateOp.split('T')[0] + ' ' + data.label, { lower: true });
            data.slug = slug;
        },
    },
};