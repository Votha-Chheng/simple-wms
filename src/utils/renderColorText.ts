import Product from "../classes/Product"

export const renderColorText = (product: Product, forText: boolean, colorAlert: string, colorNormal: string, colorCommande: string = "orange") : string =>{
  if(forText === true){
    return product.qty <= product.stockLimite ? colorAlert : colorNormal
    
  } else {
    return (product.qty <= product.stockLimite) && product.commandeEncours === true ? colorCommande : product.qty <= product.stockLimite ? colorAlert : colorNormal

  }
}