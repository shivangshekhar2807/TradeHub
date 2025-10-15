

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
    "productName",
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
    "city",
    "productName",
  ];

  const keys = Object.keys(data);

  const isValid = keys.every((key) => isAllowed.includes(key));

   if (!isValid) {
     throw new Error("Cannot edit non-editable fields");
   }
  
  return true;
}

const getDayAndTime = async (isoString) => {


  //  const dateObj = new Date(isoString);

  //  const days = [
  //    "Sunday",
  //    "Monday",
  //    "Tuesday",
  //    "Wednesday",
  //    "Thursday",
  //    "Friday",
  //    "Saturday",
  //  ];
  //  const day = days[dateObj.getDay()]; // local day

  //  const hours = dateObj.getHours(); // 0-23
  //  const minutes = dateObj.getMinutes();

  //  // Check if it's Wednesday and hour is between 15:00 and 15:59
  //  if (day === "Wednesday" && hours === 15) {
  //    return true;
  //  } else {
  //    return false;
  //  }

  console.log("createdAt (raw):", isoString);
  console.log("Local hours:", new Date(isoString).getHours());
  console.log("IST hours:", (new Date(isoString).getHours() + 5.5) % 24);
  console.log("getDayAndTime result:", valid);


   const dateObj = new Date(isoString);

   // Convert UTC → IST (+5 hours 30 minutes)
   const istTime = new Date(dateObj.getTime() + 5.5 * 60 * 60 * 1000);

   const hours = istTime.getHours();
   const minutes = istTime.getMinutes();

   // ✅ Between 12:00 AM and 12:59 AM IST
   return hours === 0 && minutes >= 0 && minutes < 60;
};


module.exports = {
  Validator,
  editprofileValidation,
  postUserProductValidation,
  editUserProductValidation,
  getDayAndTime,
};