import Answer from "./answer.service";
import DataBase from "./data-base.service";

const db = new DataBase();
const answer = new Answer();

export { db, answer };