

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


module.exports = Validator;