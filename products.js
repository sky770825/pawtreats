/**
 * PawTreats 商品資料（雞肉 / 牛肉 / 6吋蛋糕 / 8吋蛋糕）
 */
(function (global) {
  global.PawTreatsProducts = [
    {
      id: "chicken",
      name: "低溫烘乾雞肉",
      tag: "乾燥零食",
      tagClass: "dehydrate",
      image: "product-pack.png",
      imageAlt: "低溫烘乾雞肉包裝示意",
      description: "純肉慢烘，薄脆好咬，訓練獎勵與日常點心都適合。",
      optionsType: "weight",
      options: [
        { id: "100g", label: "100g", price: 280 },
        { id: "200g", label: "200g", price: 520 },
        { id: "300g", label: "300g", price: 720 },
      ],
    },
    {
      id: "beef",
      name: "低溫烘乾牛肉",
      tag: "訓練獎勵",
      tagClass: "training",
      image: "product-pack.png",
      imageAlt: "低溫烘乾牛肉包裝示意",
      description: "香氣濃郁、一口大小，讓挑嘴毛孩也難以抗拒。",
      optionsType: "weight",
      options: [
        { id: "100g", label: "100g", price: 320 },
        { id: "200g", label: "200g", price: 600 },
        { id: "300g", label: "300g", price: 840 },
      ],
    },
    {
      id: "cake-6",
      name: "寵物生日蛋糕 6吋",
      tag: "慶生款",
      tagClass: "celebration",
      image: "product-pack.png",
      imageAlt: "寵物生日蛋糕 6 吋包裝示意",
      description: "特別日子專屬，天然配方慶祝每一歲的陪伴。",
      optionsType: "size",
      showCelebrationIcon: true,
      options: [{ id: "6inch", label: "6 吋", price: 680 }],
    },
    {
      id: "cake-8",
      name: "寵物生日蛋糕 8吋",
      tag: "慶生款",
      tagClass: "celebration",
      image: "product-pack.png",
      imageAlt: "寵物生日蛋糕 8 吋包裝示意",
      description: "多人同慶、大型犬與派對分享，份量更滿足。",
      optionsType: "size",
      showCelebrationIcon: true,
      options: [{ id: "8inch", label: "8 吋", price: 980 }],
    },
  ];

  /**
   * @param {string} productId
   * @param {string} optionId
   * @returns {{ product: object, option: object } | null}
   */
  global.PawTreatsResolveProductOption = function (productId, optionId) {
    var products = global.PawTreatsProducts;
    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      if (p.id !== productId) continue;
      for (var j = 0; j < p.options.length; j++) {
        var o = p.options[j];
        if (o.id === optionId) return { product: p, option: o };
      }
    }
    return null;
  };
})(typeof window !== "undefined" ? window : this);
