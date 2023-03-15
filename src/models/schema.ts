import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "categories",
      columns: [
        { name: "nom", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ]
    }),
    tableSchema({
      name: "products",
      columns: [
        { name: "barcode_number", type: "string"},
        { name: "marque", type: "string"},
        { name: "nom", type: "string"},
        { name: "qty", type: "number"},
        { name: "stock_limite", type: "number"},
        { name: "commande_en_cours", type: "boolean"},
        { name: "category_id", type: "string", isIndexed: true},
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "tel_fournisseur", type: "string", isOptional: true},
        { name: "site_fournisseur", type: "string", isOptional: true}
      ]
    })
  ]
})
