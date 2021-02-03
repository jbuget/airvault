const ItemRepository = require('../../domain/ItemRepository');
const Item = require('../../domain/Item');
const ItemList = require('../../domain/ItemList');
const { build } = require('./sql-repository-factory');
const models = require('../../../db/models');
const { Op } = require('sequelize');

class ItemRepositorySql extends ItemRepository {

  async save(item) {
    let persistedModel;
    if (item.id) {
      persistedModel = await this.Model.findByPk(item.id);
      persistedModel.type = item.type;
      persistedModel.title = item.title;
      persistedModel.username = item.username;
      persistedModel.password = item.password;
      persistedModel.website = item.website;
      persistedModel.updatedAt = item.updatedAt;
      persistedModel.vaultId = item.vaultId;
      await persistedModel.save();
    } else {
      persistedModel = await this.Model.create(item);
    }
    return new Item(persistedModel);
  }

  async find({ accountId, query }) {
    let queryWhereClause;
    if (query) {
      const search = `%${query.trim()}%`;
      queryWhereClause = {
        [Op.or]: [
          { title: { [Op.iLike]: search }, },
          { username: { [Op.iLike]: search }, },
          { website: { [Op.iLike]: search }, },
        ]
      };
    }
    const itemModels = await this.Model.findAll({
      where: queryWhereClause,
      include: {
        model: models['Vault'],
        attributes: [],
        where: {
          accountId,
        }
      },
      order: [
        ['title', 'ASC']
      ]
    });
    const itemEntities = itemModels.map(model => new Item(model));
    return new ItemList(itemEntities);
  }

  async findAllByVaultId(vaultId) {
    const itemModels = await this.Model.findAll({ where: { vaultId } });
    const itemEntities = itemModels.map(model => new Item(model))
    return new ItemList(itemEntities);
  }

}

module.exports = build({
  modelName: 'Item',
  tableName: 'items',
  Entity: Item,
  Repository: ItemRepositorySql
});

