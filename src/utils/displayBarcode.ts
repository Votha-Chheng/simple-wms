export const displayBarcode = (barcode: string): string=> {
  let displayBarcode: string = barcode

  if(barcode.includes("manual_")){
    const temp = barcode.split("_")
    displayBarcode = temp[1]
  }
  return displayBarcode
}