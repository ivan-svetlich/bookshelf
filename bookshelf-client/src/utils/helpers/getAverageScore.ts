import BookEntry from "../../types/bookEntry";

function getAverageSCore(list: BookEntry[]) {
  if (list.length) {
    try {
      const scores = list
        .filter((item) => item.score)
        .map((item) => Number(item.score));
      const sumReducer = (previousValue: number, currentValue: number) =>
        previousValue + currentValue;
      const averageScore = scores.reduce(sumReducer) / scores.length;
      return Math.round((averageScore + Number.EPSILON) * 100) / 100;
    } catch {
      return "-";
    }
  }
  return "-";
}

export default getAverageSCore;
