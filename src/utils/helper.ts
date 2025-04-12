import moment from "moment";
import { Timestamp } from "firebase/firestore";

export function timeStampToDate(timestamp: Timestamp) {
  const createdAtDate = timestamp.toDate();
  const formattedDate = moment(createdAtDate).format("DD MMMM YYYY");
  return formattedDate;
}
