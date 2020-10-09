const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
    /**
     * Retrieve a record.
     *
     * @return {Object}
     */

    async findOne(ctx) {
        const { slug } = ctx.params;

        const category = await strapi.services.category.findOne({
            slug,
            'owner.id': ctx.state.user.id,
        });

        if (!category) {
            return ctx.unauthorized(`You can't fetch this entry`);
        }

        return sanitizeEntity(category, { model: strapi.models.category });
    },

    /**
     * Create a record.
     *
     * @return {Object}
     */

    async create(ctx) {
        let entity;
        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            data.owner = ctx.state.user.id;
            entity = await strapi.services.category.create(data, { files });
        } else {
            ctx.request.body.owner = ctx.state.user.id;
            entity = await strapi.services.category.create(ctx.request.body);
        }
        return sanitizeEntity(entity, { model: strapi.models.category });
    },

    /**
     * Update a record.
     *
     * @return {Object}
     */

    async update(ctx) {
        const { id } = ctx.params;

        let entity;

        const [category] = await strapi.services.category.find({
            id: ctx.params.id,
            'owner.id': ctx.state.user.id,
        });

        if (!category) {
            return ctx.unauthorized(`You can't update this entry`);
        }

        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.services.category.update({ id }, data, {
                files,
            });
        } else {
            entity = await strapi.services.category.update({ id }, ctx.request.body);
        }

        return sanitizeEntity(entity, { model: strapi.models.category });
    },
};