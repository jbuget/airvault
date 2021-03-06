<template>
  <div class="item-summary-list">
    <div class="search">
      <div class="search__input">
        <font-awesome-icon icon="search"/>
        <input autocapitalize="none" spellcheck="false" type="search" placeholder="Search" v-model="search">
      </div>
      <button class="add__button" @click="addNewItem()">
        <font-awesome-icon icon="plus"/>
      </button>
    </div>
    <ul v-if="items.length > 0">
      <li v-for="item in filteredItems" :key="item.id" :class="{ active: item.id === currentItemId }">
        <div class="item-summary" @click="setCurrentItem(item)">
          <div class="item-summary__icon">
            <font-awesome-icon icon="id-card-alt"/>
          </div>
          <div class="item-summary__content">
            <span class="item-summary__title">{{ item.title }}</span>
            <span class="item-summary__username">{{ item.username }}</span>
          </div>
        </div>
      </li>
    </ul>
    <div v-else>
      This vault currently contains no items.
    </div>
  </div>
</template>

<script>
export default {
  props: ['items'],

  data() {
    return {
      search: '',
    }
  },

  computed: {
    filteredItems() {
      if (this.items) {
        return this.items.filter(item => {
          return item.title.toLowerCase().includes(this.search.toLowerCase())
              || item.username.toLowerCase().includes(this.search.toLowerCase())
        })
      }
      return [];
    },

    currentItemId() {
      if (this.$store.getters.currentItem) {
        return this.$store.getters.currentItem.id
      }
      return null;
    }
  },

  methods: {
    addNewItem() {
      const currentVault = this.$store.getters.currentVault
      const selectedVaultId = currentVault ? currentVault.id : this.$store.getters.vaults[0].id
      const newItem = {
        id: null,
        title: null,
        username: null,
        password: null,
        website: null,
        vault_id: selectedVaultId
      }
      this.$store.dispatch('setCurrentItem', newItem)
    },

    setCurrentItem(item) {
      this.$store.dispatch('setCurrentItem', item)
    }
  }
}
</script>

<style>

ul, li, ol {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.item-summary-list {
  min-width: 300px;
  width: 300px;
  border-right: 1px solid lightgrey;
  display: flex;
  flex-direction: column;
}

.item-summary-list ul {
  background-color: white;
  overflow-y: auto;
}

li.active {
  border-right: 4px solid #e72f4e;
  background-color: rgba(121,82,179,0.1);
}

.item-summary {
  padding: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.item-summary:hover {
  background-color: rgba(121,82,179,0.1);
}

.item-summary__icon {
  width: 32px;
  height: 32px;
  border-radius: 5px;
  background-color: whitesmoke;
  border: 1px solid lightgrey;
  box-sizing: border-box;
  margin-right: 10px;
  color: darkgrey;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-summary__content {
  display: flex;
  flex-direction: column;
}

.item-summary__title {
  display: block;
  font-weight: 600;
}

.item-summary__username {
  display: block;
}

.search {
  border-bottom: 1px solid lightgrey;
  display: flex;
  justify-content: stretch;
  background-color: #F6F5FA;
}

.search__input {
  border-radius: 20px;
  padding: 0 10px;
  box-sizing: border-box;
  margin: 10px;
  border: 1px solid lightgrey;
  background-color: white;
  display: flex;
  align-items: center;
  flex: 1;
}
.search__input:focus-within {
  border-color: #e72f4e;
}

.search__input > svg {
  color: lightgrey;
}

.search__input > input {
  border: none;
  outline-style: none;
  box-shadow: none;
  padding: 6px;
  line-height: 24px;
  background-color: transparent;
  flex: 1;
}

.search__input > input:focus {
  outline: none;
  outline-offset: -4px;
}

.add__button {
  border-radius: 50%;
  width: 38px;
  height: 38px;
  cursor: pointer;
  border: 1px solid lightgrey;
  margin: 10px 10px 10px 0;
  background-color: transparent;
}
.add__button:hover {
  border-color: #e72f4e;
  color: #e72f4e;
  background-color: white;
}
</style>
