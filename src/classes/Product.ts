import Category from "./Category";

export default class Product {
  id: string;
  barcodeNumber: string;
  marque: string;
  nom: string;
  category: Category;
  qty: number;
  stockLimite: number;
  commandeEncours: boolean;
  telFournisseur?: string;
  siteFournisseur?: string;

  constructor(  
    id: string,
    barcodeNumber: string,
    marque: string,
    nom: string,
    qty: number,
    stockLimite: number,
    category: Category,
    commandeEncours: boolean,
    telFournisseur?: string,
    siteFournisseur?: string,
  ) {
    this.id = id;
    this.barcodeNumber = barcodeNumber;
    this.marque = marque;
    this.nom = nom;
    this.qty = qty;
    this.stockLimite = stockLimite;
    this.category = category;
    this.telFournisseur = telFournisseur;
    this.siteFournisseur = siteFournisseur;
    this.commandeEncours = commandeEncours;

  }
}