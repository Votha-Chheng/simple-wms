import { Filters } from "../classes/Filters"
import Product from "../classes/Product"
import CategoryModel from "../models/CategoryModel"
import ProductModel from "../models/ProductModel"

export const sortHandle = (filters: any, a: any, b: any, typeSecond: string = "")=> {
  const {parType} = filters

  let x = typeSecond === "" ? a[parType.toString()] : a[parType.toString()][typeSecond]
  let y = typeSecond === "" ? b[parType.toString()] : b[parType.toString()][typeSecond]

  return ((x < y) ? -1 : ((x > y) ? 1 : 0))

}


export const replaceCollection = (elementToScan: any)=>{
  return (
    elementToScan
      .toLowerCase()
      .replace(/[û, ü, ù]/g, "u")
      .replace(/[é, è, ë, ê]/g, "e")
      .replace(/[â, ä, à]/g, "a")
      .replace(/[ô, ö, à]/g, "o")
      .replace(/[ï, î]/g, "i")
  )  
}

export const matchingIncludes = (element: Product, keyName:string, textToScan:string)=>{
  const newResearch = replaceCollection(element[keyName])
  const newTextToScan = replaceCollection(textToScan)

  return newResearch.includes(newTextToScan)
}

export const handleSearchChange = (text: string, productList: Product[]): Product[]=>{
  if(text.length>1){
    let result = []

    productList.forEach((element: Product) => {
      if(matchingIncludes(element, "nom", text) || matchingIncludes(element, "marque", text)){
        result.push(element)
      }
    })

    return result
  }
}

export const displayProductByFilters = (productList: ProductModel[], filters: Filters, selectedMarqueOrCategory: string, categoriesCollection: CategoryModel[]): Product[]=>{
  const { parType, ordreAlphabet, recent, alertStock, searchByText, unreadableBarcode } = filters

  let temp : Product[] = [...productList]
  
  temp = recent ? temp.reverse() : temp

  if(parType === ""){

    if(searchByText.length>1){
      temp = handleSearchChange(searchByText, temp)
    }
  }

  if(parType === "marque"){
    temp = temp.sort((a,b) => sortHandle(filters, a, b)) 

    if(ordreAlphabet === false){
      temp = temp.reverse()
    }

    if(selectedMarqueOrCategory!==null){
      temp = temp.filter(prod => prod.marque.trim() === selectedMarqueOrCategory)
    } 
  } else if(parType === "category") {
    temp = temp.sort((a,b) => sortHandle(filters, a, b, "nom")) 
    
    if(ordreAlphabet === false){
      temp = temp.reverse()
    }

    if(selectedMarqueOrCategory!==null){
      const category = categoriesCollection.find(cat=> cat.nom === selectedMarqueOrCategory)
      temp = temp.filter(prod => prod.category.id === category.id)

    }
  }

  if(unreadableBarcode){
    temp = temp.filter(p => p.barcodeNumber.includes("manual_"))
  }
  if(alertStock){
    temp = temp.filter(p => p.qty <= p.stockLimite)
  }

  return temp
}