const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
    /**
     * Retrieve a record.
     *
     * @return {Object}
     */

    async findOne(ctx) {
        const { slug } = ctx.params;

        const entity = await strapi.services.expense.findOne({ slug });
        return sanitizeEntity(entity, { model: strapi.models.expense });
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
            entity = await strapi.services.article.create(data, { files });
        } else {
            ctx.request.body.owner = ctx.state.user.id;
            entity = await strapi.services.article.create(ctx.request.body);
        }
        return sanitizeEntity(entity, { model: strapi.models.article });
    },

    /**
     * Update a record.
     *
     * @return {Object}
     */

    async update(ctx) {
        const { id } = ctx.params;

        let entity;

        const [article] = await strapi.services.article.find({
            id: ctx.params.id,
            'owner.id': ctx.state.user.id,
        });

        if (!article) {
            return ctx.unauthorized(`You can't update this entry`);
        }

        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.services.article.update({ id }, data, {
                files,
            });
        } else {
            entity = await strapi.services.article.update({ id }, ctx.request.body);
        }

        return sanitizeEntity(entity, { model: strapi.models.article });
    },
};