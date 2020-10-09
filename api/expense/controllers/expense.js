const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
    /**
     * Retrieve all records based on user.
     *
     * @return {Object}s
     */

    async find(ctx) {
        let entities;

        ctx.query = {
            ...ctx.query,
            owner: ctx.state.user.id,
        };

        if (ctx.query._q) {
            entities = await strapi.services.expense.search(ctx.query);
        } else {
            entities = await strapi.services.expense.find(ctx.query);
        }

        return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.expense }));
    },

    /**
     * Count records based on user.
     *
     * @return {Number}
     */

    count(ctx) {
        ctx.query = {
            ...ctx.query,
            owner: ctx.state.user.id,
        };

        if (ctx.query._q) {
            return strapi.services.expense.countSearch(ctx.query);
        }
        return strapi.services.expense.count(ctx.query);
    },

    /**
     * Retrieve a record.
     *
     * @return {Object}
     */

    async findOne(ctx) {
        const { slug } = ctx.params;

        const expense = await strapi.services.expense.findOne({
            slug,
            'owner.id': ctx.state.user.id,
        });

        if (!expense) {
            return ctx.unauthorized(`You can't fetch this entry`);
        }

        return sanitizeEntity(expense, { model: strapi.models.expense });
    },

    /**
     * Create a record.
     *
     * @return {Object}
     */

    async create(ctx) {
        let entity;
        let { category } = ctx.request.body;
        const [search] = await strapi.services.category.find({ name: category });

        if (!search) {
            category = await strapi.services.category.create({ name: category, owner: ctx.state.user.id });
            ctx.request.body.category = category;
        } else {
            ctx.request.body.category = search;
        }

        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            data.owner = ctx.state.user.id;
            entity = await strapi.services.expense.create(data, { files });
        } else {
            ctx.request.body.owner = ctx.state.user.id;
            entity = await strapi.services.expense.create(ctx.request.body);
        }

        return sanitizeEntity(entity, { model: strapi.models.expense });
    },

    /**
     * Update a record.
     *
     * @return {Object}
     */

    async update(ctx) {
        const { id } = ctx.params;

        let entity;

        const [expense] = await strapi.services.expense.find({
            id: ctx.params.id,
            'owner.id': ctx.state.user.id,
        });

        if (!expense) {
            return ctx.unauthorized(`You can't update this entry`);
        }

        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.services.expense.update({ id }, data, {
                files,
            });
        } else {
            entity = await strapi.services.expense.update({ id }, ctx.request.body);
        }

        return sanitizeEntity(entity, { model: strapi.models.expense });
    },

    /**
     * Delete a record.
     *
     * @return {Object}
     */

    async delete(ctx) {
        const { id } = ctx.params;

        let entity;

        const [expense] = await strapi.services.expense.find({
            id: ctx.params.id,
            'owner.id': ctx.state.user.id,
        });

        if (!expense) {
            return ctx.unauthorized(`You can't delete this entry`);
        }

        entity = await strapi.services.expense.delete({ id });

        return sanitizeEntity(entity, { model: strapi.models.expense });
    },
};