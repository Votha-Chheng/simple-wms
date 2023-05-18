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
    width: '100%',
    backgroundColor:"white"
  },
  screenTitle: {
    fontSize: 20,
    textAlign:"center",
    fontFamily:"Roboto-Bold",
    color:"#6e6e72"
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
    alignSelf: 'center',
    color:"#6e6e72"
  },
  marque: {
    fontSize: 20,
    fontFamily: "Rubik-MediumItalic",
    marginVertical:2.5,
    color:"#6e6e72"
  },
  nom: {
    fontSize: 17,
    fontFamily: "Rubik-SemiBoldItalic",
    marginVertical:2.5,
    alignSelf: 'center',
    color:"#6e6e72"
  },
  qty: {
    fontFamily: "Rubik-SemiBold",
    color:"#6e6e72"
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
  modalStyle: {
    backgroundColor:'white', 
    paddingVertical:15, 
    paddingHorizontal:10, 
    borderRadius:10
  },
  scanInOutTitle: {
    fontFamily:"Inter-Bold",
    textAlign:"center", 
    alignSelf:"center", 
    fontSize:25, 
    color:"white",
    letterSpacing: 1,
    textShadowColor: 'black',
    textShadowOffset: {width: 1.5, height: 1.5},
    textShadowRadius: 1
  }
})

export default globalStyles