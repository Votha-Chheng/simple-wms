export default class ProductDto {
  barcodeNumber: string
  marque: string;
  nom: string;
  categoryId: string;
  qty: number;
  stockLimite: number;
  telFournisseur?: string;
  siteFournisseur?: string;
}