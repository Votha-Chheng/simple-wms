import { Model } from "@nozbe/watermelondb"
import { date, text, writer } from "@nozbe/watermelondb/decorators"


export default class CategoryModel extends Model {
  static table = "categories"

  @text("nom") nom: string
  @date("created_at") createdAt: Date
  @date("updated_at") updatedAt: Date

  @writer async updateCategoryName (newName: string): Promise<boolean> {
    try{
      await this.update((category: CategoryModel) => {
        category.nom = newName
      })
      return true
    }catch (error) {
      console.log("Error coming from upadateCategoryName : " + error.message)
      return false
    }
  }

  @writer async deleteSingleCategoryModel():Promise<boolean> {
    try {
      await this.destroyPermanently()
      return true
    } catch (error) {
      console.log("Error coming from deleteSingleCategoryModel : " + error.message)
      return false
    }
  }

}
