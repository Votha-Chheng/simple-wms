import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    margin:7.5
  },
  loader : {
    flex: 1,
    justifyContent : "center",
    alignItems: "center",
    width:"100%",
    height: "100%"
  }, 
  input : {
    marginBottom:10,
    fontSize:15, 
    padding:0,
    width: '100%'
  },

  screenTitle: {
    fontSize: 20,
    textAlign:"center",
    fontFamily:"Roboto-Bold"
  },
  infoQty: {
    width: "25%",
    justifyContent: "center",
    alignItems: 'center',
    fontFamily: "Rubik-Light"
  },
  categorie: {
    fontSize: 12.5,
    fontFamily: "Inter-Medium",
    marginVertical:2.5,
    alignSelf: 'center'
  },
  marque: {
    fontSize: 20,
    fontFamily: "Rubik-MediumItalic",
    marginVertical:2.5
  },
  nom: {
    fontSize: 17,
    fontFamily: "Rubik-SemiBoldItalic",
    marginVertical:2.5,
    alignSelf: 'center'
  },
  qty: {
    fontFamily: "Rubik-SemiBold",
  },
  inpuQty : {
    marginBottom:10,
    fontSize:15, 
    padding:0,
    width:175,
    textAlign: "center"
  },
  buttonRow:{
    flexDirection:"row",
    justifyContent:'space-around',
    marginTop:10
  },
  seeContainer: {
    borderColor: "black",
    borderWidth:1
  },
  roundButton: {
    width:75,
    height: 75,
    borderRadius:75,
    position: "absolute",
    right:50,
    bottom:20
  },
  flexRowButtons: {
    flexDirection:"row",
    marginHorizontal:10,
    marginVertical:15,
    justifyContent:"center"
  },
  flexRow : {
    flexDirection:"row",
  },
  modalStyle : {
    backgroundColor: '#f8f4f9', 
    padding: 10,
    maxHeight:250,
    fontWeight: '900'
  },
  scanInOutTitle: {
    fontFamily:"Inter-Medium",
    textAlign:"center", 
    alignSelf:"center", 
    fontSize:25, 
    color:"white"
  }
})

export default globalStyles