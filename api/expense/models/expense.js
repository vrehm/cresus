// const slugify = require('slugify');
const slugid = require('slugid');

module.exports = {
    /**
     * Triggered before expense creation.
     */
    lifecycles: {
        async beforeCreate(data) {
            // const string = data.dateOp.split('T')[0] + '-' + data.label + '-' + data.owner + '-' + new Date().getTime();
            const { category, owner } = data

            if (typeof category == 'string') {
                const [search] = await strapi.services.category.find({ name: category });

                if (!search) {
                    category = await strapi.services.category.create({ name: category, owner });
                    data.category = category;
                } else {
                    data.category = search;
                }
            }

            const slug = slugid.nice();
            data.slug = slug;
        },
        async beforeUpdate(params, data) {
            // const string = data.dateOp.split('T')[0] + '-' + data.label + '-' + data.owner + '-' + new Date().getTime();
            const slug = slugid.nice();
            data.slug = slug;
        },
    },
};