/**
 * PawTreats 購物車 — localStorage
 * 品項鍵：productId + "::" + optionId
 */
(function (global) {
  var STORAGE_KEY = "pawtreats_cart_v1";

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  function lineKey(productId, optionId) {
    return productId + "::" + optionId;
  }

  function parseKey(key) {
    var parts = key.split("::");
    return { productId: parts[0], optionId: parts.slice(1).join("::") };
  }

  function getRawItems() {
    var raw = global.localStorage.getItem(STORAGE_KEY);
    var data = raw ? safeParse(raw) : null;
    if (!data || !Array.isArray(data.items)) return [];
    return data.items;
  }

  function saveRawItems(items) {
    global.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items: items, updatedAt: Date.now() })
    );
    dispatchChange();
  }

  function dispatchChange() {
    try {
      global.dispatchEvent(new CustomEvent("pawtreats-cart-changed"));
    } catch (e) {
      var ev = global.document.createEvent("Event");
      ev.initEvent("pawtreats-cart-changed", true, true);
      global.dispatchEvent(ev);
    }
  }

  global.PawTreatsCart = {
    lineKey: lineKey,
    parseKey: parseKey,

    getItems: function () {
      return getRawItems().map(function (row) {
        return {
          productId: row.productId,
          optionId: row.optionId,
          quantity: Math.max(1, parseInt(row.quantity, 10) || 1),
        };
      });
    },

    /** 加入購物車（累加數量） */
    addItem: function (productId, optionId, quantity) {
      var q = Math.max(1, parseInt(quantity, 10) || 1);
      var items = getRawItems();
      var found = false;
      for (var i = 0; i < items.length; i++) {
        if (items[i].productId === productId && items[i].optionId === optionId) {
          items[i].quantity = (parseInt(items[i].quantity, 10) || 1) + q;
          found = true;
          break;
        }
      }
      if (!found) {
        items.push({ productId: productId, optionId: optionId, quantity: q });
      }
      saveRawItems(items);
    },

    setQuantity: function (productId, optionId, quantity) {
      var q = parseInt(quantity, 10);
      if (isNaN(q) || q < 1) {
        this.removeItem(productId, optionId);
        return;
      }
      var items = getRawItems();
      for (var i = 0; i < items.length; i++) {
        if (items[i].productId === productId && items[i].optionId === optionId) {
          items[i].quantity = q;
          saveRawItems(items);
          return;
        }
      }
    },

    removeItem: function (productId, optionId) {
      var items = getRawItems().filter(function (row) {
        return !(row.productId === productId && row.optionId === optionId);
      });
      saveRawItems(items);
    },

    clear: function () {
      global.localStorage.removeItem(STORAGE_KEY);
      dispatchChange();
    },

    getItemCount: function () {
      var items = this.getItems();
      var n = 0;
      for (var i = 0; i < items.length; i++) {
        n += items[i].quantity;
      }
      return n;
    },

    /**
     * 計算小計（僅商品，不含運費）
     * 需載入 PawTreatsResolveProductOption
     */
    getSubtotal: function () {
      var items = this.getItems();
      var total = 0;
      for (var i = 0; i < items.length; i++) {
        var row = items[i];
        var resolved = global.PawTreatsResolveProductOption(
          row.productId,
          row.optionId
        );
        if (resolved) {
          total += resolved.option.price * row.quantity;
        }
      }
      return total;
    },
  };
})(typeof window !== "undefined" ? window : this);
