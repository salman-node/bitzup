
import  { v4 as uuidv4 } from 'uuid';





export const generateUniqueId = async (prefix:string, length:number) => {
  let uuid = uuidv4().replace(/-/g, "");
  let uuidLength = length - prefix.length;
  let trimmedUuid = uuid.substring(0, uuidLength);
  return (prefix + trimmedUuid).toUpperCase();
};
