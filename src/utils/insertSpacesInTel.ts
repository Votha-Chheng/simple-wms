export const insertSpacesInTel = (tel: string): string => {
  let arrTel: string[] = []
  let num : string

  if(tel){
    for(let i = 0; i<=tel.length; i++){
      num = tel.charAt(i)
      if(i%2===0 && tel.length>1 && i>0){
        arrTel = [...arrTel, " ", num]

      } else {
        arrTel = [...arrTel, num]

      }
    }
  }
  
  return arrTel.join("")
}