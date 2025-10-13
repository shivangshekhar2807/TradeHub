

const Validator = (productName, price, images, available) => {
  if (!productName) {
    return { success: false, error: "Product name is required" };
  }
  if (!price) {
    return { success: false, error: "Price is required" };
  }
  if (!images || !Array.isArray(images) || images.length === 0) {
    return { success: false, error: "At least one image is required" };
  }
 
  if (available === undefined) {
    return { success: false, error: "Available status is required" };
  }

  return { success: true };
};



const editprofileValidation = (data) => {
  const isAllowed = ["firstName", "lastName", "phone", "photoUrl","city"];
  
  const keys = Object.keys(data);

  const isValid = keys.every((key) => isAllowed.includes(key));

  if (!isValid) {
    throw new Error("Cannot edit non-editable fields");
  }

  return true;

}


const postUserProductValidation = (data) => {
  const isAllowed = [
    "userId",
    "contactNo",
    "about",
    "originalprice",
    "sellingPrice",
    "purchaseDate",
    "totalUsed",
    "productImg",
    "productType",
    
  ];


  const keys = Object.keys(data);

  const isValid = keys.every((key) => isAllowed.includes(key));

  if (!isValid) {
    throw new Error("Cannot create a product with some random fields")
  }
  return true;
}



const editUserProductValidation = (data) => {
  const isAllowed = [
    "productType",
    "productImg",
    "totalUsed",
    "purchaseDate",
    "sellingPrice",
    "originalprice",
    "about",
    "city"
  ];

  const keys = Object.keys(data);

  const isValid = keys.every((key) => isAllowed.includes(key));

   if (!isValid) {
     throw new Error("Cannot edit non-editable fields");
   }
  
  return true;
}


module.exports = {
  Validator,
  editprofileValidation,
  postUserProductValidation,
  editUserProductValidation,
};