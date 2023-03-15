import { Q } from "@nozbe/watermelondb"
import { database } from "../db"
import Category from "../classes/Category"
import CategoryModel from "../models/CategoryModel"
import ServiceResponse from "../classes/ServiceResponse"
import { Dispatch, SetStateAction } from "react"

//Observers
export const observeCategoriesList = (setter:Dispatch<SetStateAction<CategoryModel[]>>)=> {
  const collection = database.get<CategoryModel>('categories')
  const query = collection.query().observe()
  const subscription = query.subscribe((records) => {
    setter(records)
    
  })
  return ()=> subscription.unsubscribe()
}

//READ
export const getCategoryModelCollection = async(): Promise<CategoryModel[]> => {
  try {
    return await database.get<CategoryModel>('categories').query().fetch()
    
  } catch (error) {
    console.log(error)
    return undefined
  }
}

export const getCategories = async(): Promise<Category[]>=> {
  try {
    const collection = await getCategoryModelCollection()
    if(collection.length>0){
      return collection.map((catModel: CategoryModel)=> (
        new Category(catModel.id, catModel.nom)
      ))
    }
  } catch (error) {
    console.log(error)
    return undefined
  }
}

export const findCategoryModelById = async(id: string): Promise<CategoryModel> => {
  try {
    return await database.get<CategoryModel>('categories').find(id)
    
  } catch (error) {
    console.log("Error coming from findCategoryByIdAsync " + error.message)
    return undefined
  }
}

export const findCategoryById = (id: string, categoryCollection: CategoryModel[]): Category => {
    const category = categoryCollection.find((catModel: CategoryModel)=> catModel.id === id)
    if(category){
      return new Category(category.id, category.nom)
    } else {
      return undefined
    }

}

export const findCategoryModelByName = async(nom: string): Promise<CategoryModel> => {
  try {
    const category: CategoryModel[] = await database
      .get<CategoryModel>('categories')
      .query(
        Q.where("nom", nom))
      .fetch()
  
    return category[0]
    
  } catch (error) {
    console.log("Error coming from findCategoryByNameAsync " + error.message)
    return undefined
  }
}

//CREATE
export const createCategory = async (nom: string): Promise<ServiceResponse>=> {
  let response : ServiceResponse = {status: "Pending", data: null}

  try{
    await database.write(async () => {
      const result = await database.get<CategoryModel>('categories').create((category: CategoryModel) => {
        category.nom = nom
      }) 
      if(result) {
        response = {
          status: "Success",
          data: result
        }
      } 
    })  
  } catch(err) {
    response = {
      status : "Rejected",
      data: null
    }
  }
  return response
}

//UPDATE

//DELETE
// export const deleteSingleCategoryModel = async(id: string): Promise<ServiceResponse> =>{
//   try {
//     const cat = await findCategoryModelById(id)

//     if(cat) {
//       console.log("cat is found")
//       await cat.destroyPermanently()
//       return {
//         status: "Success", 
//         data: null
//       }
//     }
//   } catch (err) {
//     console.log("cat is not found")
//     return {
//       status: "Rejected", 
//       data: null
//     }
//   }
// }


