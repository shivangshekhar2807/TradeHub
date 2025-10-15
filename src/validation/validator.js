

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

  //  // Format hours and minutes with leading zeros
  //  const hours = String(dateObj.getHours()).padStart(2, "0");
  //  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  //  const time = `${hours}:${minutes}`;

  //  return { day, time };

   const dateObj = new Date(isoString);

   const days = [
     "Sunday",
     "Monday",
     "Tuesday",
     "Wednesday",
     "Thursday",
     "Friday",
     "Saturday",
   ];
   const day = days[dateObj.getDay()]; // local day

   const hours = dateObj.getHours(); // 0-23
   const minutes = dateObj.getMinutes();

   // Check if it's Wednesday and hour is between 15:00 and 15:59
   if (day === "Wednesday" && hours === 15) {
     return true;
   } else {
     return false;
   }
};


module.exports = {
  Validator,
  editprofileValidation,
  postUserProductValidation,
  editUserProductValidation,
  getDayAndTime,
};