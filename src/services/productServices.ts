import { database } from "../db"
import Product from "../classes/Product"
import ProductModel from "../models/ProductModel"
import ServiceResponse from "../classes/ServiceResponse"
import ProductDto from "../classes/ProductDto"
import { Q } from "@nozbe/watermelondb"
import { Dispatch, SetStateAction } from "react"
import { showToast } from "../utils/showToast"

//Observers
export const observeProductsList = (setter: Dispatch<SetStateAction<ProductModel[]>>): Function=> {
  const collection = database.get<ProductModel>('products')
  const query = collection.query().observe()
  const subscription = query.subscribe((records)=> {
    setter(records)    
  })
  return ()=> subscription.unsubscribe()
}

//Async services
export const getProductModelCollection = async(): Promise<ProductModel[]> => {
  try {
    return await database.get<ProductModel>('products').query().fetch()
  } catch (error) {
    console.log("Error coming from getProductModelCollection : " + error.message)
    return undefined
  }
}

export const getProducts = async(): Promise<Product[]>=> {
  try {
    const collection = await getProductModelCollection()

    if(collection.length>0){
      return await Promise.all(
        collection.map(async(prodModel: ProductModel): Promise<Product>=> prodModel.instantiateProductModel() 
      ))
    }
  } catch (error) {
    console.log("Error coming from getProducts : " + error.message)
    return undefined
  }
}

export const findProductModelById = async(id: string): Promise<ProductModel> => {
  try {
    return await database.get<ProductModel>("products").find(id)
    
  } catch (error) {
    console.log("Error coming from findProductByIdAsync : " + error.message)
    return undefined
  }
}

export const findProductModelByBarcode = async(barcode: string): Promise<ProductModel> => {
  try{
    const productModel = await database
      .get<ProductModel>('products')
      .query(
        Q.where("barcode_number", barcode))
      .fetch()
    return productModel[0]

  } catch (error){
    console.log("Error coming from findProductModelByBarcode : " + error.message)
    return undefined
  }
}

export const deleteSingleProductWithoutCascadeAsync = async(id: string): Promise<ServiceResponse>=> {
  let message: ServiceResponse = {status: "Pending", data: null}

  try {
    const record: ProductModel = await findProductModelById(id)
    
    if(record){
      await record.destroyPermanently()
      message = {
        status: "Success",
        data: null
      }
    }
  } catch (err) {
    message = {
      status: "Rejected",
      data: null
    }
  }
  return message
}

export const deleteProductsWithoutCascadeAsync = async(): Promise<ServiceResponse> => {
  let message: ServiceResponse = {status: "Pending", data: null}

  try {
    await database.write(async () => {
      const records = await getProductModelCollection()

      if(records){
          records.map(async(record: ProductModel) => {
          await record.destroyPermanently();
        });
        
        message = {
          status: "Success",
          data: null
        }
      }
    })
  } catch (err) {
    message = {
      status: "Rejected",
      data: null
    }
  }
  return message
}

export const deleteAllTablesAsync = async(): Promise<ServiceResponse> => {
  let message: ServiceResponse = {status: "Pending", data: null}

  try {
    await database.write(async() => {
      await database.adapter.unsafeResetDatabase()

      message = {
        status: "Success",
        data: null
      }
    })
  } catch (err) {
    message = {
      status: "Rejected",
      data: null
    }
  }
  return message
}

export const createProduct = async (body: ProductDto): Promise<ServiceResponse>=> {
  let response: ServiceResponse = {status: "Pending", data: null}

  try {
    await database.write(async () => {
      const result: ProductModel = await database.get<ProductModel>("products").create((product: ProductModel) => {
        product.telFournisseur = body.telFournisseur
        product.siteFournisseur = body.siteFournisseur
        product.barcodeNumber = body.barcodeNumber
        product.nom = body.nom
        product.marque = body.marque
        product.categoryId = body.categoryId
        product.qty = body.qty
        product.stockLimite = body.stockLimite
      }) 

      if(result){
        const prod: Product = await result.instantiateProductModel()
        if(prod){
          response = {
            status: "Success",
            data: prod
          }
        }
      }
    })
  } catch (err) {
    response = {
      status: "Rejected",
      data: err.message
    }
  }
  return response
}

export const setProductsFromCollection = async(setLoading: Dispatch<SetStateAction<boolean>>, setProducts: Dispatch<SetStateAction<Product[]>>): Promise<void>=> {
  try {
    setLoading(true)
    const prodList: Product[] = await getProducts()
    if(prodList && prodList.length>0){
      setProducts(prodList)
    }
    setLoading(false)
    
  } catch (error) {
    console.log("Error from setProductsFromCollection " + error.message)
    showToast("error", "Une erreur est survenue", "Problème pour charger l'inventaire.")
  }
}