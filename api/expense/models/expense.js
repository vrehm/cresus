// const slugify = require('slugify');
const slugid = require("slugid");
const index = "expenses";

module.exports = {
    /**
     * Triggered before expense creation.
     */
    lifecycles: {
        async beforeCreate(data) {
            // const string = data.dateOp.split('T')[0] + '-' + data.label + '-' + data.owner + '-' + new Date().getTime();
            const { category, owner } = data;

            if (typeof category == "string") {
                const [search] = await strapi.services.category.find({
                    name: category,
                    owner,
                });

                if (!search) {
                    category = await strapi.services.category.create({
                        name: category,
                        owner,
                    });
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

        async afterCreate(result, data) {
            strapi.services.algolia.saveObject(result, index);
        },
        async afterUpdate(result, params, data) {
            strapi.services.algolia.saveObject(result, index);
        },
        async afterDelete(result, params) {
            strapi.services.algolia.deleteObject(result.id, index);
        },
    },
};