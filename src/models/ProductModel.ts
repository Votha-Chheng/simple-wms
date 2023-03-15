import { Model } from "@nozbe/watermelondb";
import {Associations} from "@nozbe/watermelondb/Model/index"
import {  date, field, readonly, relation, text, writer } from "@nozbe/watermelondb/decorators"
import CategoryModel from "./CategoryModel";
import Product from "../classes/Product";
import { database } from "../db";
import ProductDto from "../classes/ProductDto";
import { findProductModelById } from "../services/productServices";

export default class ProductModel extends Model {
  static table = "products"

  static associations: Associations = {
    "categories": { type: 'has_many', foreignKey: 'category_id' }
  }

  static defaults = {
    commandeEncours: false,
  };

  
  @field("tel_fournisseur") telFournisseur: string
  @field("site_fournisseur") siteFournisseur: string
  @field("barcode_number") barcodeNumber: string
  @text("marque") marque: string
  @text("nom") nom: string
  @field("stock_limite") stockLimite: number
  @field("qty") qty: number
  @field("category_id") categoryId: string
  @field("commande_en_cours") commandeEncours: boolean
  @relation('categories', 'category_id') category: CategoryModel
  @readonly @date("created_at") createdAt: Date
  @date("updated_at") updatedAt: Date

  @writer async toggleComandeEncours(): Promise<ProductModel> {
    try {
      const result = await this.update((product: ProductModel) => {
        product.commandeEncours = !product.commandeEncours
      })
      return result
      
    } catch (error) {
      console.log("Error coming from toggleComandeEncours : " + error.message)
      return undefined
    }

  }
  @writer async setComandeEncours(trueOrFalse: boolean): Promise<boolean> {
    try {
      await this.update((product: ProductModel) => {
        product.commandeEncours = trueOrFalse
      })
      return true
      
    } catch (error) {
      console.log("Error coming from setComandeEncours : " + error.message)
      return false
    }
  }

  async instantiateProductModel(): Promise<Product> {
    try {
      const category = await database.get<CategoryModel>("categories").find(this.categoryId)
      if(category){
        return new Product(
          this.id, 
          this.barcodeNumber, 
          this.marque,
          this.nom,
          this.qty,
          this.stockLimite,
          category,
          this.commandeEncours,
          this.telFournisseur,
          this.siteFournisseur
        )
      }  
    } catch (error) {
      console.log("Error coming from instantiateProductModel : " + error.message)
      return undefined
    }
  }

  @writer async updateStock(adding: boolean, stockToAdd: number): Promise<boolean> {
    try {
      await this.update((prod: ProductModel) => {
        adding === true ? prod.qty += stockToAdd : prod.qty -= stockToAdd
      })
      return true
      
    } catch (error) {
      return false
    }

  }

  @writer async updateProductModelInformation(body: ProductDto): Promise<boolean>{
    try {
      await this.update((prod: ProductModel) => {
        prod.barcodeNumber = body.barcodeNumber
        prod.nom = body.nom
        prod.marque = body.marque
        prod.categoryId = body.categoryId
        prod.qty = body.qty
        prod.stockLimite = body.stockLimite
        prod.telFournisseur = body.telFournisseur
        prod.siteFournisseur = body.siteFournisseur
      })
      return true

    } catch (error) {
      console.log("Error coming from updateProductModelInformation : " + error.message)
      return false
    }
  }
}
